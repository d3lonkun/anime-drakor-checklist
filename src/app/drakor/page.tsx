'use client'
import { Clapperboard } from 'lucide-react'
import CategoryListPage from '@/components/ui/CategoryListPage'

export default function DrakorPage() {
  return (
    <CategoryListPage
      category="drakor"
      title="Drakor"
      icon={Clapperboard}
      showMALSearch={false}
      progressLabel="Sedang ditonton"
      unitLabel="Ep"
      accentColor="#ec4899"
    />
  )
}
