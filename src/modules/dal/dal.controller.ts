import { Body, Controller, Post } from '@nestjs/common';
import { DalService } from './dal.service';
import { Options } from '../../common/interfaces/IbaseBlock';

@Controller('dal')
export class DalController {
    constructor(private readonly _dalService: DalService) {}

    @Post('readFile')
    readFile(@Body() opts: Partial<Options>): Promise<any> {
        return this._dalService.getFile(opts.file);
    }
    @Post('readFolder')
    readFolder(@Body() opts: Partial<Options>): Promise<any> {
        return this._dalService.getFolder(opts.folder);
    }
    @Post('readDb')
    readDb(@Body() opts: Partial<Options>): Promise<any> {
        return this._dalService.getDb(opts.db);
    }
}
