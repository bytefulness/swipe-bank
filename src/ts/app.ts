// Modules
import * as Data from './Data.js';
import Dom from './Dom.js';
import * as Helper from './helper.js';

class App {
  public currentAccount!: any;
  private sorted!: boolean;
  private accountsData!: [];

  constructor() {
    // Check local storage
    if (localStorage.getItem('accounts') === null) {
      this.setDataToLocalStorage();
    }

    this.getLocalStorage();

    this.createUsernames(this.accountsData);

    // Event Listeners
    Dom.btnLogin.addEventListener('click', this.login.bind(this));
    Dom.btnTransfer.addEventListener('click', this.transfer.bind(this));
    Dom.btnLoan.addEventListener('click', this.loan.bind(this));
    Dom.btnClose.addEventListener('click', this.closeAccount.bind(this));
    Dom.btnSort.addEventListener('click', this.sortMovements.bind(this));
  }

  private createUsernames(accounts: object[]): void {
    accounts.forEach((account: any) => {
      account.username = account.owner
        .toLowerCase()
        .split(' ')
        .map((name: any) => name[0])
        .join('');
    });
  }

  private login(e: any): void {
    e.preventDefault();
    this.currentAccount = this.accountsData.find(
      (account: any) => account.username === Dom.inputLoginUsername!.value
    );

    if (this.currentAccount?.pin === +Dom.inputLoginPin.value) {
      // Display message
      Dom.labelWelcome.textContent = `Welcome back, ${
        this.currentAccount.owner.split(' ')[0]
      }`;
      // Display UI
      Dom.containerApp.style.opacity = '100';

      // Clear Inputs
      Helper.clearInput(Dom.inputLoginUsername, Dom.inputLoginPin);

      this.updateUI(this.currentAccount);
    } else {
      const message: string = 'Wrong id or password. Please try again.';
      Helper.displayMessage(message, 'error', 3);
    }
  }

  private updateUI(account: object) {
    this.displayMovements(account);
    this.caclDisplayBalance(account);
    this.calcDisplaySummary(account);
  }

  private displayMovements(account: any, sort: boolean = false): void {
    Dom.containerMovements.innerHTML = '';

    const movs: [] = sort
      ? [...account.movements].sort((a: any, b: any) => a - b)
      : account.movements;

    // Render movements list
    movs.forEach((mov: number, i: number) => {
      const type: string = mov > 0 ? 'deposit' : 'withdrawal';
      const date: any = new Date(account.movementsDates[i]);
      const displayDate: string = Helper.formatMovementDate(
        date,
        account.locale
      );

      // Render movement element
      const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${Helper.formatCurrency(
          mov,
          account.locale,
          account.currency
        )}</div>
      </div>
    `;

      Dom.containerMovements.insertAdjacentHTML('afterbegin', html);
    });
  }

  private caclDisplayBalance(account: any): void {
    account.balance = account.movements.reduce(
      (acc: number, mov: number) => acc + mov,
      0
    );

    // Display result to UI
    Dom.labelBalance.textContent = Helper.formatCurrency(
      account.balance,
      account.locale,
      account.currency
    );
  }

  private calcDisplaySummary(account: any): void {
    // Calculate incomes
    const incomes: number = account.movements
      .filter((mov: number): boolean => mov > 0)
      .reduce((acc: number, mov: number): number => acc + mov, 0);

    // Display incomes at UI
    Dom.labelSumIn.textContent = Helper.formatCurrency(
      incomes,
      account.locale,
      account.currency
    );

    // Calculate outs
    const out: number = account.movements
      .filter((mov: number): boolean => mov < 0)
      .reduce((acc: number, mov: number): number => acc + mov, 0);

    // Display outs at UI
    Dom.labelSumOut.textContent = Helper.formatCurrency(
      Math.abs(out),
      account.locale,
      account.currency
    );

    // Calculate interest
    const interest: number = account.movements
      .filter((mov: number): boolean => mov > 0)
      .map((deposit: number): number => (deposit * account.interestRate) / 100)
      .filter((int: number): boolean => int >= 1)
      .reduce((acc: number, int: number) => acc + int, 0);

    // Display interests at UI
    Dom.labelSumInterest.textContent = Helper.formatCurrency(
      interest,
      account.locale,
      account.currency
    );
  }

  private transfer(e: any): void {
    e.preventDefault();

    const amount: number = Math.floor(+Dom.inputTransferAmount.value);
    const receiverAccount: any = this.accountsData.find(
      (account: any) => account.username === Dom.inputTransferTo.value
    );

    Helper.clearInput(Dom.inputTransferAmount, Dom.inputTransferTo);

    // Process
    if (
      amount > 0 &&
      receiverAccount &&
      this.currentAccount.balance >= amount &&
      receiverAccount?.username !== this.currentAccount.username
    ) {
      const message: string =
        'We are processing your transaction will be completed in a short time.';
      Helper.displayMessage(message, 'info', 4);

      setTimeout((): void => {
        // Doing the transfer
        this.currentAccount.movements.push(-amount);
        receiverAccount.movements.push(amount);

        // Add Transfer Date
        this.currentAccount.movementsDates.push(new Date().toISOString());
        receiverAccount.movementsDates.push(new Date().toISOString());

        // Update UI
        this.updateUI(this.currentAccount);

        this.setLocalStorage();
      }, 5000);
    } else {
      const message: string = 'Failed transaction. Please contact us.';
      Helper.displayMessage(message, 'error', 3);
    }
  }

  private loan(e: any): void {
    e.preventDefault();

    const amount: number = +Dom.inputLoanAmount.value;

    if (
      amount > 0 &&
      this.currentAccount.movements.some((mov: number) => mov >= amount * 0.1)
    ) {
      // Add movement
      const message: string =
        'We are processing your transaction will be completed in a short time.';
      Helper.displayMessage(message, 'info', 3);

      setTimeout((): void => {
        // Add movements
        this.currentAccount.movements.push(amount);

        // Add movement date
        this.currentAccount.movementsDates.push(new Date().toISOString());

        // Update UI
        this.updateUI(this.currentAccount);

        // Clear inputs
        Helper.clearInput(Dom.inputLoanAmount);

        this.setLocalStorage();
      }, 3000);
    } else {
      const message: string = 'Failed transaction. Please contact us.';
      Helper.displayMessage(message, 'error', 3);
      Helper.clearInput(Dom.inputLoanAmount);
    }
  }

  private closeAccount(e: any): void {
    e.preventDefault();

    if (
      Dom.inputCloseUsername.value === this.currentAccount.username &&
      +Dom.inputClosePin.value === this.currentAccount.pin
    ) {
      const index: number = this.accountsData.findIndex(
        (account: any) => account.username === this.currentAccount.username
      );

      // Delete account
      this.accountsData.splice(index, 1);

      // Hide UI
      Dom.containerApp.style.opacity = '0';

      this.setLocalStorage();
    }

    Helper.clearInput(Dom.inputCloseUsername, Dom.inputClosePin);
  }

  private sortMovements(e: any): void {
    e.preventDefault();
    this.displayMovements(this.currentAccount, !this.sorted);
    this.sorted = !this.sorted;
  }

  private setLocalStorage() {
    localStorage.setItem('accounts', JSON.stringify(this.accountsData));
  }

  private setDataToLocalStorage() {
    localStorage.setItem('accounts', JSON.stringify(Data.accounts));
  }

  private getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('accounts'));
    this.accountsData = data;
  }
}

new App();
