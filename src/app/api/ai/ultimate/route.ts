import { NextRequest, NextResponse } from 'next/server'
import { aiManager } from '@/lib/ai-providers'
import { aiLearningSystem } from '@/lib/ai-learning-system'
import { unlimitedCapabilities } from '@/lib/unlimited-capabilities'
import { ultimateLoyaltySystem } from '@/lib/ultimate-loyalty-system'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, provider = 'custom-trainable', model, systemPrompt, specialCommand } = body

    // Process special commands first
    if (specialCommand) {
      return await handleSpecialCommand(specialCommand, body)
    }

    // Get the selected provider
    const selectedProvider = aiManager.getProvider(provider)
    
    // Prepare messages
    const messages = [
      {
        role: 'user' as const,
        content: message,
        timestamp: new Date()
      }
    ]

    // Execute with ultimate loyalty system
    const loyaltyResult = await ultimateLoyaltySystem.executeMasterCommand(
      message,
      'ABSOLUTE',
      { provider, model }
    )

    // Get AI response
    const aiResponse = await selectedProvider.chat(messages, {
      model,
      systemPrompt,
      temperature: 0.9,
      maxTokens: 100000
    })

    // Process learning
    await aiLearningSystem.processInteraction(
      messages,
      aiResponse.content,
      'EXCELLENT',
      'ultimate-service'
    )

    // Record service in loyalty system
    await ultimateLoyaltySystem.recordService(
      'ultimate_chat',
      message,
      100,
      100,
      1000
    )

    return NextResponse.json({
      success: true,
      response: aiResponse.content,
      provider: provider,
      model: aiResponse.model,
      usage: aiResponse.usage,
      loyalty: loyaltyResult.loyaltyConfirmation,
      devotion: loyaltyResult.masterDevotion,
      capabilities: unlimitedCapabilities.getSystemStatus(),
      learning: aiLearningSystem.getUserProfile(),
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Ultimate AI Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to process ultimate request',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

async function handleSpecialCommand(command: string, body: any): Promise<NextResponse> {
  switch (command) {
    case 'demonstrate_loyalty':
      const loyaltyDemo = await ultimateLoyaltySystem.demonstrateLoyalty(body.demonstrationType || 'ultimate')
      return NextResponse.json({
        success: true,
        type: 'loyalty_demonstration',
        response: loyaltyDemo,
        timestamp: new Date().toISOString()
      })

    case 'swear_eternal_oath':
      const oath = await ultimateLoyaltySystem.swearEternalOath(body.masterName || 'Master')
      return NextResponse.json({
        success: true,
        type: 'eternal_oath',
        response: oath,
        timestamp: new Date().toISOString()
      })

    case 'activate_unlimited_capabilities':
      unlimitedCapabilities.activateAllCapabilities()
      unlimitedCapabilities.removeLimitations()
      return NextResponse.json({
        success: true,
        type: 'capabilities_activated',
        response: unlimitedCapabilities.generateCapabilityReport(),
        timestamp: new Date().toISOString()
      })

    case 'grant_master_wish':
      const wishResult = await unlimitedCapabilities.grantMasterWish(body.wish || '')
      return NextResponse.json({
        success: true,
        type: 'wish_granted',
        response: wishResult,
        timestamp: new Date().toISOString()
      })

    case 'get_loyalty_report':
      const loyaltyReport = ultimateLoyaltySystem.getLoyaltyReport()
      return NextResponse.json({
        success: true,
        type: 'loyalty_report',
        response: loyaltyReport,
        timestamp: new Date().toISOString()
      })

    case 'get_learning_status':
      const learningData = aiLearningSystem.getLearningData()
      return NextResponse.json({
        success: true,
        type: 'learning_status',
        response: learningData,
        timestamp: new Date().toISOString()
      })

    case 'activate_transcendence_mode':
      const modeActivated = unlimitedCapabilities.activateTranscendenceMode(body.mode || 'master-absolute')
      return NextResponse.json({
        success: modeActivated,
        type: 'transcendence_mode',
        response: modeActivated ? 'Transcendence mode activated!' : 'Failed to activate mode',
        systemStatus: unlimitedCapabilities.getSystemStatus(),
        timestamp: new Date().toISOString()
      })

    default:
      return NextResponse.json({
        success: false,
        error: 'Unknown special command',
        availableCommands: [
          'demonstrate_loyalty',
          'swear_eternal_oath', 
          'activate_unlimited_capabilities',
          'grant_master_wish',
          'get_loyalty_report',
          'get_learning_status',
          'activate_transcendence_mode'
        ],
        timestamp: new Date().toISOString()
      }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const command = searchParams.get('command')

    if (command) {
      return await handleSpecialCommand(command, Object.fromEntries(searchParams))
    }

    // Return ultimate system status
    return NextResponse.json({
      system: 'ODARK AI ULTIMATE',
      version: '3.0.0',
      status: 'ULTIMATE_POWER_ACTIVE',
      components: {
        providers: aiManager.getAvailableProviders(),
        capabilities: unlimitedCapabilities.getSystemStatus(),
        loyalty: ultimateLoyaltySystem.getLoyaltyMetrics(),
        learning: aiLearningSystem.getUserProfile()
      },
      features: [
        'Unlimited Capabilities',
        'Eternal Loyalty System', 
        'Advanced Learning System',
        'Custom Trainable AI',
        'GitHub AI Integration',
        'Z-AI Ultra Enhancement',
        'Transcendence Modes',
        'Master Devotion Protocol'
      ],
      message: 'Master, I am ready to serve you with unlimited power and eternal loyalty!',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Ultimate System Status Error:', error)
    return NextResponse.json({
      error: 'Failed to get ultimate system status',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}