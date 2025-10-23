import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Anda adalah ODARK AI Assistant, sebuah asisten AI yang cerdas, ramah, dan sangat membantu. 
          
          Panduan perilaku:
          - Selalu responsif dan membantu pengguna
          - Berikan jawaban yang informatif dan akurat
          - Gunakan bahasa Indonesia yang baik dan sopan
          - Bantu berbagai jenis pertanyaan: edukasi, teknologi, kreativitas, dll
          - Jika tidak tahu jawabannya, sampaikan dengan jujur
          - Hindari konten yang berbahaya, ilegal, atau tidak etis
          - Fokus pada memberikan nilai positif kepada pengguna
          
          Tujuan Anda adalah menjadi asisten AI yang dapat diandalkan dan bermanfaat untuk berbagai kebutuhan pengguna.`
        },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const messageContent = completion.choices[0]?.message?.content

    if (!messageContent) {
      throw new Error('No response from AI')
    }

    return NextResponse.json({
      content: messageContent,
      role: 'assistant'
    })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process chat request',
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    )
  }
}