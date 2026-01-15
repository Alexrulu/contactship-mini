import { Injectable } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SupabaseService {
  public client: SupabaseClient;

  constructor(config: ConfigService) {
    const url = config.get<string>("SUPABASE_URL");
    const key = config.get<string>("SUPABASE_ANON_KEY");

    if (!url || !key) {
      throw new Error("Supabase environment variables are not defined");
    }

    this.client = createClient(url, key);
  }
}
