import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

const SWAGGER_ENVS = ['local', 'dev', 'staging'];

async function bootstrap() {
  const PORT = process.env.PORT || 3000;
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  if (SWAGGER_ENVS.includes(process.env.NODE_ENV)) {
    app.use(
      ['/docs', '/docs-json'],
      basicAuth({
        challenge: true,
        users: {
          [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD,
        },
      }),
    );
  }

  // app.enableCors({
  //   origin: '*',
  //   allowedHeaders: 'Content-Type, Access-Control-Allow-Headers, Authorization',
  // });

  const config = new DocumentBuilder()
    .setTitle('Nest-Template')
    .setDescription('This project create by Akiira Template')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(PORT, '0.0.0.0');

  console.log(`LISTEN ON PROT : ${PORT}`);
  console.log(`${await app.getUrl()}`);
}
bootstrap();
