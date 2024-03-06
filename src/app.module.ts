import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { BrandModule } from './brand/brand.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductOderModule } from './product-oder/product-oder.module';

@Module({
  imports: [ProductsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.string().required(),


        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        PORT: Joi.number(),
      })
    }),
    DatabaseModule,
    UsersModule,
    AuthenticationModule,
    BrandModule,
    CategoriesModule,
    ProductOderModule,
  ],
    
  controllers: [],
  providers: [],
})
export class AppModule {}
