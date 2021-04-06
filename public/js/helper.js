export const clearInput = (...input) => {
    input.forEach((element) => (element.value = ''));
    input.forEach((element) => element.blur());
};
//# sourceMappingURL=helper.js.map