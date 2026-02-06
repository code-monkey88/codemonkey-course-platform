import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { CourseCard } from '@/components/course-card'
import { ArrowRight, Code2, Sparkles, Zap, GraduationCap } from 'lucide-react'

type Level = 'beginner' | 'intermediate' | 'advanced'

export default async function Home() {
  const supabase = await createClient()

  // 講座一覧を取得（動画数と合計時間も取得）
  const { data: courses, error } = await supabase
    .from('courses')
    .select(`
      id,
      title,
      description,
      level,
      thumbnail_url,
      order_index,
      sections (
        videos (
          id,
          duration
        )
      )
    `)
    .order('order_index')

  if (error) {
    throw error
  }

  // 動画数と合計時間を計算
  const coursesWithStats = courses?.map((course) => {
    const allVideos = course.sections?.flatMap((s) => s.videos) || []
    const videoCount = allVideos.length
    const totalDuration = allVideos.reduce((sum, v) => sum + (v.duration || 0), 0)
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      level: course.level as Level,
      thumbnail_url: course.thumbnail_url,
      videoCount,
      totalDuration: Math.floor(totalDuration / 60), // 分に変換
    }
  }) || []

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

        <div className="container flex flex-col items-center justify-center px-4 py-24 text-center md:py-32 lg:py-40">
          <div className="inline-flex items-center rounded-full border bg-background/60 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
            <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
            AIでプログラミングを学ぶ新しい方法
          </div>

          <h1 className="mt-8 max-w-4xl bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl lg:text-7xl">
            AIプログラミング
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text">
              学習プラットフォーム
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            初心者から上級者まで、体系的にAIプログラミングを学べるオンライン講座。
            YouTube動画で実践的なスキルを身につけよう。
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="group h-12 px-8 text-base">
              <Link href="/login">
                今すぐ始める
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base">
              <Link href="#features">
                詳しく見る
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="border-t bg-muted/30 py-20 md:py-28">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              学習を加速する3つの特徴
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              効率的に学べる環境を提供します
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                <Code2 className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">体系的なカリキュラム</h3>
              <p className="mt-3 text-muted-foreground">
                初級から上級まで、段階的に学べるカリキュラム。基礎からしっかり身につけられます。
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 text-white shadow-lg shadow-violet-500/30">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">実践的な動画講座</h3>
              <p className="mt-3 text-muted-foreground">
                YouTube動画で実際のコーディングを見ながら学習。手を動かしながら理解を深められます。
              </p>
            </div>

            <div className="group relative overflow-hidden rounded-2xl border bg-background p-8 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold">進捗管理機能</h3>
              <p className="mt-3 text-muted-foreground">
                学習の進捗を可視化して、モチベーションを維持。自分のペースで着実に前進できます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="border-t py-20 md:py-28">
        <div className="container px-4">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg shadow-blue-500/30">
              <GraduationCap className="h-6 w-6" />
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
              講座一覧
            </h2>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              初級から上級まで、あなたのレベルに合わせた講座を用意しています
            </p>
          </div>

          {coursesWithStats.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coursesWithStats.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  videoCount={course.videoCount}
                  totalDuration={course.totalDuration}
                />
              ))}
            </div>
          ) : (
            <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-16">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
                <GraduationCap className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="mt-4 font-medium">講座は準備中です</p>
              <p className="mt-1 text-sm text-muted-foreground">
                もうしばらくお待ちください
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-20 md:py-28">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            今日から学習を始めよう
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            無料で始められます。Googleアカウントでログインするだけ。
          </p>
          <Button asChild size="lg" className="mt-8 h-12 px-8 text-base">
            <Link href="/login">
              無料で始める
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-8">
        <div className="container flex flex-col items-center justify-between gap-4 px-4 text-sm text-muted-foreground md:flex-row">
          <p>&copy; 2024 AIプログラミング学習プラットフォーム</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-foreground transition-colors">利用規約</Link>
            <Link href="#" className="hover:text-foreground transition-colors">プライバシーポリシー</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
