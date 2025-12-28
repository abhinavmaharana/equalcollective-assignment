declare module 'sql.js' {
  export interface Database {
    run(sql: string, params?: any[]): Database;
    exec(sql: string, params?: any[]): Array<{ columns: string[]; values: any[][] }>;
    export(): Uint8Array;
    close(): void;
  }

  export default function initSqlJs(options?: {
    locateFile?: (file: string) => string;
  }): Promise<{
    Database: new (buffer?: Uint8Array) => Database;
  }>;
}

