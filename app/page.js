import { TopBar } from '@/components/layout/TopBar'
import { CreateMission } from '@/components/chat/CreateMission'

export default function Page() {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <TopBar />
      <main className="flex-1 overflow-hidden">
        <CreateMission />
      </main>
    </div>
  )
}
