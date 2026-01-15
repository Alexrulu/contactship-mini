import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ApiKeyGuard } from "./auth/api-key.guard";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  app.useGlobalGuards(new ApiKeyGuard(config));

  await app.listen(config.get("PORT") || 3000);
}
bootstrap();
