// Modules
import * as Data from './Data.js';
import Dom from './Dom.js';
import * as Helper from './helper.js';
class App {
    constructor() {
        this.createUsernames(Data.accounts);
        // Event Listeners
        Dom.btnLogin.addEventListener('click', this.login.bind(this));
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
            Helper.displayErrorMessage('Wrong id or password. Please try again.');
        }
    }
    updateUI(account) {
        this.displayMovements(account);
        this.caclDisplayBalance(account);
        this.calcDisplaySummary(account);
    }
    displayMovements(account) {
        Dom.containerMovements.innerHTML = '';
        console.log(this.currentAccount);
        const movements = account.movements;
        // Render movements list
        movements.forEach((mov, i) => {
            const type = mov > 0 ? 'deposit' : 'withdrawal';
            const date = new Date(account.movementsDates[i]);
            const displayDate = Helper.formatMovementDate(date, account.locale);
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
}
new App();
//# sourceMappingURL=app.js.map