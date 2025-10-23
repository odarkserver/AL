import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, size = '1024x1024' } = body

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    // Validate size
    const validSizes = ['512x512', '1024x1024', '1024x1792', '1792x1024']
    if (!validSizes.includes(size)) {
      return NextResponse.json(
        { error: 'Invalid size. Valid sizes: 512x512, 1024x1024, 1024x1792, 1792x1024' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const response = await zai.images.generations.create({
      prompt: prompt,
      size: size
    })

    const imageBase64 = response.data[0]?.base64

    if (!imageBase64) {
      throw new Error('No image data received')
    }

    return NextResponse.json({
      imageData: imageBase64,
      prompt: prompt,
      size: size
    })

  } catch (error: any) {
    console.error('Image Generation API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate image',
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}