'use client'

import { useState } from 'react'
import {
  Users, LayoutDashboard, Coins, CreditCard, Wallet,
  Gem, ShoppingBag, PackageOpen, BarChart2, ShieldCheck,
  ChevronDown, ChevronRight, Zap, Settings
} from 'lucide-react'

const NAV = [
  { label: 'My Community', icon: Users, expandable: true },
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Token', icon: Coins, expandable: true },
  { label: 'Payment Setting', icon: CreditCard, expandable: true },
  { label: 'Wallet', icon: Wallet, expandable: true },
  { label: 'Digital Items / NFT', icon: Gem },
  {
    label: 'Campaign', icon: Zap, expandable: true,
    children: ['Referral', 'Mission'],
  },
  { label: 'Shop', icon: ShoppingBag },
  { label: 'Order', icon: PackageOpen },
  { label: 'Report', icon: BarChart2, expandable: true },
  { label: 'Role & Permission', icon: ShieldCheck },
]

export function Sidebar() {
  const [open, setOpen] = useState({ Campaign: true })

  const toggle = (label) => setOpen(prev => ({ ...prev, [label]: !prev[label] }))

  return (
    <div className="w-[235px] shrink-0 bg-[#111827] flex flex-col h-screen">
      {/* Logo */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-400 rounded-md flex items-center justify-center">
            <span className="text-white font-black text-xs">FX</span>
          </div>
          <div>
            <div className="text-white font-bold text-sm leading-none">FREEDOM</div>
            <div className="text-gray-400 text-[9px] tracking-widest">CONSOLE</div>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-300">
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map((item) => {
          const Icon = item.icon
          const isOpen = open[item.label]

          return (
            <div key={item.label}>
              <button
                onClick={() => item.expandable && toggle(item.label)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-white/5 transition-colors text-sm"
              >
                <Icon size={16} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.expandable && (
                  isOpen
                    ? <ChevronDown size={14} />
                    : <ChevronRight size={14} />
                )}
              </button>

              {item.children && isOpen && (
                <div className="ml-7 mt-0.5 mb-1">
                  {item.children.map(child => (
                    <div
                      key={child}
                      className={`px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                        child === 'Mission'
                          ? 'text-emerald-400 bg-emerald-400/10 font-medium'
                          : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                      }`}
                    >
                      {child}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* Mobile app promo */}
      <div className="mx-3 mb-3 bg-white/5 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-emerald-400/20 rounded-lg flex items-center justify-center">
            <span className="text-emerald-400 text-xs font-bold">FX</span>
          </div>
          <div>
            <div className="text-gray-400 text-[10px]">Get Mobile App</div>
            <div className="text-white text-xs font-semibold">
              Freedom <span className="text-emerald-400">Merchant</span>
            </div>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-3 border-t border-white/10 flex items-center justify-between">
        <div>
          <div className="text-white text-sm font-medium">John Doe</div>
          <div className="bg-gray-700 text-gray-300 text-[10px] px-2 py-0.5 rounded-full inline-block mt-0.5">Admin</div>
        </div>
        <button className="text-gray-500 hover:text-gray-300">
          <Settings size={16} />
        </button>
      </div>
    </div>
  )
}
