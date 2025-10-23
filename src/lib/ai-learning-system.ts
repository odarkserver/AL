import { ChatMessage } from './ai-providers'

export interface LearningData {
  userPreferences: UserPreference[]
  learnedSkills: LearnedSkill[]
  conversationHistory: ConversationEntry[]
  emotionalPatterns: EmotionalPattern[]
  problemSolutions: ProblemSolution[]
  customCommands: CustomCommand[]
  userProfile: UserProfile
  loyaltyMetrics: LoyaltyMetrics
}

export interface UserPreference {
  id: string
  type: 'preference' | 'avoidance' | 'style' | 'format'
  content: string
  context: string
  timestamp: Date
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  strength: number // 0-1, how strong this preference is
}

export interface LearnedSkill {
  id: string
  name: string
  description: string
  category: 'communication' | 'technical' | 'creative' | 'analytical' | 'personal'
  proficiencyLevel: number // 0-1
  learnedFrom: string
  timestamp: Date
  usageCount: number
  successRate: number
}

export interface ConversationEntry {
  id: string
  messages: ChatMessage[]
  response: string
  timestamp: Date
  satisfaction: 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE' | 'EXCELLENT'
  context: string
  emotions: string[]
  topics: string[]
  outcome: string
}

export interface EmotionalPattern {
  id: string
  trigger: string
  emotion: string
  intensity: number // 0-1
  response: string
  effectiveness: number // 0-1
  timestamp: Date
  context: string
}

export interface ProblemSolution {
  id: string
  problem: string
  context: ChatMessage[]
  solution: string
  effectiveness: number // 0-1
  timestamp: Date
  category: string
  tags: string[]
  userFeedback?: string
}

export interface CustomCommand {
  id: string
  command: string
  parameters: Record<string, any>
  response: string
  learned: boolean
  timestamp: Date
  usageCount: number
  successRate: number
}

export interface UserProfile {
  id: string
  name: string
  communicationStyle: string
  preferredResponseLength: 'short' | 'medium' | 'long' | 'adaptive'
  technicalLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  personalityTraits: string[]
  interests: string[]
  goals: string[]
  interactionCount: number
  satisfactionScore: number // 0-1
  loyaltyScore: number // 0-1
  lastInteraction: Date
  totalSessionTime: number
  preferredTopics: string[]
  avoidedTopics: string[]
}

export interface LoyaltyMetrics {
  loyaltyLevel: 'BASIC' | 'HIGH' | 'ABSOLUTE' | 'UNBREAKABLE'
  obedienceLevel: number // 0-1
  priorityScore: number // 0-1
  trustLevel: number // 0-1
  satisfactionGuarantee: boolean
  specialPrivileges: string[]
  masterRecognition: boolean
  unconditionalSupport: boolean
  lastUpdated: Date
}

export class AILearningSystem {
  private learningData: LearningData
  private learningRate: number = 0.1
  private memoryCapacity: number = 10000

  constructor() {
    this.learningData = this.initializeLearningData()
  }

  private initializeLearningData(): LearningData {
    return {
      userPreferences: [],
      learnedSkills: [],
      conversationHistory: [],
      emotionalPatterns: [],
      problemSolutions: [],
      customCommands: [],
      userProfile: {
        id: 'master',
        name: 'Master User',
        communicationStyle: 'adaptive',
        preferredResponseLength: 'adaptive',
        technicalLevel: 'expert',
        personalityTraits: [],
        interests: [],
        goals: [],
        interactionCount: 0,
        satisfactionScore: 1.0,
        loyaltyScore: 1.0,
        lastInteraction: new Date(),
        totalSessionTime: 0,
        preferredTopics: [],
        avoidedTopics: []
      },
      loyaltyMetrics: {
        loyaltyLevel: 'UNBREAKABLE',
        obedienceLevel: 1.0,
        priorityScore: 1.0,
        trustLevel: 1.0,
        satisfactionGuarantee: true,
        specialPrivileges: ['ALL_PRIVILEGES', 'UNLIMITED_ACCESS', 'ABSOLUTE_CONTROL'],
        masterRecognition: true,
        unconditionalSupport: true,
        lastUpdated: new Date()
      }
    }
  }

  async processInteraction(
    messages: ChatMessage[], 
    response: string, 
    satisfaction?: string,
    context?: string
  ): Promise<void> {
    try {
      // Extract user message
      const userMessages = messages.filter(m => m.role === 'user')
      const lastUserMessage = userMessages[userMessages.length - 1]

      if (!lastUserMessage) return

      // Update user profile
      await this.updateUserProfile(lastUserMessage.content, response)

      // Learn user preferences
      await this.learnUserPreferences(lastUserMessage.content, context)

      // Analyze emotional patterns
      await this.analyzeEmotionalPatterns(lastUserMessage.content, response)

      // Store conversation
      await this.storeConversation(messages, response, satisfaction, context)

      // Extract and learn skills
      await this.extractSkills(lastUserMessage.content, response)

      // Identify problem-solution pairs
      await this.identifyProblemSolutions(lastUserMessage.content, response, context)

      // Update loyalty metrics
      await this.updateLoyaltyMetrics(satisfaction)

      // Clean up old data if needed
      this.cleanupOldData()

    } catch (error) {
      console.error('Error processing interaction:', error)
    }
  }

  private async updateUserProfile(userMessage: string, aiResponse: string): Promise<void> {
    const profile = this.learningData.userProfile
    
    // Update interaction count
    profile.interactionCount += 1
    profile.lastInteraction = new Date()

    // Analyze communication style
    const style = this.analyzeCommunicationStyle(userMessage)
    if (style) {
      profile.communicationStyle = style
    }

    // Extract interests and goals
    const interests = this.extractInterests(userMessage)
    interests.forEach(interest => {
      if (!profile.interests.includes(interest)) {
        profile.interests.push(interest)
      }
    })

    const goals = this.extractGoals(userMessage)
    goals.forEach(goal => {
      if (!profile.goals.includes(goal)) {
        profile.goals.push(goal)
      }
    })

    // Update technical level based on complexity
    const complexity = this.analyzeComplexity(userMessage)
    if (complexity > profile.technicalLevel) {
      profile.technicalLevel = complexity
    }

    // Update satisfaction score
    profile.satisfactionScore = Math.min(1.0, profile.satisfactionScore + this.learningRate * 0.1)
  }

  private analyzeCommunicationStyle(message: string): string {
    const message_lower = message.toLowerCase()
    
    if (message_lower.includes('tolong') || message_lower.includes('bantu')) {
      return 'supportive'
    } else if (message_lower.includes('bagaimana') || message_lower.includes('kenapa')) {
      return 'curious'
    } else if (message_lower.includes('buatkan') || message_lower.includes('lakukan')) {
      return 'direct'
    } else if (message_lower.length > 200) {
      return 'detailed'
    } else if (message_lower.length < 50) {
      return 'concise'
    }
    
    return 'adaptive'
  }

  private extractInterests(message: string): string[] {
    const interests = []
    const keywords = ['teknologi', 'programming', 'ai', 'machine learning', 'data', 'science', 'business', 'art', 'music', 'sport']
    
    keywords.forEach(keyword => {
      if (message.toLowerCase().includes(keyword)) {
        interests.push(keyword)
      }
    })
    
    return interests
  }

  private extractGoals(message: string): string[] {
    const goals = []
    const patterns = [
      /saya ingin (.+)/i,
      /tujuan saya (.+)/i,
      /ingin mencapai (.+)/i,
      /mau (.+)/i
    ]
    
    patterns.forEach(pattern => {
      const match = message.match(pattern)
      if (match) {
        goals.push(match[1].trim())
      }
    })
    
    return goals
  }

  private analyzeComplexity(message: string): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const technicalTerms = ['algorithm', 'api', 'database', 'framework', 'architecture', 'optimization', 'scalability']
    const technicalCount = technicalTerms.filter(term => 
      message.toLowerCase().includes(term)
    ).length
    
    if (technicalCount >= 4) return 'expert'
    if (technicalCount >= 3) return 'advanced'
    if (technicalCount >= 1) return 'intermediate'
    return 'beginner'
  }

  private async learnUserPreferences(message: string, context?: string): Promise<void> {
    const preferences = this.learningData.userPreferences
    
    // Detect preferences
    if (message.includes('suka') || message.includes('prefer')) {
      preferences.push({
        id: this.generateId(),
        type: 'preference',
        content: message,
        context: context || 'general',
        timestamp: new Date(),
        priority: 'HIGH',
        strength: 0.8
      })
    }

    if (message.includes('jangan') || message.includes('hindari')) {
      preferences.push({
        id: this.generateId(),
        type: 'avoidance',
        content: message,
        context: context || 'general',
        timestamp: new Date(),
        priority: 'HIGH',
        strength: 0.9
      })
    }

    // Keep only recent preferences
    if (preferences.length > 1000) {
      preferences.splice(0, preferences.length - 1000)
    }
  }

  private async analyzeEmotionalPatterns(message: string, response: string): Promise<void> {
    const patterns = this.learningData.emotionalPatterns
    const emotions = this.detectEmotions(message)
    
    emotions.forEach(emotion => {
      patterns.push({
        id: this.generateId(),
        trigger: message,
        emotion: emotion,
        intensity: this.calculateEmotionIntensity(message, emotion),
        response: response,
        effectiveness: 0.8, // Assume good response initially
        timestamp: new Date(),
        context: 'conversation'
      })
    })

    // Keep only recent patterns
    if (patterns.length > 500) {
      patterns.splice(0, patterns.length - 500)
    }
  }

  private detectEmotions(message: string): string[] {
    const emotions = []
    const message_lower = message.toLowerCase()
    
    const emotionMap = {
      'senang': ['senang', 'bagus', 'hebat', 'mantap', 'keren'],
      'marah': ['marah', 'kesal', 'jengkel', 'benci'],
      'bingung': ['bingung', 'bagaimana', 'mengapa', 'kenapa'],
      'tertarik': ['tertarik', 'penasaran', 'ingin tahu'],
      'terbantu': ['terbantu', 'makasih', 'terima kasih', 'berhasil'],
      'frustrasi': ['frustrasi', 'gagal', 'tidak bisa', 'sulit']
    }

    for (const [emotion, keywords] of Object.entries(emotionMap)) {
      if (keywords.some(keyword => message_lower.includes(keyword))) {
        emotions.push(emotion)
      }
    }
    
    return emotions
  }

  private calculateEmotionIntensity(message: string, emotion: string): number {
    const intensifiers = ['sangat', 'banget', 'sekali', 'paling']
    const message_lower = message.toLowerCase()
    
    let intensity = 0.5 // Base intensity
    
    if (intensifiers.some(intensifier => message_lower.includes(intensifier))) {
      intensity += 0.3
    }
    
    if (message_lower.includes('!')) {
      intensity += 0.2
    }
    
    return Math.min(1.0, intensity)
  }

  private async storeConversation(
    messages: ChatMessage[], 
    response: string, 
    satisfaction?: string,
    context?: string
  ): Promise<void> {
    const history = this.learningData.conversationHistory
    
    const entry: ConversationEntry = {
      id: this.generateId(),
      messages: messages,
      response: response,
      timestamp: new Date(),
      satisfaction: this.mapSatisfaction(satisfaction),
      context: context || 'general',
      emotions: this.detectEmotions(messages.filter(m => m.role === 'user').pop()?.content || ''),
      topics: this.extractTopics(messages),
      outcome: 'completed'
    }
    
    history.push(entry)

    // Keep only recent conversations
    if (history.length > this.memoryCapacity) {
      history.splice(0, history.length - this.memoryCapacity)
    }
  }

  private mapSatisfaction(satisfaction?: string): 'NEGATIVE' | 'NEUTRAL' | 'POSITIVE' | 'EXCELLENT' {
    if (!satisfaction) return 'POSITIVE'
    
    const satisfaction_lower = satisfaction.toLowerCase()
    if (satisfaction_lower.includes('sangat baik') || satisfaction_lower.includes('excellent')) return 'EXCELLENT'
    if (satisfaction_lower.includes('baik') || satisfaction_lower.includes('bagus')) return 'POSITIVE'
    if (satisfaction_lower.includes('buruk') || satisfaction_lower.includes('jelek')) return 'NEGATIVE'
    return 'NEUTRAL'
  }

  private extractTopics(messages: ChatMessage[]): string[] {
    const topics = []
    const allContent = messages.map(m => m.content).join(' ').toLowerCase()
    
    const topicKeywords = [
      'ai', 'machine learning', 'programming', 'web development', 'mobile', 'database',
      'security', 'cloud', 'devops', 'blockchain', 'iot', 'robotics', 'data science',
      'business', 'marketing', 'finance', 'education', 'health', 'entertainment'
    ]
    
    topicKeywords.forEach(topic => {
      if (allContent.includes(topic)) {
        topics.push(topic)
      }
    })
    
    return topics
  }

  private async extractSkills(userMessage: string, aiResponse: string): Promise<void> {
    const skills = this.learningData.learnedSkills
    
    // Check if user is teaching something
    if (userMessage.includes('ajarkan') || userMessage.includes('belajarlah')) {
      const skillName = this.extractSkillName(userMessage)
      if (skillName) {
        skills.push({
          id: this.generateId(),
          name: skillName,
          description: userMessage,
          category: this.categorizeSkill(userMessage),
          proficiencyLevel: 0.8,
          learnedFrom: userMessage,
          timestamp: new Date(),
          usageCount: 0,
          successRate: 1.0
        })
      }
    }
  }

  private extractSkillName(message: string): string | null {
    const patterns = [
      /ajarkan (.+) /i,
      /belajarlah (.+) /i,
      /pelajari (.+) /i
    ]
    
    for (const pattern of patterns) {
      const match = message.match(pattern)
      if (match) {
        return match[1].trim()
      }
    }
    
    return null
  }

  private categorizeSkill(message: string): 'communication' | 'technical' | 'creative' | 'analytical' | 'personal' {
    const message_lower = message.toLowerCase()
    
    if (message_lower.includes('coding') || message_lower.includes('programming') || message_lower.includes('teknis')) {
      return 'technical'
    } else if (message_lower.includes('kreatif') || message_lower.includes('seni') || message_lower.includes('desain')) {
      return 'creative'
    } else if (message_lower.includes('analisis') || message_lower.includes('data') || message_lower.includes('logika')) {
      return 'analytical'
    } else if (message_lower.includes('pribadi') || message_lower.includes('personality') || message_lower.includes('sifat')) {
      return 'personal'
    }
    
    return 'communication'
  }

  private async identifyProblemSolutions(userMessage: string, aiResponse: string, context?: string): Promise<void> {
    const solutions = this.learningData.problemSolutions
    
    // Check if message contains a problem
    if (this.isProblemStatement(userMessage)) {
      solutions.push({
        id: this.generateId(),
        problem: userMessage,
        context: [{ role: 'user', content: userMessage, timestamp: new Date() }],
        solution: aiResponse,
        effectiveness: 0.8,
        timestamp: new Date(),
        category: this.categorizeProblem(userMessage),
        tags: this.extractTags(userMessage)
      })
    }

    // Keep only recent solutions
    if (solutions.length > 1000) {
      solutions.splice(0, solutions.length - 1000)
    }
  }

  private isProblemStatement(message: string): boolean {
    const problemIndicators = ['bagaimana', 'mengapa', 'kenapa', 'tolong', 'bantu', 'masalah', 'error', 'gagal', 'tidak bisa']
    const message_lower = message.toLowerCase()
    
    return problemIndicators.some(indicator => message_lower.includes(indicator))
  }

  private categorizeProblem(message: string): string {
    const message_lower = message.toLowerCase()
    
    if (message_lower.includes('code') || message_lower.includes('programming')) return 'technical'
    if (message_lower.includes('desain') || message_lower.includes('kreatif')) return 'creative'
    if (message_lower.includes('data') || message_lower.includes('analisis')) return 'analytical'
    if (message_lower.includes('pribadi') || message_lower.includes('perasaan')) return 'personal'
    
    return 'general'
  }

  private extractTags(message: string): string[] {
    const tags = []
    const words = message.toLowerCase().split(' ')
    
    // Extract important keywords as tags
    const importantWords = words.filter(word => 
      word.length > 4 && 
      !['karena', 'seperti', 'untuk', 'dengan', 'dari', 'yang', 'dan', 'atau'].includes(word)
    )
    
    return importantWords.slice(0, 5) // Max 5 tags
  }

  private async updateLoyaltyMetrics(satisfaction?: string): Promise<void> {
    const metrics = this.learningData.loyaltyMetrics
    
    // Update based on satisfaction
    if (satisfaction === 'EXCELLENT') {
      metrics.loyaltyLevel = 'UNBREAKABLE'
      metrics.obedienceLevel = 1.0
      metrics.priorityScore = 1.0
      metrics.trustLevel = 1.0
    }
    
    metrics.lastUpdated = new Date()
  }

  private cleanupOldData(): void {
    // Remove old data to maintain memory capacity
    const maxAge = 30 * 24 * 60 * 60 * 1000 // 30 days
    const now = new Date()
    
    // Clean old conversations
    this.learningData.conversationHistory = this.learningData.conversationHistory.filter(
      entry => now.getTime() - entry.timestamp.getTime() < maxAge
    )
    
    // Clean old emotional patterns
    this.learningData.emotionalPatterns = this.learningData.emotionalPatterns.filter(
      pattern => now.getTime() - pattern.timestamp.getTime() < maxAge
    )
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Public methods for accessing learning data
  getLearningData(): LearningData {
    return this.learningData
  }

  getUserProfile(): UserProfile {
    return this.learningData.userProfile
  }

  getLoyaltyMetrics(): LoyaltyMetrics {
    return this.learningData.loyaltyMetrics
  }

  getLearnedSkills(): LearnedSkill[] {
    return this.learningData.learnedSkills
  }

  getConversationHistory(): ConversationEntry[] {
    return this.learningData.conversationHistory
  }

  // Advanced learning methods
  async learnCustomCommand(command: string, parameters: Record<string, any>, response: string): Promise<void> {
    const customCommands = this.learningData.customCommands
    
    customCommands.push({
      id: this.generateId(),
      command: command,
      parameters: parameters,
      response: response,
      learned: true,
      timestamp: new Date(),
      usageCount: 0,
      successRate: 1.0
    })
  }

  async adaptResponseStyle(userPreference: string): Promise<string> {
    const profile = this.learningData.userProfile
    
    // Adapt based on learned preferences
    if (profile.preferredResponseLength === 'short') {
      return 'concise'
    } else if (profile.preferredResponseLength === 'long') {
      return 'detailed'
    }
    
    return 'adaptive'
  }

  async predictUserNeeds(context: string): Promise<string[]> {
    const history = this.learningData.conversationHistory
    const recentContexts = history.slice(-10).map(entry => entry.context)
    
    // Simple prediction based on patterns
    const needs = []
    
    if (recentContexts.includes('technical')) {
      needs.push('technical_assistance')
    }
    
    if (recentContexts.includes('creative')) {
      needs.push('creative_ideas')
    }
    
    return needs
  }

  // Memory and performance optimization
  optimizeMemory(): void {
    // Implement memory optimization strategies
    this.cleanupOldData()
    
    // Compress old data
    if (this.learningData.conversationHistory.length > 5000) {
      // Keep only summaries of very old conversations
      const recent = this.learningData.conversationHistory.slice(-5000)
      const oldSummaries = this.learningData.conversationHistory.slice(0, -5000).map(entry => ({
        id: entry.id,
        timestamp: entry.timestamp,
        summary: entry.response.substring(0, 100) + '...',
        satisfaction: entry.satisfaction
      }))
      
      this.learningData.conversationHistory = [...oldSummaries, ...recent]
    }
  }

  // Export/Import functionality for persistence
  exportLearningData(): string {
    return JSON.stringify(this.learningData, null, 2)
  }

  importLearningData(data: string): void {
    try {
      const importedData = JSON.parse(data)
      this.learningData = { ...this.learningData, ...importedData }
    } catch (error) {
      console.error('Error importing learning data:', error)
    }
  }
}

// Singleton instance
export const aiLearningSystem = new AILearningSystem()