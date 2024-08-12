export const readStorageState = (
  key: string,
  parse: boolean = false,
  returnValueOnNull: any
) => {
  const item = localStorage.getItem(key);
  if (item) {
    return parse ? JSON.parse(item) : item;
  } else {
    return returnValueOnNull;
  }
};
