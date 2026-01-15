import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { SupabaseService } from '../data/supabase.service';
import { Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AiService } from '../ai/ai.service';

@Processor('leads')
export class LeadsProcessor {
  private readonly logger = new Logger(LeadsProcessor.name);

  constructor(
    private supabase: SupabaseService,
    private http: HttpService,
    private ai: AiService
  ) {this.logger.log('LeadsProcessor loaded');}

  @Process('sync-external')
  async syncExternal() {
    this.logger.log('Syncing external leads');
  
    const { data } = await firstValueFrom(
      this.http.get('https://randomuser.me/api/?results=10')
    );
  
    for (const user of data.results) {
      const uniqueEmail = `${user.login.username}.${Date.now()}@example.com`;
  
      const lead = {
        first_name: user.name.first,
        last_name: user.name.last,
        email: uniqueEmail,
        source: 'external',
      };
  
      const { error } = await this.supabase.client
        .from('leads')
        .insert(lead);
  
      if (error) {
        this.logger.error(
          `Failed to insert lead ${uniqueEmail}: ${JSON.stringify(error)}`
        );
        continue;
      }
  
      this.logger.log(`External lead inserted: ${uniqueEmail}`);
      await new Promise((r) => setTimeout(r, 50));
    }
  
    this.logger.log('External sync finished');
  }

  @Process('summarize')
  async summarize(job: Job<{ leadId: string }>) {
    const { leadId } = job.data;
    this.logger.log(`Summarizing lead ${leadId}`);
  
    try {
      const { data: lead, error } = await this.supabase.client
        .from('leads')
        .select('*')
        .eq('id', leadId)
        .single();
  
      if (error) throw error;
  
      const result = await this.ai.summarizeLead(
        `Nombre: ${lead.name}\nEmail: ${lead.email}\nOrigen: ${lead.source}`
      );
  
      await this.supabase.client
        .from('leads')
        .update({
          summary: result.summary,
          next_action: result.next_action,
        })
        .eq('id', leadId);
  
      this.logger.log(`Lead ${leadId} summarized: ${JSON.stringify(result)}`);
    } catch (err) {
      this.logger.error(`AI summarize failed for lead ${leadId}: ${err.message}`);
    }
  }
}
