import Dom from './Dom.js';
export const clearInput = (...input) => {
    input.forEach((element) => (element.value = ''));
    input.forEach((element) => element.blur());
};
export const formatMovementDate = (date, locale) => {
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
};
export const formatCurrency = (value, locale, currency) => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
};
export const displayErrorMessage = (errorMessage) => {
    Dom.errorMessage.style.display = 'block';
    Dom.errorMessage.textContent = errorMessage;
    setTimeout(() => (Dom.errorMessage.style.display = 'none'), 3000);
};
//# sourceMappingURL=helper.js.map