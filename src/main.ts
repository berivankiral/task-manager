import { NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import{NestExpressApplication} from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', true);
  app.use(cookieParser());

  app.use(require('express').json({ limit: '256mb' }));
  app.use(require('express').urlencoded({ limit: '256mb', extended: true }));

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

  await app.listen(3000);
}
bootstrap();