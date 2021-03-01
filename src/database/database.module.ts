import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: ['dist/**/*.entity{.js, .ts}'],
        subscribers: ['dist/**/*.subscriber{.js, .ts}'],
        synchronize: true,
        logging: true,
        migrationsTableName: 'migrations',
        migrations: ['dist/migration/*.js'],
        cli: {
          migrationsDir: 'migration',
        },
        ssl: configService.get('NODE_ENV') === 'production',
        extra: configService.get('NODE_ENV') === 'production' && {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
