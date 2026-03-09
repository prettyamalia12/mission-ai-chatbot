import { TopBar } from '@/components/layout/TopBar'
import { CreateMission } from '@/components/chat/CreateMission'

export default async function Page({ searchParams }) {
  const params = await searchParams
  const draftId = params?.draftId || null
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <TopBar />
      <main className="flex-1 overflow-hidden">
        <CreateMission draftId={draftId} />
      </main>
    </div>
  )
}
