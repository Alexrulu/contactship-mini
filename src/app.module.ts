import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LeadsModule } from './leads/leads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LeadsModule,
  ],
})
export class AppModule {}
