// Modules
import * as Data from './Data.js';
import Dom from './Dom.js';
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
            this.clearInput(Dom.inputLoginUsername, Dom.inputLoginPin);
            this.updateUI(this.currentAccount);
        }
        else {
            this.displayErrorMessage();
        }
    }
    updateUI(account) {
        this.displayMovements(account);
    }
    displayMovements(account) {
        Dom.containerMovements.innerHTML = '';
        console.log(this.currentAccount);
        const movements = account.movements;
        // Render movements list
        movements.forEach((mov, i) => {
            const type = mov > 0 ? 'deposit' : 'withdrawal';
            const date = new Date(account.movementsDates[i]);
            const displayDate = this.formatMovementDate(date, account.locale);
            const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${this.formatCurrency(mov, account.locale, account.currency)}</div>
      </div>
    `;
            Dom.containerMovements.insertAdjacentHTML('afterbegin', html);
        });
    }
    formatMovementDate(date, locale) {
        const calcDaysPassed = (date1, date2) => 
        // Prevent opposite date that results to - = Add Math.abs();
        Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
        const dayPassed = calcDaysPassed(new Date(), date);
        if (dayPassed === 0)
            return 'Today';
        if (dayPassed === 1)
            return 'Yesteday';
        if (dayPassed <= 7)
            return `${dayPassed} days`;
        return new Intl.DateTimeFormat(locale).format(date);
    }
    formatCurrency(value, locale, currency) {
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currency,
        }).format(value);
    }
    displayErrorMessage() {
        Dom.errorMessage.style.display = 'block';
        setTimeout(() => (Dom.errorMessage.style.display = 'none'), 3000);
    }
    clearInput(...input) {
        input.forEach((element) => (element.value = ''));
        input.forEach((element) => element.blur());
    }
}
new App();
//# sourceMappingURL=app.js.map