import { IORM } from "./orm";

class PostgreSql implements IORM {
  load(sql: string): Promise<Function> {
    return new Promise((resolve, reject) => {});
  }

  add(tableName: string, entity: any): Promise<Function> {
    return new Promise((resolve, reject) => {});
  }

  addMultiple(
    tableName: string,
    entities: Array<any>,
    fields: string
  ): Promise<Function> {
    return new Promise((resolve, reject) => {});
  }

  get(tableName: string, idField: string, id: number): Promise<Function> {
    return new Promise((resolve, reject) => {});
  }

  update(tableName: string, idField: string, entity: any): Promise<Function> {
    return new Promise((resolve, reject) => {});
  }

  delete(tableName: string, idField: string, id: number): Promise<Function> {
    return new Promise((resolve, reject) => {});
  }
}

export default PostgreSql;
