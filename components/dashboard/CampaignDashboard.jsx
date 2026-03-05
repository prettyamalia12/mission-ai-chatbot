'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Plus, ArrowUpDown, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { CongratulationsPanel } from './CongratulationsPanel'

const STATS = [
  { label: 'Total campaign', value: 11, color: 'text-emerald-500' },
  { label: 'Active campaign', value: 9, color: 'text-emerald-500' },
  { label: 'Scheduled campaign', value: 1, color: 'text-emerald-500' },
  { label: 'Ended campaign', value: 1, color: 'text-gray-400' },
]

const CAMPAIGNS = [
  { id: 1, name: 'CryptoCommerce Carnival', type: 'Community Referral', start: '', end: '', reward: 'Token' },
  { id: 2, name: 'Blockchain Bonanza', type: 'Community Referral', start: '01/05/2023', end: '01/09/2023', reward: 'Token' },
  { id: 3, name: 'TokenTrail Blazers', type: 'Friend Referral', start: '16/05/2023', end: '16/09/2023', reward: 'Token' },
  { id: 4, name: 'CryptoFiesta: Uniting Communities', type: 'Community Referral', start: '16/05/2023', end: '16/09/2023', reward: 'NFT' },
  { id: 5, name: 'CryptoQuest Marketplace', type: 'Friend Referral', start: '16/05/2023', end: '16/09/2023', reward: 'General' },
  { id: 6, name: 'Digital Coin Derby', type: 'Community Referral', start: '16/05/2023', end: '16/09/2023', reward: 'General' },
  { id: 7, name: 'CryptoConnect Convergence', type: 'Friend Referral', start: '16/05/2023', end: '16/09/2023', reward: 'NFT' },
  { id: 8, name: 'NFT Nexus Fiesta: Bridging Community', type: 'Quest', start: '16/05/2023', end: '16/09/2023', reward: 'NFT' },
  { id: 9, name: 'CoinFast Community', type: 'Quest', start: '16/05/2023', end: '16/09/2023', reward: 'Token' },
]

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
  const [showCongrats, setShowCongrats] = useState(false)

  useEffect(() => {
    if (searchParams.get('published') === 'true') {
      setShowCongrats(true)
    }
  }, [searchParams])

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
          {STATS.map(stat => (
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
                <SortableHeader label="Type" />
                <SortableHeader label="Start Date" />
                <SortableHeader label="End Date" />
                <SortableHeader label="Reward" />
              </tr>
            </thead>
            <tbody>
              {CAMPAIGNS.map((c, i) => (
                <tr key={c.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i % 2 === 0 ? '' : ''}`}>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.id}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-emerald-600 hover:underline cursor-pointer">{c.name}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.type}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.start || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.end || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{c.reward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
