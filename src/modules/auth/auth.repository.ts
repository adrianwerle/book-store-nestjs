import { User } from '../user/user.entity';
import { EntityRepository, Repository, getConnection } from 'typeorm';
import { SignupDto } from './dto/signup.dto';
import { RoleRepository } from '../role/role.repository';
import { Role } from '../role/role.entity';
import { RoleType } from '../role/roletype.enum';
import { UserDetails } from '../user/user.details.entity';
import { genSalt, hash } from 'bcryptjs';
import { status } from '../../shared/entity-status.enum';

@EntityRepository(User)
export class AuthRepository extends Repository<User> {
    async signup(signupDto: SignupDto) {
        const { username, email, password } = signupDto;
        const user = new User();
        user.username = username;
        user.email = email;

        const roleRepository: RoleRepository =
            await getConnection().getRepository(Role);

        const rolesCount = await roleRepository.count();

        if (rolesCount > 0) {
            const defaultRole: Role = await roleRepository.findOne({
                where: { status: status.ACTIVE, name: RoleType.GENERAL },
            });
            user.roles = [defaultRole];
        } else {
            const newAdminRole: Partial<Role> = {
                name: RoleType.ADMIN,
                description: 'First Admin Role',
                status: status.ACTIVE,
            };
            await roleRepository.save(newAdminRole);
            const defaultRole: Role = await roleRepository.findOne({
                where: { status: status.ACTIVE, name: RoleType.ADMIN },
            });
            user.roles = [defaultRole];
        }

        const details = new UserDetails();
        user.details = details;

        const salt = await genSalt(10);
        user.password = await hash(password, salt);

        await user.save();
    }
}
