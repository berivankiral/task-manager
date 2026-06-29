import { NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFastifyApplication, FastifyAdapter } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import {join} from 'path';
//import{NestExpressApplication} from '@nestjs/platform-express';
//import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, 
    new FastifyAdapter({trustProxy: true, logger: true, bodyLimit: 256 * 1024 * 1024}),);

    await app.register(fastifyCookie, {
      secret: process.env.COOKIE_SECRET || 'default_secret', // for cookies signature
    });

    await app.register(fastifyMultipart, {
      limits: {
        fileSize: 256 * 1024 * 1024, // 256 MB
      },
    });

    await app.register(fastifyStatic, {
      root: join(__dirname, '..', 'uploads'),
      prefix: '/uploads/',
    });

  // app.set('trust proxy', true);
  // app.use(cookieParser());

  // app.use(require('express').json({ limit: '256mb' }));
  // app.use(require('express').urlencoded({ limit: '256mb', extended: true }));

  app.enableCors({
   origin: /https?:\/\/(?:localhost|127\.0\.0\.1|(?:\d{1,3}\.){3}\d{1,3})(:\d+)?$/,
   //origin: true,
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   credentials: true,
   });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })); 
  
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('Malwation Backend Intern Task')
    .setVersion('1.0')
    .addBearerAuth()
.addCookieAuth('access_token', {
  type: 'apiKey',
  in: 'cookie',
  name: 'access_token',
  description: 'JWT session cookie',
})
    .build();
  

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000 , '0.0.0.0');  //"0.0.0.0" docker içinde dışardan erişim için ekledm
}
bootstrap();