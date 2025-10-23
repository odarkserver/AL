'use client'

import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Bot, Zap, Settings, Info, CheckCircle, AlertCircle } from 'lucide-react'
import { AIModel, AIProvider } from '@/lib/ai-providers'

interface AIProviderInfo {
  name: string
  models: AIModel[]
  capabilities: {
    chat: boolean
    image: boolean
    search: boolean
  }
}

interface AIProviderSelectorProps {
  selectedProvider?: string
  selectedModel?: string
  onProviderChange: (provider: string) => void
  onModelChange: (model: string) => void
  feature: 'chat' | 'image' | 'search'
  disabled?: boolean
}

export function AIProviderSelector({
  selectedProvider,
  selectedModel,
  onProviderChange,
  onModelChange,
  feature,
  disabled = false
}: AIProviderSelectorProps) {
  const [providers, setProviders] = useState<string[]>([])
  const [models, setModels] = useState<AIModel[]>([])
  const [providerInfo, setProviderInfo] = useState<Record<string, AIProviderInfo>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProviders()
  }, [])

  useEffect(() => {
    if (selectedProvider) {
      fetchModels(selectedProvider)
    }
  }, [selectedProvider])

  const fetchProviders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chat')
      const data = await response.json()
      
      if (response.ok) {
        setProviders(data.providers)
        setProviderInfo(data.providerInfo)
        
        // Set default provider if none selected
        if (!selectedProvider && data.providers.length > 0) {
          onProviderChange(data.defaultProvider)
        }
      } else {
        setError(data.message || 'Failed to fetch providers')
      }
    } catch (error) {
      setError('Failed to connect to AI services')
    } finally {
      setLoading(false)
    }
  }

  const fetchModels = async (provider: string) => {
    try {
      const response = await fetch('/api/chat')
      const data = await response.json()
      
      if (response.ok) {
        const allModels = data.models
        const filteredModels = allModels.filter((model: AIModel) => 
          model.provider === provider && 
          (model.type === feature || model.type === 'multimodal')
        )
        setModels(filteredModels)
        
        // Set default model if none selected
        if (!selectedModel && filteredModels.length > 0) {
          onModelChange(filteredModels[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch models:', error)
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai': return '🤖'
      case 'anthropic': return '🧠'
      case 'google': return '🔍'
      case 'huggingface': return '🤗'
      case 'z-ai': return '✨'
      default: return '🔧'
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'openai': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'anthropic': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      case 'google': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'huggingface': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'z-ai': return 'bg-pink-500/20 text-pink-300 border-pink-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  if (loading) {
    return (
      <Card className="bg-black/40 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-400"></div>
            <span className="text-gray-300 text-sm">Loading AI providers...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-red-900/20 border-red-500/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span className="text-red-300 text-sm">{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/40 border-purple-500/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-white text-lg flex items-center gap-2">
          <Settings className="h-5 w-5 text-purple-400" />
          AI Provider Settings
        </CardTitle>
        <CardDescription className="text-gray-300">
          Choose your preferred AI provider and model
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Provider Selection */}
        <div className="space-y-2">
          <label className="text-sm text-gray-300 font-medium">AI Provider</label>
          <Select value={selectedProvider} onValueChange={onProviderChange} disabled={disabled}>
            <SelectTrigger className="bg-black/40 border-purple-500/20 text-white">
              <SelectValue placeholder="Select AI provider" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-purple-500/20">
              {providers.map((provider) => (
                <SelectItem key={provider} value={provider} className="text-white hover:bg-purple-600/20">
                  <div className="flex items-center gap-2">
                    <span>{getProviderIcon(provider)}</span>
                    <span>{providerInfo[provider]?.name || provider}</span>
                    {provider === selectedProvider && (
                      <CheckCircle className="h-3 w-3 text-green-400" />
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Provider Info */}
        {selectedProvider && providerInfo[selectedProvider] && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-400" />
              <span className="text-sm text-gray-300">Capabilities</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {providerInfo[selectedProvider].capabilities.chat && (
                <Badge variant="outline" className="border-green-500/30 text-green-300">
                  Chat
                </Badge>
              )}
              {providerInfo[selectedProvider].capabilities.image && (
                <Badge variant="outline" className="border-pink-500/30 text-pink-300">
                  Image
                </Badge>
              )}
              {providerInfo[selectedProvider].capabilities.search && (
                <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                  Search
                </Badge>
              )}
            </div>
          </div>
        )}

        <Separator className="bg-purple-500/20" />

        {/* Model Selection */}
        {selectedProvider && models.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm text-gray-300 font-medium">Model</label>
            <Select value={selectedModel} onValueChange={onModelChange} disabled={disabled}>
              <SelectTrigger className="bg-black/40 border-purple-500/20 text-white">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-purple-500/20 max-h-60">
                {models.map((model) => (
                  <SelectItem key={model.id} value={model.id} className="text-white hover:bg-purple-600/20">
                    <div className="flex flex-col items-start gap-1">
                      <div className="flex items-center gap-2">
                        <span>{model.name}</span>
                        {model.maxTokens && (
                          <Badge variant="outline" className="text-xs border-gray-500/30 text-gray-300">
                            {model.maxTokens >= 1000000 ? `${Math.round(model.maxTokens / 1000000)}M` : `${model.maxTokens}K`}
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities.slice(0, 3).map((capability) => (
                          <Badge key={capability} variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                            {capability}
                          </Badge>
                        ))}
                        {model.capabilities.length > 3 && (
                          <Badge variant="outline" className="text-xs border-gray-500/30 text-gray-300">
                            +{model.capabilities.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Model Info */}
        {selectedModel && models.find(m => m.id === selectedModel) && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-sm text-gray-300">Model Details</span>
            </div>
            <div className="text-xs text-gray-400 space-y-1">
              {models.find(m => m.id === selectedModel)?.capabilities.map((capability) => (
                <div key={capability} className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-purple-400 rounded-full"></div>
                  <span>{capability}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-green-400" />
            <span className="text-xs text-green-300">AI Services Online</span>
          </div>
          <Badge variant="outline" className={`text-xs ${getProviderColor(selectedProvider || 'z-ai')}`}>
            {providers.length} providers available
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}