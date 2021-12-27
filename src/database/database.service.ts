import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectionOptions } from 'typeorm';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';
import { Configuration } from '../config/config.keys';

export const databaseProviders = [
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        async useFactory(config: ConfigService) {
            return {
                ssl:
                    config.get(Configuration.DB1_SSL) === 'true' ? true : false,
                type: config.get(Configuration.DB1_TYPE),
                host: config.get(Configuration.DB1_HOST),
                port: config.get(Configuration.DB1_PORT) as unknown as number,
                database: config.get(Configuration.DB1_DATABASE),
                username: config.get(Configuration.DB1_USERNAME),
                password: config.get(Configuration.DB1_PASSWORD),
                logging:
                    config.get(Configuration.DB1_LOGGING) === 'true'
                        ? true
                        : false,
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                migrations: [__dirname + '/migrations/*{.ts,.js}'],
            } as ConnectionOptions;
        },
    }),
];
