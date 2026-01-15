import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ApiKeyGuard } from "./auth/api-key.guard";
import { ConfigService } from "@nestjs/config";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  app.useGlobalGuards(new ApiKeyGuard(config));

  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }),
);

  await app.listen(config.get("PORT") || 3000);
}
bootstrap();
