import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PSWD'),
        database: configService.get('DB_NAME'),
        synchronize: true,
        bigNumberStrings: true,
        multipleStatements: true,
        logging: ['error', 'schema', 'migration', 'warn'],
        entities: ['**/*.entity{ .ts,.js}'],
        migrations: ['dist/db/migrations/*{.ts,.js}'],
        migrationsRun: false,
      }),
    }),
    UserModule,
    AuthModule,
    // CategoryModule,
    // ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
