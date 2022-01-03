import { readFileSync } from 'fs';
import { Table, DataFrame } from 'apache-arrow';
import { getConnectionManager, ConnectionManager, Connection } from 'typeorm';
import { IbaseBlock, Options } from '../interfaces/IbaseBlock';

export class SqlReader implements IbaseBlock {
    private df: DataFrame;
    private connectionManager: ConnectionManager;
    private connection: Connection;

    constructor(options: Options) {
        if (options.db) {
            this.connectionManager = getConnectionManager();
            this.connection = this.connectionManager.create({
                type: 'postgres', // options.db.type,
                host: options.db.host,
                port: options.db.port,
                username: options.db.username,
                password: options.db.password,
                database: options.db.database,
                logging: options.db.logging,
            });
        }
    }

    public in(dfIn: DataFrame): Promise<void> {
        return new Promise(async (resolve) => {
            this.df = dfIn;
            return resolve();
        });
    }

    public out(): Promise<DataFrame> {
        return new Promise(async (resolve) => {
            await this.connection.connect();
            const rawData = await this.connection.query('');
            console.log('rawData :>> ', rawData);
            // const table = Table.from(this.files.map((file) => readFileSync(file)));
            // this.df = new DataFrame(table);

            return resolve(this.df);
        });
    }
}
