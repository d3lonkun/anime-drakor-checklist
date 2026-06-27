'use client'
import { Tv } from 'lucide-react'
import CategoryListPage from '@/components/ui/CategoryListPage'

export default function AnimePage() {
  return (
    <CategoryListPage
      category="anime"
      title="Anime"
      icon={Tv}
      showMALSearch
      progressLabel="Sedang ditonton"
      unitLabel="Ep"
      accentColor="#8b5cf6"
    />
  )
}
