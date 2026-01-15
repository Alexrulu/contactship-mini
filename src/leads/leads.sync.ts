import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class LeadsSync {
  private readonly logger = new Logger(LeadsSync.name);

  constructor(
    @InjectQueue('leads') private leadsQueue: Queue
  ) {}

  @Cron('*/5 * * * *')
  async handleCron() {
    this.logger.log('Enqueuing external leads sync');
    await this.leadsQueue.add('sync-external');
  }
}
