/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import BlogModal from '@/components/admin/BlogModal'
import BlogViewModal from '@/components/admin/BlogViewModal'
import BlogDeleteModal from '@/components/admin/BlogDeleteModal'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Post, Category } from '@/lib/types'
import { getAdminPosts, createPost, updatePost, deletePost, publishPost } from '@/lib/api/posts'
import { getCategories } from '@/lib/api/categories'
import { useToast } from '@/hooks/use-toast'

export default function AdminBlog() {
  const { toast } = useToast()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  const itemsPerPage = 10

  // Debug: Log selectedPost changes
  useEffect(() => {
    console.log('AdminBlog - selectedPost changé:', selectedPost)
  }, [selectedPost])

  // Chargement des posts et catégories au montage du composant
  useEffect(() => {
    loadPosts()
    loadCategories()
  }, [])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const data = await getAdminPosts()
      setPosts(data)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les articles',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      const blogCategories = data.filter((cat) => cat.type === 'BLOG')
      setCategories(blogCategories)
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les catégories',
        variant: 'destructive',
      })
    }
  }

  const handleDeletePost = (id: string) => {
    setPostToDelete(id)
  }

  const confirmDeletePost = async () => {
    if (!postToDelete) return
    
    try {
      await deletePost(postToDelete)
      setPosts(posts.filter((post) => post.id !== postToDelete))
      toast({
        title: 'Article supprimé',
        description: "L'article a été supprimé avec succès.",
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de supprimer l'article",
        variant: 'destructive',
      })
    } finally {
      setPostToDelete(null)
    }
  }

  const handlePublishPost = async (id: string, published: boolean) => {
    try {
      const updatedPost = await publishPost(id)
      setPosts(posts.map((post) => (post.id === id ? updatedPost : post)))
      toast({
        title: published ? 'Article publié' : 'Article dépublié',
        description: `L'article a été ${
          published ? 'publié' : 'dépublié'
        } avec succès.`,
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Impossible de modifier le statut de l'article",
        variant: 'destructive',
      })
    }
  }

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.content &&
        post.content.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.author &&
        post.author.toLowerCase().includes(searchTerm.toLowerCase()))
    
    // Correction du filtrage par catégorie
    const matchesCategory =
      !categoryFilter ||
      categoryFilter === '' ||
      categoryFilter === 'all' ||
      (post.category && post.category.id === categoryFilter) ||
      post.categoryId === categoryFilter
    
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getCategoryBadgeVariant = (categoryTitle: string) => {
    const variants = ['default', 'secondary', 'outline', 'destructive']
    const hash = categoryTitle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return variants[hash % variants.length] as 'default' | 'secondary' | 'outline' | 'destructive'
  }

  const handleSaveArticle = async (data: any, isDraft: boolean) => {
    try {
      if (selectedPost && isEditModalOpen) {
        // Mode modification
        const updateData = {
          title: data.title,
          summary: data.excerpt,
          content: data.content,
          categoryId: data.categoryId,
          status: isDraft ? 'DRAFT' : 'PUBLIC',
          author: data.author,
          readDuration: parseInt(data.readTime) || 5,
          imageLink: data.coverImage,
          imageCaption: data.coverCaption,
          tags: data.tags
        }
const updatedPost = await updatePost(selectedPost.id, updateData as Partial<Post>)
        setPosts(
          posts.map((post) => (post.id === selectedPost.id ? updatedPost : post))
        )
        toast({
          title: 'Article modifié',
          description: 'L\'article a été modifié avec succès.',
        })
        setIsEditModalOpen(false)
        setSelectedPost(null)
      } else {
        // Mode création
        const createData: Partial<Post> = {
          title: data.title,
          summary: data.excerpt,
          content: data.content,
          categoryId: data.categoryId,
          status: isDraft ? 'DRAFT' : 'PUBLIC',
          author: data.author,
          readDuration: parseInt(data.readTime) || 5,
          imageLink: data.coverImage,
          imageCaption: data.coverCaption,
          tags: data.tags
        }
        const newPost = await createPost(createData)
        setPosts([newPost, ...posts])
        setIsModalOpen(false)
        toast({
          title: 'Article créé',
          description: 'L\'article a été créé avec succès.',
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder l\'article',
        variant: 'destructive',
      })
    }
  }

  const handleViewPost = (post: Post) => {
    setSelectedPost(post)
    setIsViewModalOpen(true)
  }

  const handleEditPost = (post: Post) => {
    console.log('AdminBlog - handleEditPost appelé avec:', post)
    setSelectedPost(post)
    console.log('AdminBlog - selectedPost mis à jour, ouverture du modal')
    setIsEditModalOpen(true)
  }

  const handleConfirmDelete = async (postId: string) => {
    try {
      await deletePost(postId)
      setPosts(posts.filter((post) => post.id !== postId))
      setSelectedPost(null)
      setIsDeleteModalOpen(false)
      toast({
        title: 'Article supprimé',
        description: 'L\'article a été supprimé avec succès.',
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer l\'article',
        variant: 'destructive',
      })
    }
  }

  const handleStatusChange = async (postId: string, published: boolean) => {
    try {
      if (published) {
        const updatedPost = await publishPost(postId)
        setPosts(
          posts.map((post) => (post.id === postId ? updatedPost : post))
        )
      } else {
        // Pour dépublier, on utilise updatePost avec status DRAFT
        const updatedPost = await updatePost(postId, { status: 'DRAFT' })
        setPosts(
          posts.map((post) => (post.id === postId ? updatedPost : post))
        )
      }
      toast({
        title: published ? 'Article publié' : 'Article dépublié',
        description: `L'article a été ${published ? 'publié' : 'dépublié'} avec succès.`,
      })
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le statut de l\'article',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className='spacing-responsive admin-page-container'>
      {/* En-tête */}
      <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
        <div className='space-y-2'>
          <h1 className='text-responsive-xl font-bold text-primary'>Blog</h1>
          <p className='text-responsive-base text-muted-foreground'>
            Gérez vos articles de blog et contenus éditoriaux
          </p>
        </div>
        <Button
          className='bg-gradient-primary hover:opacity-90 touch-target w-full md:w-auto flex-shrink-0'
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className='mr-2 h-4 w-4 shrink-0' />
          <span className='truncate'>Nouvel article</span>
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card className='shadow-card'>
        <CardHeader className='p-4 md:p-6 pb-2 md:pb-3'>
          <CardTitle className='text-responsive-lg'>Filtres</CardTitle>
        </CardHeader>
        <CardContent className='p-4 md:p-6 pt-0'>
          <div className='admin-filters-container flex flex-col gap-3 sm:flex-row sm:gap-4'>
            <div className='relative flex-1 min-w-0'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
              <Input
                placeholder='Rechercher un article...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 touch-target w-full'
              />
            </div>
            <div className='admin-select-responsive flex-shrink-0'>
              <Select value={categoryFilter || 'all'} onValueChange={setCategoryFilter}>
                <SelectTrigger className='w-full touch-target'>
                  <SelectValue placeholder='Toutes catégories' />
                </SelectTrigger>
                <SelectContent className='max-h-[200px]'>
                  <SelectItem value='all'>Toutes catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des articles */}
      <Card className='shadow-card'>
        <CardHeader className='p-4 md:p-6 pb-2 md:pb-3'>
          <CardTitle className='text-responsive-lg'>
            Articles ({filteredPosts.length})
          </CardTitle>
          <CardDescription className='text-responsive-base'>
            Liste de tous vos articles de blog
          </CardDescription>
        </CardHeader>
        <CardContent className='p-4 md:p-6 pt-0'>
          <div className='w-full overflow-hidden'>
            <div className='overflow-x-auto'>
              <Table className='w-full min-w-[900px]'>
                <TableHeader>
                  <TableRow>
                    <TableHead className='min-w-[300px]'>Article</TableHead>
                    <TableHead className='min-w-[120px]'>Catégorie</TableHead>
                    <TableHead className='min-w-[150px]'>Auteur</TableHead>
                    <TableHead className='min-w-[140px]'>
                      Date de création
                    </TableHead>
                    <TableHead className='min-w-[100px]'>Statut</TableHead>
                    <TableHead className='w-[120px] text-right'>
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedPosts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className='min-w-[300px]'>
                        <div>
                          <div className='font-medium'>{post.title}</div>
                          <div className='text-sm text-muted-foreground'>
                            {post.summary?.substring(0, 80)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='min-w-[120px]'>
                        <Badge variant={getCategoryBadgeVariant(post.category?.title || '')}>
                          {post.category?.title || 'Sans catégorie'}
                        </Badge>
                      </TableCell>
                      <TableCell className='min-w-[150px]'>
                        {post.author}
                      </TableCell>
                      <TableCell className='min-w-[140px]'>
                        {formatDate(post.createdAt || '')}
                      </TableCell>
                      <TableCell className='min-w-[100px]'>
                        <Badge
                          variant={post.status === 'PUBLIC' ? 'default' : 'secondary'}
                        >
                          {post.status === 'PUBLIC' ? 'Publié' : 'Brouillon'}
                        </Badge>
                      </TableCell>
                      <TableCell className='w-[120px] text-right'>
                        <div className='flex justify-end gap-1'>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleViewPost(post)}
                            className='touch-target'
                          >
                            <Eye className='h-3 w-3' />
                          </Button>
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => handleEditPost(post)}
                            className='touch-target'
                          >
                            <Edit className='h-3 w-3' />
                          </Button>
                          <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => handleDeletePost(post.id)}
                            className='touch-target'
                          >
                            <Trash2 className='h-3 w-3' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination responsive */}
          {totalPages > 1 && (
            <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mt-6 pt-4 border-t'>
              <div className='text-xs md:text-sm text-muted-foreground text-center lg:text-left'>
                Affichage de {(currentPage - 1) * itemsPerPage + 1} à{' '}
                {Math.min(currentPage * itemsPerPage, filteredPosts.length)} sur{' '}
                {filteredPosts.length} articles
              </div>
              <div className='flex items-center justify-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className='touch-target px-3'
                >
                  <ChevronLeft className='h-4 w-4' />
                  <span className='hidden md:inline ml-1'>Précédent</span>
                </Button>
                <div className='flex items-center gap-1'>
                  {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
                    let page
                    if (totalPages <= 3) {
                      page = i + 1
                    } else if (currentPage <= 2) {
                      page = i + 1
                    } else if (currentPage >= totalPages - 1) {
                      page = totalPages - 2 + i
                    } else {
                      page = currentPage - 1 + i
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? 'default' : 'outline'}
                        size='sm'
                        onClick={() => setCurrentPage(page)}
                        className='w-10 h-8 p-0 touch-target text-xs'
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className='touch-target px-3'
                >
                  <span className='hidden md:inline mr-1'>Suivant</span>
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de création d'article */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveArticle}
      />

      {/* Modal de visualisation d'article */}
      <BlogViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        post={selectedPost}
        onStatusChange={handleStatusChange}
      />

      {/* Modal de modification d'article */}
      <BlogModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          // Délai pour éviter la perte des données avant la fermeture du modal
          setTimeout(() => setSelectedPost(null), 100)
        }}
        onSave={handleSaveArticle}
        existingPost={selectedPost}
      />

      {/* Modal de confirmation de suppression */}
      <BlogDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        post={selectedPost}
        onConfirm={handleConfirmDelete}
      />

      {/* AlertDialog pour confirmation de suppression directe */}
      <AlertDialog open={!!postToDelete} onOpenChange={() => setPostToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeletePost} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
