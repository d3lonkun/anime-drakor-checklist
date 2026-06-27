'use client'
import { BookOpen } from 'lucide-react'
import CategoryListPage from '@/components/ui/CategoryListPage'

export default function MangaPage() {
  return (
    <CategoryListPage
      category="manga"
      title="Komik"
      icon={BookOpen}
      showMALSearch
      progressLabel="Sedang dibaca"
      unitLabel="Ch"
      accentColor="#f59e0b"
    />
  )
}
