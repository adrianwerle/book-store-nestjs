import { readdirSync, readFileSync, PathLike } from 'fs';
import { extname, join } from 'path';
import { Table, DataFrame } from 'apache-arrow';
import { IbaseBlock, Options } from '../interfaces/IbaseBlock';

export class Reader implements IbaseBlock {
    private df: DataFrame;
    private files: string[] = [];
    constructor(options: Options) {
        if (options.file) {
            const p: PathLike = options.file;
            this.files = [p];
        }
        if (options.folder) {
            const p: PathLike = options.folder;
            readdirSync(p).forEach((file) => {
                if (extname(file) === '.arrow') {
                    this.files.push(join(p, file));
                }
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
            const table = Table.from(
                this.files.map((file) => readFileSync(file)),
            );
            this.df = new DataFrame(table);
            return resolve(this.df);
        });
    }
}
