'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ExternalLink, Search, Loader2, Globe, Calendar, Star } from 'lucide-react'

interface SearchResult {
  url: string
  name: string
  snippet: string
  host_name: string
  rank: number
  date: string
  favicon: string
}

export default function WebSearch() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])

  const handleSearch = async () => {
    if (!query.trim() || isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch('/api/web-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          num: 10
        })
      })

      if (!response.ok) {
        throw new Error('Failed to perform search')
      }

      const data = await response.json()
      setSearchResults(data.results || [])

      // Add to search history
      if (!searchHistory.includes(query.trim())) {
        setSearchHistory(prev => [query.trim(), ...prev.slice(0, 4)])
      }

    } catch (error) {
      console.error('Error searching:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <Card className="bg-black/40 border-purple-500/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-400" />
            Web Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search the web for information..."
              className="flex-1 bg-black/40 border-purple-500/20 text-white placeholder:text-gray-400 focus:border-purple-500"
              disabled={isLoading}
            />
            <Button
              onClick={handleSearch}
              disabled={!query.trim() || isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-400">Recent searches:</p>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="border-purple-500/30 text-purple-300 cursor-pointer hover:bg-purple-500/10"
                    onClick={() => setQuery(term)}
                  >
                    {term}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="border-blue-500/30 text-blue-300">
              Real-time Search
            </Badge>
            <Badge variant="outline" className="border-purple-500/30 text-purple-300">
              AI Enhanced
            </Badge>
            <Badge variant="outline" className="border-green-500/30 text-green-300">
              Multiple Sources
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-semibold">
              Search Results ({searchResults.length})
            </h3>
            <Badge variant="outline" className="border-blue-500/30 text-blue-300">
              Ranked by relevance
            </Badge>
          </div>

          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {searchResults.map((result, index) => (
                <Card key={index} className="bg-black/40 border-purple-500/20 hover:bg-black/60 transition-colors">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          {result.favicon && (
                            <img
                              src={result.favicon}
                              alt=""
                              className="h-4 w-4 flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="text-white font-medium text-sm hover:text-purple-400 transition-colors cursor-pointer truncate">
                              <a
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                {result.name}
                                <ExternalLink className="h-3 w-3 flex-shrink-0" />
                              </a>
                            </h4>
                            <p className="text-green-400 text-xs truncate">
                              {result.host_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant="outline" className="text-xs border-purple-500/30 text-purple-300">
                            #{result.rank}
                          </Badge>
                          {result.date && (
                            <div className="flex items-center gap-1 text-gray-400">
                              <Calendar className="h-3 w-3" />
                              <span className="text-xs">
                                {formatDate(result.date)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Snippet */}
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {result.snippet}
                      </p>

                      {/* URL */}
                      <div className="flex items-center justify-between">
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 text-xs hover:text-blue-300 transition-colors truncate flex-1"
                        >
                          {result.url}
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-6 px-2 hover:bg-white/10"
                        >
                          <a
                            href={result.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white"
                          >
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {searchResults.length === 0 && query && !isLoading && (
        <Card className="bg-black/20 border-purple-500/10">
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300">
              No results found for "{query}". Try different keywords.
            </p>
          </CardContent>
        </Card>
      )}

      {!query && (
        <Card className="bg-black/20 border-purple-500/10">
          <CardContent className="p-8 text-center">
            <Globe className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300 mb-2">
              Search the web for any information
            </p>
            <p className="text-gray-400 text-sm">
              Enter keywords above to get real-time search results from multiple sources
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}