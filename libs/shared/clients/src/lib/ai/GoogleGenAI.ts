import {
  GenerativeModel,
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';

export interface GoogleGenAIParams {
  apiKey: string;
  model: 'gemini-1.5-flash';
}

export class GoogleGenAI {
  private readonly model: GenerativeModel;

  constructor(params: GoogleGenAIParams) {
    const genAI = new GoogleGenerativeAI(params.apiKey);
    this.model = genAI.getGenerativeModel({
      model: params.model,
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
        },
      ],
    });
  }

  public async generateContent(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}
