import Anthropic from '@anthropic-ai/sdk'
import { AIProvider, AIModel, ChatMessage, ChatOptions, ChatResponse } from './index'

export class AnthropicProvider implements AIProvider {
  name = 'Anthropic'
  private client: Anthropic | null = null

  models: AIModel[] = [
    {
      id: 'claude-3-opus-20240229',
      name: 'Claude 3 Opus',
      provider: 'anthropic',
      type: 'chat',
      maxTokens: 4096,
      costPerToken: 0.000075,
      capabilities: ['chat', 'reasoning', 'analysis', 'coding', 'creative-writing']
    },
    {
      id: 'claude-3-sonnet-20240229',
      name: 'Claude 3 Sonnet',
      provider: 'anthropic',
      type: 'chat',
      maxTokens: 4096,
      costPerToken: 0.000015,
      capabilities: ['chat', 'reasoning', 'coding', 'analysis']
    },
    {
      id: 'claude-3-haiku-20240307',
      name: 'Claude 3 Haiku',
      provider: 'anthropic',
      type: 'chat',
      maxTokens: 4096,
      costPerToken: 0.00000025,
      capabilities: ['chat', 'quick-responses', 'coding']
    }
  ]

  private async initialize() {
    if (!this.client) {
      const apiKey = process.env.ANTHROPIC_API_KEY
      if (!apiKey) {
        throw new Error('Anthropic API key not found in environment variables')
      }

      this.client = new Anthropic({
        apiKey: apiKey
      })
    }
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    await this.initialize()

    if (!this.client) {
      throw new Error('Anthropic client not initialized')
    }

    try {
      const systemPrompt = options?.systemPrompt || `You are ODARK AI Assistant, an intelligent, friendly, and helpful AI assistant.

Guidelines:
- Always be responsive and helpful to users
- Provide informative and accurate answers
- Use good and polite Indonesian language when appropriate
- Help with various types of questions: education, technology, creativity, etc.
- If you don't know the answer, say so honestly
- Avoid harmful, illegal, or unethical content
- Focus on providing positive value to users
- Be thorough yet concise in your responses
- Show reasoning when helpful

Your goal is to be a reliable and useful AI assistant for various user needs.`

      // Convert messages to Anthropic format
      const anthropicMessages = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))

      const response = await this.client.messages.create({
        model: options?.model || 'claude-3-haiku-20240307',
        max_tokens: options?.maxTokens || 2000,
        temperature: options?.temperature || 0.7,
        system: systemPrompt,
        messages: anthropicMessages
      })

      const content = response.content[0]
      if (content.type !== 'text') {
        throw new Error('Unexpected response type from Anthropic')
      }

      return {
        content: content.text,
        model: response.model,
        provider: 'anthropic',
        usage: {
          promptTokens: response.usage.input_tokens,
          completionTokens: response.usage.output_tokens,
          totalTokens: response.usage.input_tokens + response.usage.output_tokens
        },
        finishReason: response.stop_reason || 'end_turn',
        timestamp: new Date()
      }

    } catch (error) {
      console.error('Anthropic chat error:', error)
      throw new Error(`Anthropic chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Anthropic doesn't have image generation API
  async generateImage(prompt: string, options?: ImageOptions): Promise<ImageResponse> {
    throw new Error('Anthropic does not support image generation')
  }
}