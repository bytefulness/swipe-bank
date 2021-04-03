// Modules
import * as Data from './Data.js';
import Dom from './Dom.js';

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
      this.clearInput(Dom.inputLoginUsername, Dom.inputLoginPin);
    } else {
      this.displayErrorMessage();
    }
  }

  private displayErrorMessage(): void {
    Dom.errorMessage.style.display = 'block';
    setTimeout(() => (Dom.errorMessage.style.display = 'none'), 3000);
  }

  private clearInput(...input: any): void {
    input.forEach((element: any) => (element.value = ''));
    input.forEach((element: any) => element.blur());
  }
}

new App();
