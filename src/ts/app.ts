// Modules
import * as Data from './Data.js';
import Dom from './Dom.js';
import { clearInput } from './helper.js';

class App {
  public currentAccount!: any;

  constructor() {
    this.createUsernames(Data.accounts);

    // Event Listeners
    Dom.btnLogin.addEventListener('click', this.login.bind(this));
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
      clearInput(Dom.inputLoginUsername, Dom.inputLoginPin);

      this.updateUI(this.currentAccount);
    } else {
      this.displayErrorMessage();
    }
  }

  private updateUI(account: object) {
    this.displayMovements(account);
    this.caclDisplayBalance(account);
  }

  private displayMovements(account: any) {
    Dom.containerMovements.innerHTML = '';
    console.log(this.currentAccount);

    const movements: [] = account.movements;

    // Render movements list
    movements.forEach((mov, i) => {
      const type: string = mov > 0 ? 'deposit' : 'withdrawal';
      const date: any = new Date(account.movementsDates[i]);
      const displayDate = this.formatMovementDate(date, account.locale);

      const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
        i + 1
      } ${type}</div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${this.formatCurrency(
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
    Dom.labelBalance.textContent = this.formatCurrency(
      account.balance,
      account.locale,
      account.currency
    );
  }

  private formatMovementDate(date: any, locale: string) {
    const calcDaysPassed = (date1: any, date2: any) =>
      // Prevent opposite date that results to - = Add Math.abs();
      Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));

    const dayPassed = calcDaysPassed(new Date(), date);

    if (dayPassed === 0) return 'Today';
    if (dayPassed === 1) return 'Yesteday';
    if (dayPassed <= 7) return `${dayPassed} days`;

    return new Intl.DateTimeFormat(locale).format(date);
  }

  private formatCurrency(value: any, locale: any, currency: any) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  }

  private displayErrorMessage(): void {
    Dom.errorMessage.style.display = 'block';
    setTimeout(() => (Dom.errorMessage.style.display = 'none'), 3000);
  }
}

new App();
