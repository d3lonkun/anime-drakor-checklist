import { BookOpen } from 'lucide-react'
import CategoryListPage from '@/components/ui/CategoryListPage'

export default function MangaPage() {
  return (
    <CategoryListPage
      category="manga"
      title="Komik"
      subtitle="Baca komik dan manga seru"
      icon={BookOpen}
      showMALSearch
      progressLabel="Sedang dibaca"
      unitLabel="Ch"
    />
  )
}
