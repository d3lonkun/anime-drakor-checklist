'use client'
import { Video } from 'lucide-react'
import CategoryListPage from '@/components/ui/CategoryListPage'

export default function DoramaPage() {
  return (
    <CategoryListPage
      category="dorama"
      title="Dorama"
      icon={Video}
      showMALSearch={false}
      progressLabel="Sedang ditonton"
      unitLabel="Ep"
      accentColor="#06b6d4"
    />
  )
}
