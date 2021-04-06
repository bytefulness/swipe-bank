export const clearInput = (...input: any): void => {
  input.forEach((element: any) => (element.value = ''));
  input.forEach((element: any) => element.blur());
};
