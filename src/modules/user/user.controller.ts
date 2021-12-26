import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../role/decorators/role.decorator';
import { RoleGuard } from '../role/guards/role.guard';
import { RoleType } from '../role/roletype.enum';
import { ReadUserDto } from './dtos/read-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Get(':userId')
    @Roles(RoleType.ADMIN)
    @UseGuards(AuthGuard(), RoleGuard)
    // eslint-disable-next-line prettier/prettier
    getUser(@Param('userId', ParseIntPipe) userId: number): Promise<ReadUserDto> {
        return this._userService.get(userId);
    }

    @UseGuards(AuthGuard())
    @Get()
    getUsers(): Promise<ReadUserDto[]> {
        return this._userService.getAll();
    }

    @Patch(':userId')
    // eslint-disable-next-line prettier/prettier
    updateUser(@Param('userId', ParseIntPipe) userId: number, @Body() user: User): Promise<ReadUserDto> {
        return this._userService.update(userId, user);
    }

    @Delete(':userId')
    deleteUser(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
        return this._userService.delete(userId);
    }

    @Post('setRole/:userId/:roleId')
    setRoleToUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('roleId', ParseIntPipe) roleId: number,
    ): Promise<boolean> {
        return this._userService.setRoleToUser(userId, roleId);
    }
}
