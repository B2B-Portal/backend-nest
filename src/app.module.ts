import { join } from 'path';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { UserModule } from './user/user.module';
import { dataSourceOptions } from './config/ormconfig';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      playground: false,
      sortSchema: true,
      driver: ApolloDriver,
      context: ({ req }) => ({ req }),
      autoSchemaFile: join(process.cwd(), './schema.gql'),
      plugins: [ApolloServerPluginLandingPageLocalDefault()]
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username:configService.get('DB_USER'),
        password: configService.get('DB_PSWD'),
        database: configService.get('DB_NAME'),
        synchronize: false,
        bigNumberStrings: true,
        multipleStatements: true,
        logging: ['error', 'schema', 'migration', 'warn'],
        entities: ['**/*.entity{ .ts,.js}'],
        migrations: ['dist/db/migrations/*{.ts,.js}'],
        migrationsRun: false,
      })
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
