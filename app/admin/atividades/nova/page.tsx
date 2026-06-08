'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Category } from '@/lib/types'
import { toast } from 'sonner'

export default function NovaAtividade() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const supabase = createClient()

  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    tipo: 'colorir',
    category_id: '',
    svg_data: '',
    idade_minima: 3,
    idade_maxima: 10,
    is_premium: false,
    is_featured: false,
  })

  useEffect(() => {
    async function loadCategories() {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('ordem')
      if (data) setCategories(data)
    }
    loadCategories()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('activities')
      .insert({
        titulo: form.titulo,
        descricao: form.descricao || null,
        tipo: form.tipo,
        category_id: form.category_id || null,
        svg_data: form.svg_data || null,
        idade_minima: form.idade_minima,
        idade_maxima: form.idade_maxima,
        is_premium: form.is_premium,
        is_featured: form.is_featured,
      })

    if (error) {
      toast.error('Erro ao criar atividade', { description: error.message })
      setLoading(false)
      return
    }

    toast.success('Atividade criada com sucesso!')
    router.push('/admin/atividades')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/atividades">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Nova Atividade</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Atividade</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                rows={3}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <Select
                  value={form.tipo}
                  onValueChange={(value) => setForm({ ...form, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colorir">Colorir</SelectItem>
                    <SelectItem value="alfabetizacao">Alfabetização</SelectItem>
                    <SelectItem value="matematica">Matemática</SelectItem>
                    <SelectItem value="ingles">Inglês</SelectItem>
                    <SelectItem value="jogo">Jogo</SelectItem>
                    <SelectItem value="imprimir">Imprimir</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={form.category_id}
                  onValueChange={(value) => setForm({ ...form, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="idade_minima">Idade Mínima</Label>
                <Input
                  id="idade_minima"
                  type="number"
                  min={1}
                  max={15}
                  value={form.idade_minima}
                  onChange={(e) => setForm({ ...form, idade_minima: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idade_maxima">Idade Máxima</Label>
                <Input
                  id="idade_maxima"
                  type="number"
                  min={1}
                  max={15}
                  value={form.idade_maxima}
                  onChange={(e) => setForm({ ...form, idade_maxima: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="svg_data">SVG Data</Label>
              <Textarea
                id="svg_data"
                value={form.svg_data}
                onChange={(e) => setForm({ ...form, svg_data: e.target.value })}
                rows={5}
                placeholder="<svg>...</svg>"
                className="font-mono text-sm"
              />
            </div>

            {/* Preview */}
            {form.svg_data && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="flex h-48 w-48 items-center justify-center rounded-lg border bg-white p-4">
                  <div 
                    className="h-full w-full text-foreground"
                    dangerouslySetInnerHTML={{ __html: form.svg_data }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  id="is_premium"
                  checked={form.is_premium}
                  onCheckedChange={(checked) => setForm({ ...form, is_premium: checked })}
                />
                <Label htmlFor="is_premium">Premium</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="is_featured"
                  checked={form.is_featured}
                  onCheckedChange={(checked) => setForm({ ...form, is_featured: checked })}
                />
                <Label htmlFor="is_featured">Destaque</Label>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Criar Atividade'
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/atividades">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
