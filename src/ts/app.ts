// Modules
import * as Data from './Data.js';
import Dom from './Dom.js';
import * as Helper from './helper.js';

class App {
  public currentAccount!: any;

  constructor() {
    this.createUsernames(Data.accounts);

    // Event Listeners
    Dom.btnLogin.addEventListener('click', this.login.bind(this));
    Dom.btnTransfer.addEventListener('click', this.transfer.bind(this));
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

  private login(e: any) {
    e.preventDefault();
    this.currentAccount = Data.accounts.find(
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
      const message = 'Wrong id or password. Please try again.';
      Helper.displayMessage(message, 'error', 3);
    }
  }

  private updateUI(account: object) {
    this.displayMovements(account);
    this.caclDisplayBalance(account);
    this.calcDisplaySummary(account);
  }

  private displayMovements(account: any) {
    Dom.containerMovements.innerHTML = '';
    console.log(this.currentAccount);

    const movements: [] = account.movements;

    // Render movements list
    movements.forEach((mov, i) => {
      const type: string = mov > 0 ? 'deposit' : 'withdrawal';
      const date: any = new Date(account.movementsDates[i]);
      const displayDate = Helper.formatMovementDate(date, account.locale);

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

  private caclDisplayBalance(account: any) {
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

  private transfer(e: any) {
    e.preventDefault();

    const amount: number = Math.floor(+Dom.inputTransferAmount.value);
    const receiverAccount: any = Data.accounts.find(
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
      const message = 'Talimat alındı çok kısa sürede işleminiz gerçekleşecek.';
      Helper.displayMessage(message, 'info', 4);

      setTimeout(() => {
        // Doing the transfer
        this.currentAccount.movements.push(-amount);
        receiverAccount.movements.push(amount);

        // Add Transfer Date
        this.currentAccount.movementsDates.push(new Date().toISOString());
        receiverAccount.movementsDates.push(new Date().toISOString());

        // Update UI
        this.updateUI(this.currentAccount);
      }, 5000);
    } else {
      const message = 'İşleminizi gerçekleştiremiyoruz.';
      Helper.displayMessage(message, 'error', 3);
    }
  }
}

new App();
