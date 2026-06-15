import { NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true })); 
  
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  const config = new DocumentBuilder()
    .setTitle('Task Manager API')
    .setDescription('Malwation Backend Intern Task')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();