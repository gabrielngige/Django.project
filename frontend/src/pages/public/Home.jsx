import { Link } from 'react-router-dom'
import WhatsAppButton from '../../components/WhatsAppButton'

const units = [
  {
    to: '/restaurant',
    title: 'Restaurant & Entertainment',
    blurb: 'Nyama choma, cocktails, and themed nights — Rhumba, Karaoke, Live Band.',
    background: '/assets/backgrounds/restaurant-bg.jpg',
    color: 'from-red-600/80 to-amber-600/80',
  },
  {
    to: '/carwash',
    title: 'Premium Carwash',
    blurb: 'Fast, thorough cleans while you dine or get groomed next door.',
    background: '/assets/backgrounds/carwash-bg.jpg',
    color: 'from-blue-600/80 to-cyan-600/80',
  },
  {
    to: '/barbershop',
    title: 'Premium Barbershop',
    blurb: 'Precision styling and grooming packages, with before & after proof.',
    background: '/assets/backgrounds/barbershop-bg.jpg',
    color: 'from-slate-600/80 to-gray-600/80',
  },
]

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-96 bg-cover bg-center" style={{
        backgroundImage: "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 400%22><rect fill=%22%23000000%22 width=%221200%22 height=%22400%22/></svg>')",
        backgroundAttachment: 'fixed',
      }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        <div className="relative z-10 mx-auto flex min-h-96 max-w-6xl flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-6xl">
            One address. <span className="text-gold">Three reasons to stay.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80 drop-shadow">
            109 Tavern is Nairobi's lifestyle hub — restaurant, carwash, and barbershop under one
            roof. Come for one, stay for the ecosystem.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/bundles"
              className="rounded-full bg-gold px-6 py-3 font-semibold text-tavern-900 transition hover:bg-gold-light focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 focus:ring-offset-tavern-900"
            >
              See Cross-Unit Bundles
            </Link>
            <WhatsAppButton />
          </div>
        </div>
      </section>

      {/* Units Grid */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gold">Our Services</h2>
          <p className="mt-2 text-white/60">Everything you need in one place</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3">
          {units.map((unit) => (
            <Link
              key={unit.to}
              to={unit.to}
              className="group relative overflow-hidden rounded-2xl border border-white/10 transition hover:border-gold/50"
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-300 group-hover:scale-110"
                style={{
                  backgroundImage: `url('${unit.background}')`,
                }}
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${unit.color} transition duration-300 group-hover:${unit.color}`} />

              {/* Content */}
              <div className="relative z-10 flex flex-col justify-end p-6 min-h-64">
                <h3 className="text-2xl font-bold text-white">{unit.title}</h3>
                <p className="mt-3 text-sm text-white/80">{unit.blurb}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-gold transition group-hover:translate-x-1">
                  Explore →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl border border-gold/20 bg-gradient-to-r from-gold/5 to-gold/5 p-12 text-center">
          <h2 className="text-2xl font-bold text-gold">Why Choose 109 Tavern?</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div>
              <div className="text-3xl">🏆</div>
              <h3 className="mt-2 font-semibold text-white">Premium Quality</h3>
              <p className="mt-1 text-sm text-white/60">Top-tier service across all our units</p>
            </div>
            <div>
              <div className="text-3xl">⏰</div>
              <h3 className="mt-2 font-semibold text-white">Convenient Location</h3>
              <p className="mt-1 text-sm text-white/60">Everything in one place for your lifestyle</p>
            </div>
            <div>
              <div className="text-3xl">💰</div>
              <h3 className="mt-2 font-semibold text-white">Bundle Deals</h3>
              <p className="mt-1 text-sm text-white/60">Save more with our cross-unit offers</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
