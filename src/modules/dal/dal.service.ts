import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { Reader } from '../../common/classes/reader';
import { Options } from '../../common/interfaces/IbaseBlock';
import { SqlReader } from '../../common/classes/sql-reader';

@Injectable()
export class DalService {
    async getFile(file: string): Promise<any> {
        const filePath = join(__dirname, '..', '..', 'files', file);
        const options: Options = {
            file: filePath,
        };
        const reader = new Reader(options);
        return reader.out();
    }

    async getFolder(folder: string): Promise<any> {
        const folderPath = join(__dirname, '..', '..', 'files', folder);
        const options: Options = {
            folder: folderPath,
        };
        const reader = new Reader(options);
        return reader.out();
    }

    async getDb(opts: any): Promise<any> {
        const options: Options = {
            db: opts,
        };
        const sqlReader = new SqlReader(options);
        return sqlReader.out();
    }
}
