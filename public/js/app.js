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
        }
        else {
            this.displayErrorMessage();
        }
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
