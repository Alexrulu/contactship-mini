import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { LeadsService } from "./leads.service";
import { CreateLeadDto } from "./dto/create-lead.dto";

@Controller()
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  @Post("create-lead")
  create(@Body() dto: CreateLeadDto) {
    return this.leadsService.create(dto);
  }

  @Post('/leads/:id/summarize')
    async summarize(@Param('id') id: string) {
    await this.leadsService.enqueueSummarize(id);
    return { status: 'queued' };
  }

  @Post('sync-external')
    async triggerExternalSync() {
    await this.leadsService.enqueueExternalSync();
    return { status: 'queued' };
  }

  @Get("leads")
  findAll() {
    return this.leadsService.findAll();
  }

  @Get("leads/:id")
  findOne(@Param("id") id: string) {
    return this.leadsService.findById(id);
  }
}
