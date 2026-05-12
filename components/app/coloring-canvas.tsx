'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { 
  ArrowLeft, 
  Download, 
  Eraser, 
  RotateCcw, 
  Save,
  Crown,
  Palette,
  Heart,
  HeartOff
} from 'lucide-react'
import { Activity, FREE_LIMITS } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
  '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
  '#EC4899', '#F43F5E', '#000000', '#6B7280', '#FFFFFF',
]

interface ColoringCanvasProps {
  activity: Activity
  userId: string
  canAccess: boolean
  isPremium: boolean
  currentUsage: number
}

export function ColoringCanvas({ 
  activity, 
  userId, 
  canAccess, 
  isPremium,
  currentUsage 
}: ColoringCanvasProps) {
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#EF4444')
  const [brushSize, setBrushSize] = useState([15])
  const [isEraser, setIsEraser] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !activity.svg_data) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = 600
    canvas.height = 600

    // White background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw SVG
    const img = new Image()
    img.crossOrigin = 'anonymous'
    const svgBlob = new Blob([activity.svg_data], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    
    img.onload = () => {
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9
      const x = (canvas.width - img.width * scale) / 2
      const y = (canvas.height - img.height * scale) / 2
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
      URL.revokeObjectURL(url)
    }
    img.src = url

    // Check if favorite
    checkFavorite()
  }, [activity.svg_data])

  async function checkFavorite() {
    const { data } = await supabase
      .from('user_progress')
      .select('is_favorite')
      .eq('user_id', userId)
      .eq('activity_id', activity.id)
      .single()
    
    if (data) {
      setIsFavorite(data.is_favorite)
    }
  }

  async function incrementUsage() {
    if (isPremium || hasStarted) return
    
    setHasStarted(true)
    await supabase
      .from('profiles')
      .update({ desenhos_gratis_usados: currentUsage + 1 })
      .eq('id', userId)
  }

  function startDrawing(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!canAccess) {
      toast.error('Limite atingido', {
        description: 'Assine o Premium para continuar colorindo!',
      })
      return
    }

    incrementUsage()
    setIsDrawing(true)
    draw(e)
  }

  function stopDrawing() {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx?.beginPath()
    }
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    let x, y
    if ('touches' in e) {
      x = (e.touches[0].clientX - rect.left) * scaleX
      y = (e.touches[0].clientY - rect.top) * scaleY
    } else {
      x = (e.clientX - rect.left) * scaleX
      y = (e.clientY - rect.top) * scaleY
    }

    ctx.lineWidth = brushSize[0]
    ctx.lineCap = 'round'
    ctx.strokeStyle = isEraser ? '#FFFFFF' : color
    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function clearCanvas() {
    const canvas = canvasRef.current
    if (!canvas || !activity.svg_data) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const img = new Image()
    img.crossOrigin = 'anonymous'
    const svgBlob = new Blob([activity.svg_data], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(svgBlob)
    
    img.onload = () => {
      const scale = Math.min(canvas.width / img.width, canvas.height / img.height) * 0.9
      const x = (canvas.width - img.width * scale) / 2
      const y = (canvas.height - img.height * scale) / 2
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
      URL.revokeObjectURL(url)
    }
    img.src = url
  }

  function downloadImage() {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `${activity.titulo.toLowerCase().replace(/\s+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
    toast.success('Imagem salva!')
  }

  async function toggleFavorite() {
    const { data: existing } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_id', activity.id)
      .single()

    if (existing) {
      await supabase
        .from('user_progress')
        .update({ is_favorite: !isFavorite })
        .eq('id', existing.id)
    } else {
      await supabase
        .from('user_progress')
        .insert({
          user_id: userId,
          activity_id: activity.id,
          is_favorite: true,
        })
    }

    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removido dos favoritos' : 'Adicionado aos favoritos')
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground md:text-2xl">{activity.titulo}</h1>
            {activity.descricao && (
              <p className="text-sm text-muted-foreground">{activity.descricao}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={toggleFavorite}>
            {isFavorite ? (
              <Heart className="h-5 w-5 fill-red-500 text-red-500" />
            ) : (
              <HeartOff className="h-5 w-5" />
            )}
          </Button>
          <Button variant="outline" onClick={downloadImage}>
            <Download className="mr-2 h-4 w-4" />
            Salvar
          </Button>
        </div>
      </div>

      {/* Limit Warning */}
      {!isPremium && !canAccess && (
        <Card className="border-destructive bg-destructive/10">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-destructive">Limite diario atingido!</p>
              <p className="text-sm text-muted-foreground">
                Voce usou {FREE_LIMITS.desenhos} desenhos hoje.
              </p>
            </div>
            <Button asChild>
              <Link href="/app/premium">
                <Crown className="mr-2 h-4 w-4" />
                Seja Premium
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Canvas */}
        <Card className="flex-1 overflow-hidden">
          <CardContent className="p-4">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseMove={draw}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="w-full cursor-crosshair rounded-lg border bg-white touch-none"
              style={{ aspectRatio: '1' }}
            />
          </CardContent>
        </Card>

        {/* Tools */}
        <Card className="w-full lg:w-80">
          <CardContent className="space-y-6 p-4">
            {/* Color Palette */}
            <div>
              <label className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Palette className="h-4 w-4" />
                Cores
              </label>
              <div className="grid grid-cols-5 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setColor(c)
                      setIsEraser(false)
                    }}
                    className={`h-10 w-10 rounded-lg border-2 transition-transform hover:scale-110 ${
                      color === c && !isEraser ? 'border-primary ring-2 ring-primary/50' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Brush Size */}
            <div>
              <label className="mb-3 block text-sm font-medium">
                Tamanho do Pincel: {brushSize[0]}px
              </label>
              <Slider
                value={brushSize}
                onValueChange={setBrushSize}
                min={5}
                max={50}
                step={1}
              />
            </div>

            {/* Tools */}
            <div className="flex gap-2">
              <Button
                variant={isEraser ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setIsEraser(!isEraser)}
              >
                <Eraser className="mr-2 h-4 w-4" />
                Borracha
              </Button>
              <Button variant="outline" className="flex-1" onClick={clearCanvas}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Limpar
              </Button>
            </div>

            {/* Current Color Preview */}
            <div className="rounded-lg border p-3">
              <p className="mb-2 text-xs text-muted-foreground">Cor selecionada:</p>
              <div className="flex items-center gap-3">
                <div 
                  className="h-10 w-10 rounded-lg border"
                  style={{ backgroundColor: isEraser ? '#FFFFFF' : color }}
                />
                <span className="font-mono text-sm">
                  {isEraser ? 'Borracha' : color}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
