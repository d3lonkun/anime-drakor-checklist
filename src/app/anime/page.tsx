'use client'
import { Tv } from 'lucide-react'
import CategoryListPage from '@/components/ui/CategoryListPage'

export default function AnimePage() {
  return (
    <CategoryListPage
      category="anime"
      title="Anime"
      subtitle="Koleksi anime favoritmu"
      icon={Tv}
      showMALSearch
      progressLabel="Sedang di nonton"
      unitLabel="Ep"
    />
  )
}
