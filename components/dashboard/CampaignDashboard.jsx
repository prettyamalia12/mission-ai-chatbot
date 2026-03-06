'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Plus, ArrowUpDown, ChevronDown, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { CongratulationsPanel } from './CongratulationsPanel'
import { getDrafts, deleteDraft } from '@/lib/draft-store'

function SortableHeader({ label }) {
  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 whitespace-nowrap">
      <div className="flex items-center gap-1">
        {label}
        <ArrowUpDown size={12} className="text-gray-400" />
      </div>
    </th>
  )
}

function FilterDropdown({ label }) {
  return (
    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
      {label}
      <ChevronDown size={14} />
    </button>
  )
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [showCongrats, setShowCongrats] = useState(false)
  const [drafts, setDrafts] = useState([])
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { id, name }

  useEffect(() => {
    if (searchParams.get('published') === 'true') {
      setShowCongrats(true)
    }
    setDrafts(getDrafts())
  }, [searchParams])

  const handleDelete = (e, id, name) => {
    e.stopPropagation()
    setDeleteConfirm({ id, name })
  }

  const confirmDelete = () => {
    deleteDraft(deleteConfirm.id)
    setDrafts(getDrafts())
    setDeleteConfirm(null)
  }

  const stats = [
    { label: 'Total campaign', value: drafts.length, color: 'text-emerald-500' },
    { label: 'Active campaign', value: 0, color: 'text-emerald-500' },
    { label: 'Scheduled campaign', value: 0, color: 'text-emerald-500' },
    { label: 'Ended campaign', value: 0, color: 'text-gray-400' },
  ]

  return (
    <div className="relative">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-sm text-gray-400 mb-1">Campaign</div>
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Mission</h1>
            <Link
              href="/"
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              <Plus size={16} />
              Create Mission
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {stats.map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl px-6 py-5 border border-gray-100 shadow-sm">
              <div className={`text-3xl font-bold mb-1 ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          <FilterDropdown label="Type : All" />
          <FilterDropdown label="Reward : All" />
          <FilterDropdown label="Status : All" />
          <FilterDropdown label="Campaign Date : All" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">No.</th>
                <SortableHeader label="Campaign Name" />
                <SortableHeader label="Community" />
                <SortableHeader label="Type" />
                <SortableHeader label="Start Date" />
                <SortableHeader label="End Date" />
                <SortableHeader label="Reward" />
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {drafts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                    No missions yet. Click <strong>Create Mission</strong> to get started.
                  </td>
                </tr>
              ) : drafts.map((d, i) => (
                <tr
                  key={d.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => router.push(`/?draftId=${d.id}`)}
                >
                  <td className="px-4 py-3 text-sm text-gray-500">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-emerald-600 hover:underline">{d.title || 'Untitled Draft'}</span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 border border-yellow-200">Draft</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{d.community || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{d.mission_type || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{d.duration?.start_date || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{d.duration?.end_date || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{d.milestones?.[0]?.rewards?.[0]?.type || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={(e) => handleDelete(e, d.id, d.title || 'Untitled Draft')}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete draft"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-[400px] p-6 shadow-2xl">
            <h2 className="text-base font-bold text-gray-900 mb-2">Delete Mission Draft</h2>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Congratulations slide-in panel */}
      {showCongrats && (
        <CongratulationsPanel onClose={() => setShowCongrats(false)} />
      )}
    </div>
  )
}

export function CampaignDashboard() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  )
}
