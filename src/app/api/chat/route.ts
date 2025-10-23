import { NextRequest, NextResponse } from 'next/server'
import { aiManager, ChatMessage } from '@/lib/ai-providers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages, provider, model, temperature, maxTokens, systemPrompt } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Convert messages to ChatMessage format
    const chatMessages: ChatMessage[] = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined
    }))

    // Call AI with multi-provider support
    const response = await aiManager.chat(chatMessages, {
      provider: provider,
      model: model,
      temperature: temperature,
      maxTokens: maxTokens,
      systemPrompt: systemPrompt
    })

    return NextResponse.json({
      content: response.content,
      model: response.model,
      provider: response.provider,
      usage: response.usage,
      finishReason: response.finishReason,
      timestamp: response.timestamp
    })

  } catch (error: any) {
    console.error('Multi-Provider Chat API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        message: error.message || 'Internal server error',
        availableProviders: aiManager.getAvailableProviders()
      },
      { status: 500 }
    )
  }
}

// GET endpoint to get available providers and models
export async function GET() {
  try {
    const availableProviders = aiManager.getAvailableProviders()
    const allModels = aiManager.getAllModels()
    const defaultProvider = aiManager.getDefaultProvider()

    const providerInfo = availableProviders.map(providerName => 
      aiManager.getProviderInfo(providerName)
    )

    return NextResponse.json({
      providers: availableProviders,
      models: allModels,
      defaultProvider,
      providerInfo
    })

  } catch (error: any) {
    console.error('Chat Info API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get chat information',
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}