import { Module } from "@nestjs/common";
import { ConfigModule,ConfigService } from "@nestjs/config";
import { LeadsModule } from './leads/leads.module';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get('REDIS_HOST'),
          port: Number(config.get('REDIS_PORT')),
        },
      }),
    }),
    LeadsModule,
    ScheduleModule.forRoot()
  ],
})
export class AppModule {}
