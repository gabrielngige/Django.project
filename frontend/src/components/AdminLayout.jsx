import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const links = [
  { to: '/hub', label: 'Dashboard', end: true },
  { to: '/hub/content-studio', label: 'Content Studio' },
  { to: '/hub/events', label: 'Events' },
  { to: '/hub/bundles', label: 'Bundles & Redemptions' },
  { to: '/hub/offerings', label: 'Menus & Rates' },
  { to: '/hub/gallery', label: 'Gallery' },
  { to: '/hub/social-logs', label: 'Social Engagement' },
]

const linkClass = ({ isActive }) =>
  `block rounded-lg px-4 py-2 text-sm font-medium transition ${
    isActive ? 'bg-gold text-tavern-900' : 'text-white/70 hover:bg-white/5 hover:text-white'
  }`

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/hub/login')
  }

  return (
    <div className="flex min-h-screen bg-tavern-900 text-white">
      <aside className="w-64 shrink-0 border-r border-white/10 bg-tavern-800 p-4">
        <div className="mb-6 px-2 text-lg font-bold text-gold">109 Tavern Ops Hub</div>
        <nav className="space-y-1">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="mt-8 w-full rounded-lg border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
        >
          Log out
        </button>
      </aside>
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  )
}
