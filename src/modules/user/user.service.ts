import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { RoleRepository } from '../role/role.repository';
import { status } from '../../shared/entity-status.enum';
import { ReadUserDto } from './dtos/read-user.dto';
import { plainToClass } from 'class-transformer';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly _userRepository: UserRepository,
        @InjectRepository(RoleRepository)
        private readonly _roleRepository: RoleRepository,
    ) {}

    async get(userId: number): Promise<ReadUserDto> {
        if (!userId) {
            throw new BadRequestException('id must be sent');
        }

        const user: User = await this._userRepository.findOne(userId, {
            where: { status: status.ACTIVE },
        });

        if (!user) {
            throw new NotFoundException();
        }

        return plainToClass(ReadUserDto, user);
    }

    async getAll(): Promise<ReadUserDto[]> {
        const users: User[] = await this._userRepository.find({
            where: { status: status.ACTIVE },
        });

        return users.map((user: User) => plainToClass(ReadUserDto, user));
    }

    async update(userId: number, user: UpdateUserDto): Promise<ReadUserDto> {
        const foundUser = await this._userRepository.findOne(userId, {
            where: { status: status.ACTIVE },
        });

        if (!foundUser) {
            throw new NotFoundException('User does not exists');
        }

        foundUser.username = user.username;
        const updateUser = await this._userRepository.save(foundUser);
        return plainToClass(ReadUserDto, updateUser);
    }

    async delete(userId: number): Promise<void> {
        const userExists = await this._userRepository.findOne(userId, {
            where: { status: status.ACTIVE },
        });

        if (!userExists) {
            throw new NotFoundException();
        }

        await this._userRepository.update(userId, { status: status.INACTIVE });
    }

    async setRoleToUser(userId: number, roleId: number): Promise<boolean> {
        const userExists = await this._userRepository.findOne(userId, {
            where: { status: status.ACTIVE },
        });

        if (!userExists) {
            throw new NotFoundException();
        }

        const roleExists = await this._roleRepository.findOne(roleId, {
            where: { status: status.ACTIVE },
        });

        if (!roleExists) {
            throw new NotFoundException();
        }

        userExists.roles.push(roleExists);
        await this._userRepository.save(userExists);

        return true;
    }
}
