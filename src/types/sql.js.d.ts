declare module "sql.js" {
  export interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
  }

  export interface Database {
    run(sql: string, params?: BindParams): Database;
    exec(sql: string, params?: BindParams): QueryExecResult[];
    each(
      sql: string,
      params: BindParams,
      callback: (row: ParamsObject) => void,
      done: () => void
    ): Database;
    prepare(sql: string): Statement;
    export(): Uint8Array;
    close(): void;
    getRowsModified(): number;
    create_function(name: string, func: (...args: unknown[]) => unknown): Database;
    create_aggregate(
      name: string,
      init: () => unknown,
      step: (state: unknown, value: unknown) => void,
      finalize: (state: unknown) => unknown
    ): Database;
  }

  export interface QueryExecResult {
    columns: string[];
    values: SqlValue[][];
  }

  export interface Statement {
    bind(params?: BindParams): boolean;
    step(): boolean;
    getColumnNames(): string[];
    get(params?: BindParams): SqlValue[];
    getAsObject(params?: BindParams): ParamsObject;
    run(params?: BindParams): void;
    reset(): void;
    free(): boolean;
  }

  export type SqlValue = string | number | Uint8Array | null;
  export type BindParams = SqlValue[] | ParamsObject | null;
  export interface ParamsObject {
    [key: string]: SqlValue;
  }

  export interface SqlJsConfig {
    locateFile?: (file: string) => string;
    wasmBinary?: ArrayBuffer;
  }

  const initSqlJs: (config?: SqlJsConfig) => Promise<SqlJsStatic>;
  export default initSqlJs;
}
