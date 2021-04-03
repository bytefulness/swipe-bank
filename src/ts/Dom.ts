class DomElements {
  labelWelcome = document.querySelector('.welcome') as HTMLElement;
  labelDate = document.querySelector('.date') as HTMLElement;
  labelBalance = document.querySelector('.balance__value') as HTMLElement;
  labelSumIn = document.querySelector('.summary__value--in') as HTMLElement;
  labelSumOut = document.querySelector('.summary__value--out') as HTMLElement;
  labelSumInterest = document.querySelector(
    '.summary__value--interest'
  ) as HTMLElement;
  labelTimer = document.querySelector('.timer') as HTMLElement;

  containerApp = document.querySelector('.app') as HTMLElement;
  containerMovements = document.querySelector('.movements') as HTMLElement;

  btnLogin = document.querySelector('.login__btn') as HTMLButtonElement;
  btnTransfer = document.querySelector(
    '.form__btn--transfer'
  ) as HTMLButtonElement;
  btnLoan = document.querySelector('.form__btn--loan') as HTMLButtonElement;
  btnClose = document.querySelector('.form__btn--close') as HTMLButtonElement;
  btnSort = document.querySelector('.btn--sort') as HTMLButtonElement;

  inputLoginUsername = document.querySelector(
    '.login__input--user'
  ) as HTMLInputElement;
  inputLoginPin = document.querySelector(
    '.login__input--pin'
  ) as HTMLInputElement;
  inputTransferTo = document.querySelector(
    '.form__input--to'
  ) as HTMLInputElement;
  inputTransferAmount = document.querySelector(
    '.form__input--amount'
  ) as HTMLInputElement;
  inputLoanAmount = document.querySelector(
    '.form__input--loan-amount'
  ) as HTMLInputElement;
  inputCloseUsername = document.querySelector(
    '.form__input--user'
  ) as HTMLInputElement;
  inputClosePin = document.querySelector(
    '.form__input--pin'
  ) as HTMLInputElement;

  errorMessage = document.querySelector('.error') as HTMLDivElement;
}

export default new DomElements();
