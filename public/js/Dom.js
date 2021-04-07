class DomElements {
    constructor() {
        this.labelWelcome = document.querySelector('.welcome');
        this.labelDate = document.querySelector('.date');
        this.labelBalance = document.querySelector('.balance__value');
        this.labelSumIn = document.querySelector('.summary__value--in');
        this.labelSumOut = document.querySelector('.summary__value--out');
        this.labelSumInterest = document.querySelector('.summary__value--interest');
        this.labelTimer = document.querySelector('.timer');
        this.containerApp = document.querySelector('.app');
        this.containerMovements = document.querySelector('.movements');
        this.btnLogin = document.querySelector('.login__btn');
        this.btnTransfer = document.querySelector('.form__btn--transfer');
        this.btnLoan = document.querySelector('.form__btn--loan');
        this.btnClose = document.querySelector('.form__btn--close');
        this.btnSort = document.querySelector('.btn--sort');
        this.inputLoginUsername = document.querySelector('.login__input--user');
        this.inputLoginPin = document.querySelector('.login__input--pin');
        this.inputTransferTo = document.querySelector('.form__input--to');
        this.inputTransferAmount = document.querySelector('.form__input--amount');
        this.inputLoanAmount = document.querySelector('.form__input--loan-amount');
        this.inputCloseUsername = document.querySelector('.form__input--user');
        this.inputClosePin = document.querySelector('.form__input--pin');
        this.message = document.querySelector('.message');
    }
}
export default new DomElements();
//# sourceMappingURL=Dom.js.map