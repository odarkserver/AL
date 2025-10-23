import { HfInference } from '@huggingface/inference'
import { AIProvider, AIModel, ChatMessage, ChatOptions, ChatResponse, ImageOptions, ImageResponse } from './index'

export class HuggingFaceProvider implements AIProvider {
  name = 'HuggingFace'
  private client: HfInference | null = null

  models: AIModel[] = [
    {
      id: 'microsoft/DialoGPT-medium',
      name: 'DialoGPT Medium',
      provider: 'huggingface',
      type: 'chat',
      maxTokens: 2048,
      costPerToken: 0,
      capabilities: ['chat', 'conversation']
    },
    {
      id: 'microsoft/DialoGPT-large',
      name: 'DialoGPT Large',
      provider: 'huggingface',
      type: 'chat',
      maxTokens: 2048,
      costPerToken: 0,
      capabilities: ['chat', 'conversation']
    },
    {
      id: 'stabilityai/stable-diffusion-xl-base-1.0',
      name: 'Stable Diffusion XL',
      provider: 'huggingface',
      type: 'image',
      capabilities: ['image-generation', 'creative', 'artistic']
    },
    {
      id: 'runwayml/stable-diffusion-v1-5',
      name: 'Stable Diffusion v1.5',
      provider: 'huggingface',
      type: 'image',
      capabilities: ['image-generation', 'creative']
    },
    {
      id: 'google/flan-t5-large',
      name: 'FLAN-T5 Large',
      provider: 'huggingface',
      type: 'chat',
      maxTokens: 4096,
      capabilities: ['chat', 'reasoning', 'text-generation']
    }
  ]

  private async initialize() {
    if (!this.client) {
      const apiKey = process.env.HUGGINGFACE_API_KEY
      if (!apiKey) {
        throw new Error('HuggingFace API key not found in environment variables')
      }

      this.client = new HfInference(apiKey)
    }
  }

  async chat(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    await this.initialize()

    if (!this.client) {
      throw new Error('HuggingFace client not initialized')
    }

    try {
      const model = options?.model || 'microsoft/DialoGPT-medium'
      
      // For conversation models like DialoGPT, we need to handle the conversation differently
      if (model.includes('DialoGPT')) {
        return await this.handleDialoGPT(messages, options)
      }

      // For text generation models like FLAN-T5
      if (model.includes('flan-t5')) {
        return await this.handleTextGeneration(messages, options)
      }

      throw new Error(`Unsupported model: ${model}`)

    } catch (error) {
      console.error('HuggingFace chat error:', error)
      throw new Error(`HuggingFace chat failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async handleDialoGPT(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    if (!this.client) throw new Error('Client not initialized')

    // Get the last user message for DialoGPT
    const lastUserMessage = messages.filter(msg => msg.role === 'user').pop()
    if (!lastUserMessage) {
      throw new Error('No user message found')
    }

    try {
      const response = await this.client.textGeneration({
        model: 'microsoft/DialoGPT-medium',
        inputs: lastUserMessage.content,
        parameters: {
          max_length: options?.maxTokens || 200,
          temperature: options?.temperature || 0.7,
          do_sample: true,
          top_p: 0.9,
          return_full_text: false
        }
      })

      return {
        content: response.generated_text.trim(),
        model: 'microsoft/DialoGPT-medium',
        provider: 'huggingface',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        },
        finishReason: 'stop',
        timestamp: new Date()
      }

    } catch (error) {
      throw new Error(`DialoGPT generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private async handleTextGeneration(messages: ChatMessage[], options?: ChatOptions): Promise<ChatResponse> {
    if (!this.client) throw new Error('Client not initialized')

    const systemPrompt = options?.systemPrompt || `You are ODARK AI Assistant, an intelligent, friendly, and helpful AI assistant.

Guidelines:
- Always be responsive and helpful to users
- Provide informative and accurate answers
- Use good and polite Indonesian language when appropriate
- Help with various types of questions: education, technology, creativity, etc.
- If you don't know the answer, say so honestly
- Avoid harmful, illegal, or unethical content
- Focus on providing positive value to users`

    // Combine messages into a single prompt for FLAN-T5
    const combinedPrompt = `${systemPrompt}\n\nConversation:\n${messages.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nassistant:`

    try {
      const response = await this.client.textGeneration({
        model: 'google/flan-t5-large',
        inputs: combinedPrompt,
        parameters: {
          max_length: options?.maxTokens || 200,
          temperature: options?.temperature || 0.7,
          do_sample: true,
          top_p: 0.9,
          return_full_text: false
        }
      })

      return {
        content: response.generated_text.trim(),
        model: 'google/flan-t5-large',
        provider: 'huggingface',
        usage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0
        },
        finishReason: 'stop',
        timestamp: new Date()
      }

    } catch (error) {
      throw new Error(`FLAN-T5 generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async generateImage(prompt: string, options?: ImageOptions): Promise<ImageResponse> {
    await this.initialize()

    if (!this.client) {
      throw new Error('HuggingFace client not initialized')
    }

    try {
      const model = options?.model || 'stabilityai/stable-diffusion-xl-base-1.0'

      const response = await this.client.textToImage({
        model: model,
        inputs: prompt,
        parameters: {
          num_inference_steps: 25,
          guidance_scale: 7.5,
          width: 1024,
          height: 1024
        }
      })

      // Convert blob to base64
      const buffer = await response.arrayBuffer()
      const base64 = Buffer.from(buffer).toString('base64')
      const imageUrl = `data:image/png;base64,${base64}`

      return {
        images: [imageUrl],
        model: model,
        provider: 'huggingface',
        prompt: prompt,
        size: '1024x1024',
        timestamp: new Date()
      }

    } catch (error) {
      console.error('HuggingFace image generation error:', error)
      throw new Error(`HuggingFace image generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}