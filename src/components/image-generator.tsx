'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Image as ImageIcon, Download, Loader2, Sparkles } from 'lucide-react'

interface GeneratedImage {
  id: string
  prompt: string
  imageData: string
  timestamp: Date
}

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('')
  const [size, setSize] = useState('1024x1024')
  const [isLoading, setIsLoading] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([])

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt.trim(),
          size
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate image')
      }

      const data = await response.json()

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        prompt: prompt.trim(),
        imageData: data.imageData,
        timestamp: new Date()
      }

      setGeneratedImages(prev => [newImage, ...prev])
      setPrompt('')

    } catch (error) {
      console.error('Error generating image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = (imageData: string, prompt: string) => {
    const link = document.createElement('a')
    link.href = `data:image/png;base64,${imageData}`
    link.download = `odark-ai-${prompt.slice(0, 20).replace(/[^a-zA-Z0-9]/g, '-')}.png`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Generator Form */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-pink-400" />
            Generate AI Image
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">
              Describe the image you want to create
            </label>
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful sunset over mountains, digital art style..."
              className="bg-black/40 border-purple-500/20 text-white placeholder:text-gray-400 focus:border-purple-500"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-300 mb-2 block">
                Image Size
              </label>
              <Select value={size} onValueChange={setSize} disabled={isLoading}>
                <SelectTrigger className="bg-black/40 border-purple-500/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-500/20">
                  <SelectItem value="512x512">512x512</SelectItem>
                  <SelectItem value="1024x1024">1024x1024</SelectItem>
                  <SelectItem value="1024x1792">1024x1792 (Portrait)</SelectItem>
                  <SelectItem value="1792x1024">1792x1024 (Landscape)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleGenerate}
                disabled={!prompt.trim() || isLoading}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-pink-500/30 text-pink-300">
              AI Powered
            </Badge>
            <Badge variant="outline" className="border-purple-500/30 text-purple-300">
              High Quality
            </Badge>
            <Badge variant="outline" className="border-blue-500/30 text-blue-300">
              Fast Generation
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Generated Images */}
      {generatedImages.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-white font-semibold">Generated Images</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedImages.map((image) => (
              <Card key={image.id} className="bg-black/40 border-purple-500/20 overflow-hidden">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="relative group">
                      <img
                        src={`data:image/png;base64,${image.imageData}`}
                        alt={image.prompt}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button
                          onClick={() => handleDownload(image.imageData, image.prompt)}
                          variant="secondary"
                          size="sm"
                          className="bg-white/20 hover:bg-white/30 text-white"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium mb-1">{image.prompt}</p>
                      <p className="text-gray-400 text-xs">
                        {image.timestamp.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {generatedImages.length === 0 && (
        <Card className="bg-black/20 border-purple-500/10">
          <CardContent className="p-8 text-center">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300">
              No images generated yet. Create your first AI image above!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}