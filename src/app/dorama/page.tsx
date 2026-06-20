import { Video } from 'lucide-react'
import CategoryListPage from '@/components/ui/CategoryListPage'

export default function DoramaPage() {
  return (
    <CategoryListPage
      category="dorama"
      title="Dorama"
      subtitle="Drama Jepang favoritmu"
      icon={Video}
      showMALSearch={false}
      progressLabel="Sedang ditonton"
      unitLabel="Ep"
    />
  )
}
