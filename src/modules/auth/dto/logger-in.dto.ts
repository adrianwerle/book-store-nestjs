import { Exclude, Expose, Type } from 'class-transformer';
import { ReadUserDto } from '../../user/dtos/read-user.dto';
import { IsString } from 'class-validator';

@Exclude()
export class LoggedInDto {
    @Expose()
    @IsString()
    token: string;

    @Expose()
    @Type(() => ReadUserDto)
    user: ReadUserDto;
}
