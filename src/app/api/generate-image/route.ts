import { NextRequest, NextResponse } from 'next/server'
import { aiManager } from '@/lib/ai-providers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, size, provider, quality, style, count } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Validate size
    const validSizes = ['512x512', '1024x1024', '1024x1792', '1792x1024']
    if (size && !validSizes.includes(size)) {
      return NextResponse.json(
        { error: 'Invalid size. Valid sizes: 512x512, 1024x1024, 1024x1792, 1792x1024' },
        { status: 400 }
      )
    }

    // Call AI with multi-provider support
    const response = await aiManager.generateImage(prompt, {
      size: size || '1024x1024',
      provider: provider,
      quality: quality,
      style: style,
      count: count || 1
    })

    return NextResponse.json({
      images: response.images,
      model: response.model,
      provider: response.provider,
      prompt: response.prompt,
      size: response.size,
      cost: response.cost,
      timestamp: response.timestamp
    })

  } catch (error: any) {
    console.error('Multi-Provider Image Generation API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        message: error.message || 'Internal server error',
        availableProviders: aiManager.getAvailableProviders()
      },
      { status: 500 }
    )
  }
}

// GET endpoint to get available image generation providers and models
export async function GET() {
  try {
    const availableProviders = aiManager.getAvailableProviders()
    const imageModels = aiManager.getModelsByType('image')
    const multimodalModels = aiManager.getModelsByType('multimodal')

    const imageProviders = availableProviders.filter(providerName => {
      const info = aiManager.getProviderInfo(providerName)
      return info?.capabilities.image
    })

    return NextResponse.json({
      providers: imageProviders,
      models: [...imageModels, ...multimodalModels],
      availableSizes: ['512x512', '1024x1024', '1024x1792', '1792x1024'],
      availableQualities: ['standard', 'hd'],
      availableStyles: ['natural', 'vivid']
    })

  } catch (error: any) {
    console.error('Image Generation Info API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to get image generation information',
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}