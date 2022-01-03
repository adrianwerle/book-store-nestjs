import { DataFrame } from 'apache-arrow';

export interface IbaseBlock {
    in(arg0: DataFrame): Promise<void>;
    out(): Promise<DataFrame>;
}

export interface Options {
    file?: string;
    folder?: string;
    db?: {
        ssl: boolean;
        type: string;
        host: string;
        port: number;
        database: string;
        username: string;
        password: string;
        logging: boolean;
    };
}
