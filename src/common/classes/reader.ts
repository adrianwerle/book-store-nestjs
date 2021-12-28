import { readFileSync } from 'fs';
import { Table, DataFrame } from 'apache-arrow';

export class Reader {
    public do() {
        const arrow = readFileSync('simple.arrow');
        const table = Table.from([arrow]);
        const df = new DataFrame(table);

        console.log(df.toString());
    }
}
