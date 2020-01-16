export interface IORM {
  load(sql: string): Promise<Function>;
  add(tableName: string, entity: any): Promise<Function>;
  addMultiple(
    tableName: string,
    entities: Array<any>,
    fields: string
  ): Promise<Function>;
  get(tableName: string, idField: string, id: number): Promise<Function>;
  update(tableName: string, idField: string, entity: any): Promise<Function>;
  delete(tableName: string, idField: string, id: number): Promise<Function>;
}
