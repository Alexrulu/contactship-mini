import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';

@Injectable()
export class AiService {
  private client: OpenAI;

  constructor(private config: ConfigService) {
    const apiKey = this.config.get<string>('HF_TOKEN')!;
    this.client = new OpenAI({
      baseURL: 'https://router.huggingface.co/v1',
      apiKey,
    });
  }

  async summarizeLead(input: string) {
    const completion = await this.client.chat.completions.create({
      model: 'zai-org/GLM-4.7:novita',
      messages: [
        { role: 'system', content: 'You output only JSON with summary and next_action.' },
        { role: 'user', content: input },
      ],
      temperature: 0.2,
    });

    let raw = completion.choices[0].message?.content;
    if (!raw) throw new Error('Empty AI response');

    raw = raw.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error('Failed to parse AI response:', raw);
      throw e;
    }
  }
}
