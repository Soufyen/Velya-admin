/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { 
  X, Tag, Plus, Bold, Italic, Strikethrough, List, ListOrdered, 
  Underline as UnderlineIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Link as LinkIcon, Image as ImageIcon, Code, Quote, Undo, Redo
} from 'lucide-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Blockquote from '@tiptap/extension-blockquote'
import './BlogModal.css'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { getCategories } from '@/lib/api/categories'
import { Category } from '@/lib/types'

interface BlogModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any, isDraft: boolean) => void
  existingPost?: any
}
const existingTags = [
  'react',
  'javascript',
  'typescript',
  'nodejs',
  'css',
  'html',
  'vue',
  'angular',
  'express',
  'mongodb',
  'postgresql',
  'docker',
  'aws',
  'git',
  'api',
  'frontend',
  'backend',
  'fullstack',
]

export default function BlogModal({
  isOpen,
  onClose,
  onSave,
  existingPost,
}: BlogModalProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    categoryId: '',
    readTime: '',
    excerpt: '',
    content: '',
    coverImage: '',
    coverCaption: '',
  })

  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([])
  const [blogCategories, setBlogCategories] = useState<Category[]>([])

  // Debug: Log formData changes
  useEffect(() => {
    console.log('BlogModal - État actuel du formData:', formData)
  }, [formData])

  // Configuration pour TipTap avec extensions enrichies
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      Placeholder.configure({
        placeholder: 'Rédigez le contenu de votre article...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Blockquote.configure({
        HTMLAttributes: {
          class: 'border-l-4 border-gray-300 pl-4 italic text-gray-700',
        },
      }),
    ],
    content: formData.content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      setFormData({ ...formData, content: html })
    },
  })

  // Mettre à jour le contenu de l'éditeur quand formData.content change
  useEffect(() => {
    if (editor && editor.getHTML() !== formData.content) {
      editor.commands.setContent(formData.content)
    }
  }, [formData.content, editor])

  // Charger les catégories de type BLOG
  useEffect(() => {
    if (isOpen) {
      loadBlogCategories()
    }
  }, [isOpen])

  const loadBlogCategories = async () => {
    try {
      const categories = await getCategories()
      const blogCats = categories.filter((cat) => cat.type === 'BLOG')
      setBlogCategories(blogCats)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les catégories',
        variant: 'destructive',
      })
    }
  }

  // Pré-remplir les données si on modifie un article existant
  useEffect(() => {
    if (isOpen) {
      if (existingPost && existingPost.id) {
        console.log('BlogModal - Chargement des données existantes:', existingPost)
        const newFormData = {
          title: existingPost.title || '',
          author: existingPost.author || '',
          categoryId: existingPost.categoryId || '',
          readTime: existingPost.readDuration?.toString() || '',
          excerpt: existingPost.summary || '',
          content: existingPost.content || '',
          coverImage: existingPost.imageLink || '',
          coverCaption: existingPost.imageCaption || '',
        }
        console.log('BlogModal - Nouvelles données du formulaire:', newFormData)
        setFormData(newFormData)

        setTags(existingPost.tags || [])
      } else if (!existingPost) {
        // Réinitialiser pour un nouvel article seulement si existingPost est null/undefined
        console.log('BlogModal - Réinitialisation pour nouvel article')
        setFormData({
          title: '',
          author: '',
          categoryId: '',
          readTime: '',
          excerpt: '',
          content: '',
          coverImage: '',
          coverCaption: '',
        })
        setTags([])
      }
    }
  }, [existingPost, isOpen])

  const handleTagInput = (value: string) => {
    setNewTag(value)
    if (value.length > 0) {
      const filtered = existingTags.filter(
        (tag) =>
          tag.toLowerCase().includes(value.toLowerCase()) && !tags.includes(tag)
      )
      setTagSuggestions(filtered.slice(0, 5))
    } else {
      setTagSuggestions([])
    }
  }

  const addTag = (tag: string) => {
    if (tags.length >= 10) {
      toast({
        title: 'Limite atteinte',
        description: 'Vous ne pouvez pas ajouter plus de 10 tags.',
        variant: 'destructive',
      })
      return
    }
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setNewTag('')
      setTagSuggestions([])
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = (isDraft: boolean) => {
    if (!formData.title || !formData.author || !formData.categoryId) {
      toast({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs obligatoires.',
        variant: 'destructive',
      })
      return
    }

    const blogData = {
      ...formData,
      tags,
      published: !isDraft,
    }

    onSave(blogData, isDraft)
    onClose()

    toast({
      title: isDraft ? 'Brouillon enregistré' : 'Article publié',
      description: isDraft
        ? 'Votre article a été enregistré comme brouillon.'
        : 'Votre article a été publié avec succès.',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-bold text-primary'>
            {existingPost ? 'Modifier un article' : 'Créer un nouvel article'}
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-8'>
          {/* Informations générales */}
          <div className='space-y-6'>
            <h3 className='text-lg font-semibold text-primary'>
              Informations générales
            </h3>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='title'>Titre de l'article *</Label>
                <Input
                  id='title'
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder='Titre de votre article...'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='author'>Auteur *</Label>
                <Input
                  id='author'
                  value={formData.author}
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  placeholder="Nom de l'auteur..."
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='category'>Catégorie *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, categoryId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Sélectionner une catégorie' />
                  </SelectTrigger>
                  <SelectContent>
                    {blogCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='readTime'>Durée de lecture (minutes)</Label>
                <Input
                  id='readTime'
                  type='number'
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({ ...formData, readTime: e.target.value })
                  }
                  placeholder='5'
                />
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='excerpt'>Extrait</Label>
              <Textarea
                id='excerpt'
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder='Résumé de votre article...'
                rows={3}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='coverImage'>Image de couverture (.webp)</Label>
                <Input
                  id='coverImage'
                  value={formData.coverImage}
                  onChange={(e) =>
                    setFormData({ ...formData, coverImage: e.target.value })
                  }
                  placeholder='https://example.com/image.webp'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='coverCaption'>Légende de l'image</Label>
                <Input
                  id='coverCaption'
                  value={formData.coverCaption}
                  onChange={(e) =>
                    setFormData({ ...formData, coverCaption: e.target.value })
                  }
                  placeholder="Description de l'image..."
                />
              </div>
            </div>
          </div>

          {/* Contenu de l'article */}
          <div className='space-y-2'>
              <Label htmlFor='content'>Contenu de l'article</Label>
              <div className='tiptap-editor border rounded-md'>
                {editor && (
                  <div className='tiptap-toolbar'>
                    {/* Actions Undo/Redo */}
                    <div className="toolbar-group">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Annuler"
                      >
                        <Undo size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Refaire"
                      >
                        <Redo size={14} />
                      </button>
                    </div>

                    {/* Titres */}
                    <div className="toolbar-group">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
                        title="Titre 1"
                      >
                        H1
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
                        title="Titre 2"
                      >
                        H2
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
                        title="Titre 3"
                      >
                        H3
                      </button>
                    </div>

                    {/* Formatage de texte */}
                    <div className="toolbar-group">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? 'is-active' : ''}
                        title="Gras"
                      >
                        <Bold size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? 'is-active' : ''}
                        title="Italique"
                      >
                        <Italic size={14} />
                      </button>

                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={editor.isActive('strike') ? 'is-active' : ''}
                        title="Barré"
                      >
                        <Strikethrough size={14} />
                      </button>
                      <button
                         type="button"
                         onClick={() => editor.chain().focus().toggleCode().run()}
                         className={editor.isActive('code') ? 'is-active' : ''}
                         title="Code"
                       >
                         <Code size={14} />
                       </button>
                    </div>

                    {/* Alignement */}
                    <div className="toolbar-group">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
                        title="Aligner à gauche"
                      >
                        <AlignLeft size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
                        title="Centrer"
                      >
                        <AlignCenter size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
                        title="Aligner à droite"
                      >
                        <AlignRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}
                        title="Justifier"
                      >
                        <AlignJustify size={14} />
                      </button>
                    </div>

                    {/* Listes et citations */}
                    <div className="toolbar-group">
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={editor.isActive('bulletList') ? 'is-active' : ''}
                        title="Liste à puces"
                      >
                        <List size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={editor.isActive('orderedList') ? 'is-active' : ''}
                        title="Liste numérotée"
                      >
                        <ListOrdered size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? 'is-active' : ''}
                        title="Citation"
                      >
                        <Quote size={14} />
                      </button>
                    </div>

                    {/* Fonctionnalités supplémentaires à venir */}
                  </div>
                )}
                <div className='min-h-[300px] p-3'>
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>

          {/* Tags */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-primary'>
              Tags de l'article
            </h3>

            <div className='space-y-3'>
              <div className='flex gap-2'>
                <div className='flex-1 relative'>
                  <Input
                    placeholder='Ajouter un tag...'
                    value={newTag}
                    onChange={(e) => handleTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag(newTag)
                      }
                    }}
                  />
                  {tagSuggestions.length > 0 && (
                    <Card className='absolute top-full left-0 right-0 z-10 mt-1 shadow-lg'>
                      <CardContent className='p-2'>
                        {tagSuggestions.map((suggestion) => (
                          <Button
                            key={suggestion}
                            variant='ghost'
                            size='sm'
                            className='w-full justify-start'
                            onClick={() => addTag(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </CardContent>
                    </Card>
                  )}
                </div>
                <Button
                  onClick={() => addTag(newTag)}
                  disabled={!newTag || tags.length >= 10}
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>

              <div className='flex flex-wrap gap-2'>
                {tags.map((tag) => (
                  <Badge key={tag} variant='secondary' className='px-3 py-1'>
                    {tag}
                    <Button
                      variant='ghost'
                      size='sm'
                      className='ml-2 h-4 w-4 p-0 hover:bg-transparent'
                      onClick={() => removeTag(tag)}
                    >
                      <X className='h-3 w-3' />
                    </Button>
                  </Badge>
                ))}
              </div>

              <p className='text-sm text-muted-foreground'>
                {tags.length}/10 tags ajoutés
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className='flex flex-col sm:flex-row gap-3 pt-4 border-t'>
            <Button variant='outline' onClick={onClose} className='sm:w-auto'>
              Annuler
            </Button>
            <div className='flex gap-3 sm:ml-auto'>
              {!existingPost && (
                <Button
                  variant='secondary'
                  onClick={() => handleSubmit(true)}
                  className='flex-1 sm:flex-none'
                >
                  Enregistrer comme brouillon
                </Button>
              )}
              <Button
                className='bg-gradient-primary hover:opacity-90 flex-1 sm:flex-none'
                onClick={() => handleSubmit(false)}
              >
                {existingPost ? 'Modifier' : 'Publier'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
