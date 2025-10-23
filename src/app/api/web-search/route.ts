import { NextRequest, NextResponse } from 'next/server'
import { aiManager } from '@/lib/ai-providers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, num, provider, safe, type, dateRange } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    if (num && (num < 1 || num > 20)) {
      return NextResponse.json(
        { error: 'Number of results must be between 1 and 20' },
        { status: 400 }
      )
    }

    // Call AI with multi-provider support
    const response = await aiManager.search(query, {
      num: num || 10,
      provider: provider,
      safe: safe,
      type: type,
      dateRange: dateRange
    })

    return NextResponse.json({
      results: response.results,
      query: response.query,
      totalResults: response.totalResults,
      provider: response.provider,
      timestamp: response.timestamp
    })

  } catch (error: any) {
    console.error('Multi-Provider Web Search API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to perform web search',
        message: error.message || 'Internal server error',
        availableProviders: aiManager.getAvailableProviders()
      },
      { status: 500 }
    )
  }
}

// GET endpoint to get available search providers
export async function GET() {
  try {
    const availableProviders = aiManager.getAvailableProviders()
    const searchModels = aiManager.getModelsByType('search')

    const searchProviders = availableProviders.filter(providerName => {
      const info = aiManager.getProviderInfo(providerName)
      return info?.capabilities.search
    })

    return NextResponse.json({
      providers: searchProviders,
      models: searchModels,
      availableOptions: {
        num: [1, 5, 10, 15, 20],
        safe: [true, false],
        type: ['web', 'news', 'images', 'videos'],
        dateRange: ['day', 'week', 'month', 'year']
      }
    })

  } catch (error: any) {
    console.error('Web Search Info API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get web search information',
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}