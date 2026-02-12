'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type SearchBarProps = {
  className?: string
}

export function SearchBar({ className }: SearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('relative flex items-center', className)}>
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="講座や動画を検索..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-9 w-full pl-9 pr-20 md:w-64 lg:w-72"
        />
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="absolute right-1 top-1/2 h-7 -translate-y-1/2 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          検索
        </Button>
      </div>
    </form>
  )
}
