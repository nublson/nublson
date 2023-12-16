export const getIsCurrentPath = (path: string, pathname: string) => {
  return pathname.startsWith(`/${path}`) ? true : false;
};
