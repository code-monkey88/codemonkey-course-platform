import { extractYouTubeId } from '@/lib/utils'
import { VideoOff } from 'lucide-react'

type VideoPlayerProps = {
  youtubeUrl: string
  title?: string
}

export function VideoPlayer({ youtubeUrl, title }: VideoPlayerProps) {
  const videoId = extractYouTubeId(youtubeUrl)

  if (!videoId) {
    return (
      <div className="flex aspect-video items-center justify-center rounded-xl bg-muted">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <VideoOff className="h-12 w-12" />
          <p>動画を読み込めません</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black shadow-2xl">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={title || 'YouTube video player'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  )
}
