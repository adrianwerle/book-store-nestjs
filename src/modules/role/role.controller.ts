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
import { RoleService } from './role.service';
import { ReadRoleDto, CreateRoleDto, UpdateRoleDto } from './dtos';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from './guards/role.guard';
import { Roles } from './decorators/role.decorator';
import { RoleType } from './roletype.enum';

@UseGuards(AuthGuard(), RoleGuard)
@Controller('roles')
export class RoleController {
    constructor(private readonly _roleService: RoleService) {}

    @Get(':roleId')
    getRole(
        @Param('roleId', ParseIntPipe) roleId: number,
    ): Promise<ReadRoleDto> {
        return this._roleService.get(roleId);
    }

    @Get()
    getRoles(): Promise<ReadRoleDto[]> {
        return this._roleService.getAll();
    }

    @Post()
    async createRole(
        @Body() role: Partial<CreateRoleDto>,
    ): Promise<ReadRoleDto> {
        return this._roleService.create(role);
    }

    @Patch(':roleId')
    @Roles(RoleType.ADMIN)
    updateRole(
        @Param('roleId', ParseIntPipe) roleId: number,
        @Body() role: Partial<UpdateRoleDto>,
    ) {
        return this._roleService.update(roleId, role);
    }

    @Delete(':roleId')
    @Roles(RoleType.ADMIN)
    deleteRole(@Param('roleId', ParseIntPipe) roleId: number) {
        return this._roleService.delete(roleId);
    }
}
