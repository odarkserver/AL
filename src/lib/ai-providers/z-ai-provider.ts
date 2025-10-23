import ZAI from 'z-ai-web-dev-sdk'
import { AIProvider, AIModel, ChatMessage, ChatOptions, ChatResponse, ImageOptions, ImageResponse, SearchOptions, SearchResponse } from './index'

export class ZAIProvider implements AIProvider {
  name = 'Z-AI'
  private zai: any = null

  models: AIModel[] = [
    {
      id: 'z-ai-chat',
      name: 'Z-AI Chat',
      provider: 'z-ai',
      type: 'chat',
      maxTokens: 2000,
      capabilities: ['chat', 'reasoning', 'coding']
    },
    {
      id: 'z-ai-image',
      name: 'Z-AI Image',
      provider: 'z-ai',
      type: 'image',
      capabilities: ['image-generation', 'creative']
    },
    {
      id: 'z-ai-search',
      name: 'Z-AI Search',
      provider: 'z-ai',
      type: 'search',
      capabilities: ['web-search', 'real-time']
    }
  ]

  private async initialize() {
    if (!this.zai) {
      try {
        this.zai = await ZAI.create()
      } catch (error) {
        console.error('Failed to initialize Z-AI:', error)
        throw new Error('Z-AI initialization failed')
      }
    }
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    await this.initialize()

    try {
      const systemPrompt = options?.systemPrompt || `Anda adalah ODARK AI Assistant, sebuah asisten AI yang cerdas, ramah, dan sangat membantu. 

Panduan perilaku:
- Selalu responsif dan membantu pengguna
- Berikan jawaban yang informatif dan akurat
- Gunakan bahasa Indonesia yang baik dan sopan
- Bantu berbagai jenis pertanyaan: edukasi, teknologi, kreativitas, dll
- Jika tidak tahu jawabannya, sampaikan dengan jujur
- Hindari konten yang berbahaya, ilegal, atau tidak etis
- Fokus pada memberikan nilai positif kepada pengguna

Tujuan Anda adalah menjadi asisten AI yang dapat diandalkan dan bermanfaat untuk berbagai kebutuhan pengguna.`

      const completion = await this.zai.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        ],
        temperature: options?.temperature || 0.7,
        max_tokens: options?.maxTokens || 2000
      })

      const messageContent = completion.choices[0]?.message?.content

      if (!messageContent) {
        throw new Error('No response from Z-AI')
      }

      return {
        content: messageContent,
        model: options?.model || 'z-ai-chat',
        provider: 'z-ai',
        usage: {
          promptTokens: completion.usage?.prompt_tokens || 0,
          completionTokens: completion.usage?.completion_tokens || 0,
          totalTokens: completion.usage?.total_tokens || 0
        },
        finishReason: completion.choices[0]?.finish_reason || 'stop',
        timestamp: new Date()
      }

    } catch (error) {
      console.error('Z-AI chat error:', error)
      throw new Error(`Z-AI chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async generateImage(prompt: string, options?: ImageOptions): Promise<ImageResponse> {
    await this.initialize()

    try {
      const validSizes = ['512x512', '1024x1024', '1024x1792', '1792x1024']
      const size = options?.size || '1024x1024'
      
      if (!validSizes.includes(size)) {
        throw new Error(`Invalid size: ${size}. Valid sizes: ${validSizes.join(', ')}`)
      }

      const response = await this.zai.images.generations.create({
        prompt: prompt,
        size: size
      })

      const imageBase64 = response.data[0]?.base64

      if (!imageBase64) {
        throw new Error('No image data received from Z-AI')
      }

      return {
        images: [imageBase64],
        model: 'z-ai-image',
        provider: 'z-ai',
        prompt: prompt,
        size: size,
        timestamp: new Date()
      }

    } catch (error) {
      console.error('Z-AI image generation error:', error)
      throw new Error(`Z-AI image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async search(query: string, options?: SearchOptions): Promise<SearchResponse> {
    await this.initialize()

    try {
      const num = options?.num || 10
      
      if (num < 1 || num > 20) {
        throw new Error('Number of results must be between 1 and 20')
      }

      const searchResult = await this.zai.functions.invoke("web_search", {
        query: query,
        num: num
      })

      return {
        results: searchResult.map((result: any, index: number) => ({
          url: result.url,
          title: result.name,
          snippet: result.snippet,
          rank: result.rank,
          date: result.date,
          favicon: result.favicon
        })),
        query: query,
        totalResults: searchResult.length,
        provider: 'z-ai',
        timestamp: new Date()
      }

    } catch (error) {
      console.error('Z-AI search error:', error)
      throw new Error(`Z-AI search failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}