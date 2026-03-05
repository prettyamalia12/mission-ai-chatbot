import { UserPlus, CreditCard, ShoppingBag, Target } from 'lucide-react'

const PICKS = [
  {
    icon: UserPlus,
    title: 'Invite Friends',
    description: 'Encourage users to invite friends to join your community',
    message: 'I want to create an Invite Friends mission',
  },
  {
    icon: CreditCard,
    title: 'Minimum Spend',
    description: 'Set a minimum spending threshold.',
    message: 'I want to create a Minimum Spend mission',
  },
  {
    icon: ShoppingBag,
    title: 'Purchase Items',
    description: 'Motivate users to buy a specific product.',
    message: 'I want to create a Purchase Items mission',
  },
  {
    icon: Target,
    title: 'Token Topup',
    description: 'Prompt users to top up their token balance.',
    message: 'I want to create a Token Topup mission',
  },
]

export function QuickPicks({ onSelect }) {
  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {PICKS.map((pick) => {
        const Icon = pick.icon
        return (
          <button
            key={pick.title}
            onClick={() => onSelect(pick.message)}
            className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:bg-emerald-50/30 transition-all text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              <Icon size={16} className="text-blue-500" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-800">{pick.title}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">{pick.description}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
