export function listen(
  checkInterval: number,
  timeout: number,
  check: () => boolean
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const wait = setTimeout(() => {
      clearInterval(listener);
      reject(false);
    }, timeout);
    const listener = setInterval(() => {
      if (check()) {
        clearInterval(listener);
        clearInterval(wait);
        resolve(true);
      }
    }, checkInterval);
  });
}
