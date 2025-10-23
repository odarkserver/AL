import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, num = 10 } = body

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      )
    }

    if (num < 1 || num > 20) {
      return NextResponse.json(
        { error: 'Number of results must be between 1 and 20' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const searchResult = await zai.functions.invoke("web_search", {
      query: query,
      num: num
    })

    return NextResponse.json({
      query: query,
      results: searchResult,
      count: searchResult.length
    })

  } catch (error: any) {
    console.error('Web Search API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to perform web search',
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}