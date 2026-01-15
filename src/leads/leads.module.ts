import { Module } from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { LeadsController } from "./leads.controller";
import { DatabaseModule } from "../data/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [LeadsController],
  providers: [LeadsService],
})
export class LeadsModule {}
