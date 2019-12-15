import NodeCache from "node-cache";

export interface ICache {
  set(key: string, value: any): boolean;
  get(key: string): unknown;
  delete(key: string): number;
  close(): void;
}

export default class Cache implements ICache {
  cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 15000 });
  }

  set(key: string, value: any) {
    return this.cache.set(key, value);
  }

  get(key: string) {
    return this.cache.get(key);
  }

  delete(key: string) {
    return this.cache.del(key);
  }

  close() {
    this.cache.close();
  }
}
