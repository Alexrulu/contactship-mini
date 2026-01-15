import { Injectable, ConflictException } from "@nestjs/common";
import { SupabaseService } from "../data/supabase.service";
import { CreateLeadDto } from "./dto/create-lead.dto";

@Injectable()
export class LeadsService {
  constructor(private supabase: SupabaseService) {}

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
    const { data, error } = await this.supabase.client
      .from("leads")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  }
}
