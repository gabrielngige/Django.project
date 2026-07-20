import { Link } from 'react-router-dom'
import WhatsAppButton from '../../components/WhatsAppButton'

const units = [
  {
    to: '/restaurant',
    title: 'Restaurant & Entertainment',
    blurb: 'Nyama choma, cocktails, and themed nights — Rhumba, Karaoke, Live Band.',
  },
  {
    to: '/carwash',
    title: 'Premium Carwash',
    blurb: 'Fast, thorough cleans while you dine or get groomed next door.',
  },
  {
    to: '/barbershop',
    title: 'Premium Barbershop',
    blurb: 'Precision styling and grooming packages, with before & after proof.',
  },
]

export default function Home() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          One address. <span className="text-gold">Three reasons to stay.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-white/70">
          109 Tavern is Nairobi's lifestyle hub — restaurant, carwash, and barbershop under one
          roof. Come for one, stay for the ecosystem.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            to="/bundles"
            className="rounded-full bg-gold px-6 py-3 font-semibold text-tavern-900 transition hover:bg-gold-light"
          >
            See Cross-Unit Bundles
          </Link>
          <WhatsAppButton />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-6 sm:grid-cols-3">
          {units.map((unit) => (
            <Link
              key={unit.to}
              to={unit.to}
              className="rounded-2xl border border-white/10 bg-tavern-800 p-6 transition hover:border-gold/50"
            >
              <h2 className="text-xl font-semibold text-gold">{unit.title}</h2>
              <p className="mt-2 text-sm text-white/70">{unit.blurb}</p>
              <span className="mt-4 inline-block text-sm font-medium text-white/50">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
