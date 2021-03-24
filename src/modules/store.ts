export class Store {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private instance: { key: string; val: any }[];
  /**
   * Creates an instance of Store.
   * @memberof Store
   */
  constructor() {
    this.instance = [{ key: "", val: false }];
  }
  /**
   *
   *
   * @template T
   * @param {string} key
   * @param {T} instance
   * @memberof Store
   */
  set<T>(key: string, instance: T): void {
    const duplicateIdx = this.instance.findIndex((e) => e.key === key);
    if (duplicateIdx > -1) {
      this.instance[duplicateIdx] = { key: key, val: instance };
    } else {
      this.instance.push({ key: key, val: instance });
    }
  }
  /**
   *
   *
   * @template T
   * @param {string} key
   * @return {*}  {T}
   * @memberof Store
   */
  get<T>(key: string): T {
    const instance = this.instance.find((e) => e.key === key);
    if (instance) {
      return instance.val as T;
    } else {
      return {} as T;
    }
  }
}

export const store = new Store();
export default store;
