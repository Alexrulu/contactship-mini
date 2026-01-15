import { Injectable, ConflictException } from "@nestjs/common";
import { SupabaseService } from "../data/supabase.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { RedisService } from "../cache/redis.service";
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';

@Injectable()
export class LeadsService {
  constructor(
    private supabase: SupabaseService,
    private redis: RedisService,
    @InjectQueue('leads') private leadsQueue: Queue
  ) {}

  async create(dto: CreateLeadDto) {
    const { data, error } = await this.supabase.client
      .from("leads")
      .insert({
        ...dto,
        source: "manual",
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new ConflictException("Lead already exists");
      }
      throw error;
    }

    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase.client
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  }

  async findById(id: string) {
    const cacheKey = `lead:${id}`;
  
    try {
      const cached = await this.redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch {
    }
  
    const { data, error } = await this.supabase.client
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();
  
    if (error) throw error;
  
    try {
      await this.redis.set(cacheKey, JSON.stringify(data), 60);
    } catch {
    }
  
    return data;
  }

  async enqueueExternalSync() {
    await this.leadsQueue.add('sync-external');
  }

  async enqueueSummarize(leadId: string) {
    await this.leadsQueue.add('summarize', { leadId });
  }

}
