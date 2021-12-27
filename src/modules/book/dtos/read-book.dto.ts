import { Exclude, Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

@Exclude()
export class ReadBookDto {
    @Expose()
    @IsNumber()
    readonly id: number;

    @Expose()
    @IsString()
    readonly name: string;

    @Expose()
    @IsString()
    readonly description: string;

    @Expose()
    @Type(() => ReadBookDto)
    readonly authors: ReadBookDto[];
}
