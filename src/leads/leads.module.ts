import { Module } from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { LeadsController } from "./leads.controller";
import { DatabaseModule } from "../data/database.module";
import { CacheModule } from "../cache/cache.module";

@Module({
  imports: [DatabaseModule, CacheModule],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
