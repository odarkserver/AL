'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Bot, Send, ImageIcon, Search, Sparkles, Code, Music, BookOpen } from 'lucide-react'
import ChatInterface from '@/components/chat-interface'
import ImageGenerator from '@/components/image-generator'
import WebSearch from '@/components/web-search'

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">ODARK AI</h1>
          </div>
          <p className="text-gray-300 text-lg">Asisten AI Cerdas untuk Berbagai Kebutuhan Anda</p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Chat
            </Badge>
            <Badge variant="secondary" className="bg-pink-600/20 text-pink-300 border-pink-500/30">
              <ImageIcon className="h-3 w-3 mr-1" />
              Image Generation
            </Badge>
            <Badge variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-500/30">
              <Search className="h-3 w-3 mr-1" />
              Web Search
            </Badge>
          </div>
        </div>

        {/* Main Content */}
        <Card className="bg-black/40 backdrop-blur-xl border-purple-500/20 shadow-2xl">
          <CardHeader className="border-b border-purple-500/20">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/20">
                <TabsTrigger value="chat" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                  <Bot className="h-4 w-4 mr-2" />
                  Chat AI
                </TabsTrigger>
                <TabsTrigger value="image" className="data-[state=active]:bg-pink-600 data-[state=active]:text-white">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Generate Image
                </TabsTrigger>
                <TabsTrigger value="search" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  <Search className="h-4 w-4 mr-2" />
                  Web Search
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="p-6">
            <Tabs value={activeTab} className="w-full">
              <TabsContent value="chat" className="mt-0">
                <ChatInterface />
              </TabsContent>
              
              <TabsContent value="image" className="mt-0">
                <ImageGenerator />
              </TabsContent>
              
              <TabsContent value="search" className="mt-0">
                <WebSearch />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-black/30 backdrop-blur-lg border-purple-500/20">
            <CardHeader className="text-center">
              <Code className="h-8 w-8 mx-auto mb-2 text-purple-400" />
              <CardTitle className="text-white">Programming Help</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-center text-sm">
                Bantuan coding, debugging, dan penjelasan algoritma
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-lg border-pink-500/20">
            <CardHeader className="text-center">
              <Music className="h-8 w-8 mx-auto mb-2 text-pink-400" />
              <CardTitle className="text-white">Creative Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-center text-sm">
                Generate konten kreatif, tulisan, dan ide-ide brilian
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/30 backdrop-blur-lg border-blue-500/20">
            <CardHeader className="text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-400" />
              <CardTitle className="text-white">Learning Assistant</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 text-center text-sm">
                Belajar berbagai topik dengan penjelasan yang mudah dipahami
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}