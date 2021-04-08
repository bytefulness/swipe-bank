// Modules
import * as Data from './Data.js';
import Dom from './Dom.js';
import * as Helper from './helper.js';
class App {
    constructor() {
        this.createUsernames(Data.accounts);
        // Event Listeners
        Dom.btnLogin.addEventListener('click', this.login.bind(this));
        Dom.btnTransfer.addEventListener('click', this.transfer.bind(this));
        Dom.btnLoan.addEventListener('click', this.loan.bind(this));
        Dom.btnClose.addEventListener('click', this.closeAccount.bind(this));
        Dom.btnSort.addEventListener('click', this.sortMovements.bind(this));
    }
    createUsernames(accounts) {
        accounts.forEach((account) => {
            account.username = account.owner
                .toLowerCase()
                .split(' ')
                .map((name) => name[0])
                .join('');
        });
    }
    login(e) {
        var _a;
        e.preventDefault();
        this.currentAccount = Data.accounts.find((account) => account.username === Dom.inputLoginUsername.value);
        if (((_a = this.currentAccount) === null || _a === void 0 ? void 0 : _a.pin) === +Dom.inputLoginPin.value) {
            // Display message
            Dom.labelWelcome.textContent = `Welcome back, ${this.currentAccount.owner.split(' ')[0]}`;
            // Display UI
            Dom.containerApp.style.opacity = '100';
            // Clear Inputs
            Helper.clearInput(Dom.inputLoginUsername, Dom.inputLoginPin);
            this.updateUI(this.currentAccount);
        }
        else {
            const message = 'Wrong id or password. Please try again.';
            Helper.displayMessage(message, 'error', 3);
        }
    }
    updateUI(account) {
        this.displayMovements(account);
        this.caclDisplayBalance(account);
        this.calcDisplaySummary(account);
    }
    displayMovements(account, sort = false) {
        Dom.containerMovements.innerHTML = '';
        const movs = sort
            ? [...account.movements].sort((a, b) => a - b)
            : account.movements;
        // Render movements list
        movs.forEach((mov, i) => {
            const type = mov > 0 ? 'deposit' : 'withdrawal';
            const date = new Date(account.movementsDates[i]);
            const displayDate = Helper.formatMovementDate(date, account.locale);
            // Render movement element
            const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${Helper.formatCurrency(mov, account.locale, account.currency)}</div>
      </div>
    `;
            Dom.containerMovements.insertAdjacentHTML('afterbegin', html);
        });
    }
    caclDisplayBalance(account) {
        account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
        // Display result to UI
        Dom.labelBalance.textContent = Helper.formatCurrency(account.balance, account.locale, account.currency);
    }
    calcDisplaySummary(account) {
        // Calculate incomes
        const incomes = account.movements
            .filter((mov) => mov > 0)
            .reduce((acc, mov) => acc + mov, 0);
        // Display incomes at UI
        Dom.labelSumIn.textContent = Helper.formatCurrency(incomes, account.locale, account.currency);
        // Calculate outs
        const out = account.movements
            .filter((mov) => mov < 0)
            .reduce((acc, mov) => acc + mov, 0);
        // Display outs at UI
        Dom.labelSumOut.textContent = Helper.formatCurrency(Math.abs(out), account.locale, account.currency);
        // Calculate interest
        const interest = account.movements
            .filter((mov) => mov > 0)
            .map((deposit) => (deposit * account.interestRate) / 100)
            .filter((int) => int >= 1)
            .reduce((acc, int) => acc + int, 0);
        // Display interests at UI
        Dom.labelSumInterest.textContent = Helper.formatCurrency(interest, account.locale, account.currency);
    }
    transfer(e) {
        e.preventDefault();
        const amount = Math.floor(+Dom.inputTransferAmount.value);
        const receiverAccount = Data.accounts.find((account) => account.username === Dom.inputTransferTo.value);
        Helper.clearInput(Dom.inputTransferAmount, Dom.inputTransferTo);
        // Process
        if (amount > 0 &&
            receiverAccount &&
            this.currentAccount.balance >= amount &&
            (receiverAccount === null || receiverAccount === void 0 ? void 0 : receiverAccount.username) !== this.currentAccount.username) {
            const message = 'We are processing your transaction will be completed in a short time.';
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
        }
        else {
            const message = 'Failed transaction. Please contact us.';
            Helper.displayMessage(message, 'error', 3);
        }
    }
    loan(e) {
        e.preventDefault();
        const amount = +Dom.inputLoanAmount.value;
        if (amount > 0 &&
            this.currentAccount.movements.some((mov) => mov >= amount * 0.1)) {
            // Add movement
            const message = 'We are processing your transaction will be completed in a short time.';
            Helper.displayMessage(message, 'info', 3);
            setTimeout(() => {
                // Add movements
                this.currentAccount.movements.push(amount);
                // Add movement date
                this.currentAccount.movementsDates.push(new Date().toISOString());
                // Update UI
                this.updateUI(this.currentAccount);
                // Clear inputs
                Helper.clearInput(Dom.inputLoanAmount);
            }, 3000);
        }
        else {
            const message = 'Failed transaction. Please contact us.';
            Helper.displayMessage(message, 'error', 3);
            Helper.clearInput(Dom.inputLoanAmount);
        }
    }
    closeAccount(e) {
        e.preventDefault();
        if (Dom.inputCloseUsername.value === this.currentAccount.username &&
            +Dom.inputClosePin.value === this.currentAccount.pin) {
            const index = Data.accounts.findIndex((account) => account.username === this.currentAccount.username);
            // Delete account
            Data.accounts.splice(index, 1);
            // Hide UI
            Dom.containerApp.style.opacity = '0';
        }
        Helper.clearInput(Dom.inputCloseUsername, Dom.inputClosePin);
    }
    sortMovements(e) {
        e.preventDefault();
        this.displayMovements(this.currentAccount, !this.sorted);
        this.sorted = !this.sorted;
    }
}
new App();
//# sourceMappingURL=app.js.map