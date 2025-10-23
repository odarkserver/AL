import OpenAI from 'openai'
import { AIProvider, AIModel, ChatMessage, ChatOptions, ChatResponse, ImageOptions, ImageResponse } from './index'

export class OpenAIProvider implements AIProvider {
  name = 'OpenAI'
  private client: OpenAI | null = null

  models: AIModel[] = [
    {
      id: 'gpt-4-turbo',
      name: 'GPT-4 Turbo',
      provider: 'openai',
      type: 'chat',
      maxTokens: 128000,
      costPerToken: 0.00001,
      capabilities: ['chat', 'reasoning', 'coding', 'analysis']
    },
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'openai',
      type: 'chat',
      maxTokens: 8192,
      costPerToken: 0.00003,
      capabilities: ['chat', 'reasoning', 'coding']
    },
    {
      id: 'gpt-3.5-turbo',
      name: 'GPT-3.5 Turbo',
      provider: 'openai',
      type: 'chat',
      maxTokens: 4096,
      costPerToken: 0.000001,
      capabilities: ['chat', 'coding', 'text-generation']
    },
    {
      id: 'dall-e-3',
      name: 'DALL-E 3',
      provider: 'openai',
      type: 'image',
      capabilities: ['image-generation', 'creative', 'realistic']
    },
    {
      id: 'dall-e-2',
      name: 'DALL-E 2',
      provider: 'openai',
      type: 'image',
      capabilities: ['image-generation', 'creative']
    }
  ]

  private async initialize() {
    if (!this.client) {
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        throw new Error('OpenAI API key not found in environment variables')
      }

      this.client = new OpenAI({
        apiKey: apiKey
      })
    }
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    await this.initialize()

    if (!this.client) {
      throw new Error('OpenAI client not initialized')
    }

    try {
      const systemPrompt = options?.systemPrompt || `You are ODARK AI Assistant, an intelligent, friendly, and helpful AI assistant.

Guidelines:
- Always be responsive and helpful to users
- Provide informative and accurate answers
- Use good and polite Indonesian language
- Help with various types of questions: education, technology, creativity, etc.
- If you don't know the answer, say so honestly
- Avoid harmful, illegal, or unethical content
- Focus on providing positive value to users

Your goal is to be a reliable and useful AI assistant for various user needs.`

      const completion = await this.client.chat.completions.create({
        model: options?.model || 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role as 'system' | 'user' | 'assistant',
            content: msg.content
          }))
        ],
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens,
        stream: options?.stream || false
      })

      const messageContent = completion.choices[0]?.message?.content

      if (!messageContent) {
        throw new Error('No response from OpenAI')
      }

      return {
        content: messageContent,
        model: completion.model,
        provider: 'openai',
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0
        },
        finishReason: completion.choices[0]?.finish_reason || 'stop',
        timestamp: new Date()
      }

    } catch (error) {
      console.error('OpenAI chat error:', error)
      throw new Error(`OpenAI chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async generateImage(prompt: string, options?: ImageOptions): Promise<ImageResponse> {
    await this.initialize()

    if (!this.client) {
      throw new Error('OpenAI client not initialized')
    }

    try {
      const validSizes = ['1024x1024', '1792x1024', '1024x1792']
      const size = options?.size || '1024x1024'
      
      if (!validSizes.includes(size)) {
        throw new Error(`Invalid size: ${size}. Valid sizes: ${validSizes.join(', ')}`)
      }

      const response = await this.client.images.generate({
        model: 'dall-e-3',
        prompt: prompt,
        size: size as '1024x1024' | '1792x1024' | '1024x1792',
        quality: (options?.quality as 'standard' | 'hd') || 'standard',
        n: options?.count || 1
      })

      const images = response.data.map(img => img.url || '')

      if (images.length === 0) {
        throw new Error('No images generated')
      }

      return {
        images: images,
        model: 'dall-e-3',
        provider: 'openai',
        prompt: prompt,
        size: size,
        timestamp: new Date()
      }

    } catch (error) {
      console.error('OpenAI image generation error:', error)
      throw new Error(`OpenAI image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}