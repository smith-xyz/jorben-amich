interface FTS5SearchBuildOptions<
  T extends { query: (sql: string, parameters?: unknown[]) => Promise<K> },
  K
> {
  dataSource: T;
  searchContentTableName: string;
  ftsTableName: string;
}

type ColumnOption = {
  tableName: string;
  columnName: string;
  columnAlias?: string;
};

type JoinOption = {
  tableName: string;
  joiningTableName: string;
  column: string;
  joinColumn: string;
};

export class FTS5SearchBuilder<
  T extends { query: (sql: string, parameters?: string[]) => Promise<K> },
  K
> {
  private _match: string;
  private columns: ColumnOption[];
  private joins: JoinOption[];

  private searchText: string;

  constructor(private readonly options: FTS5SearchBuildOptions<T, K>) {}

  private get match() {
    return this._match ?? `"${this.searchText}"`;
  }

  private get columnStatements() {
    let sqlColumns = `
        rank,
        ${this.options.searchContentTableName}.content
    `;

    if (this.columns.length > 0) {
      sqlColumns = `
              ${sqlColumns},
              ${this.columns
                .map(
                  ({ tableName, columnName, columnAlias = columnName }) =>
                    `${tableName}.${columnName} as ${columnAlias}`
                )
                .join(',')}
          `;
    }

    return sqlColumns;
  }

  private get joinStatements() {
    let joinColumns = `
    JOIN ${this.options.ftsTableName} f ON
        sc.ROWID = f.ROWID
    `;

    if (this.joins.length > 0) {
      joinColumns = `
            ${joinColumns}
            ${this.joins
              .map(
                ({ tableName, joiningTableName, column, joinColumn }) =>
                  `JOIN ${tableName} ON ${tableName}.${column} = ${joiningTableName}.${joinColumn}`
              )
              .join('\n')}
        `;
    }

    return joinColumns;
  }

  private get sql() {
    return `
      SELECT
        ${this.columnStatements}
      FROM
        ${this.options.searchContentTableName}
      ${this.joinStatements}
      WHERE
      ${this.options.ftsTableName} MATCH ${this.match}
      ORDER BY rank;
    `;
  }

  public setNearMatch(nearProximity = 10) {
    this._match = `NEAR("${this.searchText}", ${nearProximity})`;
    return this;
  }

  public addColumn(column: ColumnOption) {
    this.columns.push(column);
    return this;
  }

  public addColumns(columns: ColumnOption[]) {
    this.columns.push(...columns);
    return this;
  }

  public addJoin(join: JoinOption) {
    this.joins.push(join);
    return this;
  }

  public addJoins(joins: JoinOption[]) {
    this.joins.push(...joins);
    return this;
  }

  public setSearchText(searchText: string) {
    this.searchText = searchText;
    return this;
  }

  public search(): Promise<K> {
    return this.options.dataSource.query(this.sql);
  }
}
