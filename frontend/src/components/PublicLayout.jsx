import { NavLink, Outlet } from 'react-router-dom'
import HappeningTonightBanner from './HappeningTonightBanner'
import WhatsAppButton from './WhatsAppButton'

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition hover:text-gold ${isActive ? 'text-gold' : 'text-white/80'}`

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-tavern-900 text-white">
      <HappeningTonightBanner />

      <header className="border-b border-white/10 bg-tavern-800/60 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="text-lg font-bold tracking-wide text-gold">
            109 TAVERN
          </NavLink>
          <div className="flex gap-6">
            <NavLink to="/restaurant" className={navLinkClass}>Restaurant</NavLink>
            <NavLink to="/carwash" className={navLinkClass}>Carwash</NavLink>
            <NavLink to="/barbershop" className={navLinkClass}>Barbershop</NavLink>
            <NavLink to="/events" className={navLinkClass}>Events</NavLink>
            <NavLink to="/bundles" className={navLinkClass}>Bundles</NavLink>
          </div>
          <WhatsAppButton className="hidden sm:inline-flex" />
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-white/50">
        © {new Date().getFullYear()} 109 Tavern Restaurant, Carwash & Barbershop. All rights reserved.
      </footer>
    </div>
  )
}
