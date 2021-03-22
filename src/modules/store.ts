export class Store {
  private instance: { key: string; val: any }[];

  constructor() {
    this.instance = [{ key: "", val: false }];
  }

  set<T>(key: string, instance: T) {
    const duplicateIdx = this.instance.findIndex((e) => e.key === key);
    if (duplicateIdx > -1) {
      this.instance[duplicateIdx] = { key: key, val: instance };
    } else {
      this.instance.push({ key: key, val: instance });
    }
  }

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
