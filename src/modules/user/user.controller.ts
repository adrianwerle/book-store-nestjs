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

@UseGuards(AuthGuard(), RoleGuard)
@Controller('users')
export class UserController {
    constructor(private readonly _userService: UserService) {}

    @Get(':userId')
    getUser(
        @Param('userId', ParseIntPipe) userId: number,
    ): Promise<ReadUserDto> {
        return this._userService.get(userId);
    }

    @Get()
    getUsers(): Promise<ReadUserDto[]> {
        return this._userService.getAll();
    }

    @Patch(':userId')
    @Roles(RoleType.ADMIN)
    updateUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Body() user: User,
    ): Promise<ReadUserDto> {
        return this._userService.update(userId, user);
    }

    @Delete(':userId')
    @Roles(RoleType.ADMIN)
    deleteUser(@Param('userId', ParseIntPipe) userId: number): Promise<void> {
        return this._userService.delete(userId);
    }

    @Post('setRole/:userId/:roleId')
    @Roles(RoleType.ADMIN)
    setRoleToUser(
        @Param('userId', ParseIntPipe) userId: number,
        @Param('roleId', ParseIntPipe) roleId: number,
    ): Promise<boolean> {
        return this._userService.setRoleToUser(userId, roleId);
    }
}
