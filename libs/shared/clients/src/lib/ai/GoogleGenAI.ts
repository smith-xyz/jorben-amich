import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';

export interface GoogleGenAIParams {
  apiKey: string;
  model: 'gemini-1.5-flash';
}

export class GoogleGenAI {
  private readonly model: GenerativeModel;

  constructor(params: GoogleGenAIParams) {
    const genAI = new GoogleGenerativeAI(params.apiKey);
    this.model = genAI.getGenerativeModel({ model: params.model });
  }

  public async generateContent(prompt: string): Promise<string> {
    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}
