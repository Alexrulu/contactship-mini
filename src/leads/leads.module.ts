import { Module } from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { LeadsController } from "./leads.controller";
import { DatabaseModule } from "../data/database.module";
import { CacheModule } from "../cache/cache.module";
import { BullModule } from '@nestjs/bull';
import { LeadsSync } from './leads.sync';
import { LeadsProcessor } from './leads.processor';
import { HttpModule } from '@nestjs/axios';
import { AiService } from "src/ai/ai.service";

@Module({
  imports: [
    DatabaseModule, 
    CacheModule, 
    BullModule.registerQueue({
      name: 'leads',
    }),
    HttpModule,
  ],
  controllers: [LeadsController],
  providers: [LeadsService, LeadsSync, LeadsProcessor, AiService],
})
export class LeadsModule {}
 