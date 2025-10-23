import { NextRequest, NextResponse } from 'next/server'
import { aiManager } from '@/lib/ai-providers'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const headersList = headers()
    const host = headersList.get('host') || 'localhost'
    const protocol = request.nextUrl.protocol

    // Get system information
    const availableProviders = aiManager.getAvailableProviders()
    const allModels = aiManager.getAllModels()
    const defaultProvider = aiManager.getDefaultProvider()

    // Provider details
    const providerDetails = availableProviders.map(providerName => {
      const info = aiManager.getProviderInfo(providerName)
      return {
        name: providerName,
        displayName: info?.name || providerName,
        modelCount: info?.models?.length || 0,
        capabilities: info?.capabilities || {},
        models: info?.models || []
      }
    })

    // Model statistics
    const modelStats = {
      total: allModels.length,
      byType: {
        chat: allModels.filter(m => m.type === 'chat').length,
        image: allModels.filter(m => m.type === 'image').length,
        search: allModels.filter(m => m.type === 'search').length,
        multimodal: allModels.filter(m => m.type === 'multimodal').length
      },
      byProvider: {} as Record<string, number>
    }

    allModels.forEach(model => {
      modelStats.byProvider[model.provider] = (modelStats.byProvider[model.provider] || 0) + 1
    })

    // Environment info
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      availableProviders: {
        'Z-AI': true, // Always available
        'OpenAI': !!process.env.OPENAI_API_KEY,
        'Anthropic': !!process.env.ANTHROPIC_API_KEY,
        'Google': !!process.env.GOOGLE_AI_API_KEY,
        'HuggingFace': !!process.env.HUGGINGFACE_API_KEY
      },
      hasApiKeys: {
        openai: !!process.env.OPENAI_API_KEY,
        anthropic: !!process.env.ANTHROPIC_API_KEY,
        google: !!process.env.GOOGLE_AI_API_KEY,
        huggingface: !!process.env.HUGGINGFACE_API_KEY
      }
    }

    // System status
    const systemStatus = {
      status: 'online',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString()
    }

    const systemInfo = {
      application: {
        name: 'ODARK AI Assistant',
        version: '2.0.0',
        description: 'Multi-provider AI assistant with chat, image generation, and web search capabilities',
        baseUrl: `${protocol}//${host}`,
        status: systemStatus
      },
      providers: {
        available: availableProviders,
        default: defaultProvider,
        total: availableProviders.length,
        details: providerDetails
      },
      models: {
        total: modelStats.total,
        statistics: modelStats,
        list: allModels.map(model => ({
          id: model.id,
          name: model.name,
          provider: model.provider,
          type: model.type,
          capabilities: model.capabilities,
          maxTokens: model.maxTokens,
          costPerToken: model.costPerToken
        }))
      },
      environment: envInfo,
      features: {
        chat: true,
        imageGeneration: true,
        webSearch: true,
        multiProvider: true,
        modelSelection: true,
        tokenTracking: true,
        costEstimation: true
      },
      endpoints: {
        chat: `${protocol}//${host}/api/ai/chat`,
        image: `${protocol}//${host}/api/ai/image`,
        search: `${protocol}//${host}/api/ai/search`,
        providers: `${protocol}//${host}/api/ai/providers`,
        models: `${protocol}//${host}/api/ai/models`,
        systemInfo: `${protocol}//${host}/api/ai/system-info`
      }
    }

    return NextResponse.json(systemInfo, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error('Error getting system info:', error)
    return NextResponse.json({
      error: 'Failed to get system information',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}