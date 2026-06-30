import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const MODEL_CANDIDATES = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
];

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string; thought?: boolean }>;
    };
  }>;
};

export type GeneratedText = {
  text: string;
  model: string;
};

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);

  constructor(private readonly config: ConfigService) {}

  async generateText(
    systemPrompt: string,
    userPrompt: string,
    maxTokens: number,
  ): Promise<GeneratedText> {
    // get the API key
    const apiKey =
      this.config.get<string>('GEMINI_API_KEY') ??
      this.config.get<string>('GEMINI_aPI_KEY');
    if (!apiKey) {
      throw new ServiceUnavailableException('Gemini API key is not configured');
    }

    // try each model
    for (const model of MODEL_CANDIDATES) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
              generationConfig: {
                temperature: 0,
                maxOutputTokens: maxTokens,
                ...(model === 'gemini-2.5-flash'
                  ? { thinkingConfig: { thinkingBudget: 0 } }
                  : {}),
              },
            }),
            signal: AbortSignal.timeout(15_000),
          },
        );

        if (!response.ok) {
          this.logger.warn(`${model} returned ${response.status}`);
          continue;
        }

        // read the model text
        const data = (await response.json()) as GeminiResponse;
        const text = data.candidates?.[0]?.content?.parts
          ?.filter((part) => !part.thought)
          .map((part) => part.text ?? '')
          .join('')
          .trim();

        if (text) {
          this.logger.log(`Using Gemini model: ${model}`);
          return { text, model };
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        this.logger.warn(`${model} failed: ${message}`);
      }
    }

    throw new ServiceUnavailableException('Gemini is not available');
  }
}
