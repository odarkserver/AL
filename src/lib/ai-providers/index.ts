import { ZAIProvider } from './z-ai-provider'
import { OpenAIProvider } from './openai-provider'
import { AnthropicProvider } from './anthropic-provider'
import { GoogleProvider } from './google-provider'
import { HuggingFaceProvider } from './huggingface-provider'
import { GitHubProvider } from './github-provider'
import { CustomTrainableProvider } from './custom-trainable-provider'

export interface AIProvider {
  name: string
  models: AIModel[]
  chat: (messages: ChatMessage[], options?: ChatOptions) => Promise<ChatResponse>
  generateImage: (prompt: string, options?: ImageOptions) => Promise<ImageResponse>
  search?: (query: string, options?: SearchOptions) => Promise<SearchResponse>
}

export interface AIModel {
  id: string
  name: string
  provider: string
  type: 'chat' | 'image' | 'search' | 'multimodal'
  maxTokens?: number
  costPerToken?: number
  capabilities: string[]
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
  timestamp?: Date
}

export interface ChatOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
  systemPrompt?: string
}

export interface ChatResponse {
  content: string
  model: string
  provider: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  finishReason?: string
  timestamp: Date
}

export interface ImageOptions {
  size?: string
  quality?: string
  style?: string
  count?: number
}

export interface ImageResponse {
  images: string[]
  model: string
  provider: string
  prompt: string
  size: string
  cost?: number
  timestamp: Date
}

export interface SearchOptions {
  num?: number
  safe?: boolean
  type?: string
  dateRange?: string
}

export interface SearchResponse {
  results: SearchResult[]
  query: string
  totalResults: number
  provider: string
  timestamp: Date
}

export interface SearchResult {
  url: string
  title: string
  snippet: string
  rank: number
  date?: string
  favicon?: string
}

export class AIProviderManager {
  private providers: Map<string, AIProvider> = new Map()
  private defaultProvider = 'z-ai'

  constructor() {
    this.initializeProviders()
  }

  private async initializeProviders() {
    try {
      // Initialize Z-AI Ultra Provider (always available - UPGRADED)
      const zaiProvider = new ZAIProvider()
      this.providers.set('z-ai', zaiProvider)

      // Initialize GitHub AI Provider (always available - NEW)
      const githubProvider = new GitHubProvider()
      this.providers.set('github', githubProvider)

      // Initialize Custom Trainable Provider (always available - NEW)
      const customProvider = new CustomTrainableProvider()
      this.providers.set('custom-trainable', customProvider)

      // Initialize OpenAI Provider
      if (process.env.OPENAI_API_KEY) {
        const openaiProvider = new OpenAIProvider()
        this.providers.set('openai', openaiProvider)
      }

      // Initialize Anthropic Provider
      if (process.env.ANTHROPIC_API_KEY) {
        const anthropicProvider = new AnthropicProvider()
        this.providers.set('anthropic', anthropicProvider)
      }

      // Initialize Google Provider
      if (process.env.GOOGLE_AI_API_KEY) {
        const googleProvider = new GoogleProvider()
        this.providers.set('google', googleProvider)
      }

      // Initialize HuggingFace Provider
      if (process.env.HUGGINGFACE_API_KEY) {
        const hfProvider = new HuggingFaceProvider()
        this.providers.set('huggingface', hfProvider)
      }

      console.log(`Initialized ${this.providers.size} AI providers including Z-AI Ultra, GitHub AI, and Custom Trainable AI`)
    } catch (error) {
      console.error('Error initializing AI providers:', error)
    }
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  getProvider(name?: string): AIProvider {
    const providerName = name || this.defaultProvider
    const provider = this.providers.get(providerName)
    
    if (!provider) {
      throw new Error(`AI provider '${providerName}' not found. Available providers: ${this.getAvailableProviders().join(', ')}`)
    }
    
    return provider
  }

  getAllModels(): AIModel[] {
    const allModels: AIModel[] = []
    
    for (const provider of this.providers.values()) {
      allModels.push(...provider.models)
    }
    
    return allModels.sort((a, b) => a.name.localeCompare(b.name))
  }

  getModelsByType(type: AIModel['type']): AIModel[] {
    return this.getAllModels().filter(model => model.type === type)
  }

  getModelsByProvider(provider: string): AIModel[] {
    return this.getAllModels().filter(model => model.provider === provider)
  }

  async chat(messages: ChatMessage[], options?: ChatOptions & { provider?: string }): Promise<ChatResponse> {
    const provider = this.getProvider(options?.provider)
    return provider.chat(messages, options)
  }

  async generateImage(prompt: string, options?: ImageOptions & { provider?: string }): Promise<ImageResponse> {
    const provider = this.getProvider(options?.provider)
    return provider.generateImage(prompt, options)
  }

  async search(query: string, options?: SearchOptions & { provider?: string }): Promise<SearchResponse> {
    const provider = this.getProvider(options?.provider)
    
    if (!provider.search) {
      throw new Error(`Provider '${options?.provider || this.defaultProvider}' does not support search functionality`)
    }
    
    return provider.search(query, options)
  }

  setDefaultProvider(provider: string) {
    if (this.providers.has(provider)) {
      this.defaultProvider = provider
    } else {
      throw new Error(`Provider '${provider}' not found`)
    }
  }

  getDefaultProvider(): string {
    return this.defaultProvider
  }

  getProviderInfo(providerName: string) {
    const provider = this.providers.get(providerName)
    if (!provider) return null

    return {
      name: provider.name,
      models: provider.models,
      capabilities: {
        chat: true,
        image: provider.generateImage !== undefined,
        search: provider.search !== undefined
      }
    }
  }
}

// Singleton instance
export const aiManager = new AIProviderManager()

// Export types for use in other files
export * from './z-ai-provider'
export * from './openai-provider'
export * from './anthropic-provider'
export * from './google-provider'
export * from './huggingface-provider'
export * from './github-provider'
export * from './custom-trainable-provider'