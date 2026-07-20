import { useEffect, useState } from 'react'
import { bundles } from '../../api/endpoints'

export default function BundlesPage() {
  const [items, setItems] = useState([])

  useEffect(() => {
    bundles
      .list()
      .then((data) => setItems(data.results ?? data))
      .catch(() => setItems([]))
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gold">Cross-Unit Bundles</h1>
      <p className="mt-2 text-white/70">
        Combine the restaurant, carwash, and barbershop into one unbeatable visit.
      </p>

      {items.length === 0 ? (
        <p className="mt-10 text-white/50">No active bundles right now — check back soon.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {items.map((bundle) => (
            <div key={bundle.id} className="rounded-2xl border border-white/10 bg-tavern-800 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">{bundle.name}</h2>
                {bundle.discount_label && (
                  <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">
                    {bundle.discount_label}
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm uppercase tracking-wide text-white/40">
                {bundle.units_included?.join(' + ')}
              </p>
              {bundle.description && <p className="mt-3 text-sm text-white/70">{bundle.description}</p>}
              <div className="mt-4 flex items-center justify-between">
                {bundle.price && <span className="text-lg font-bold text-gold">KES {bundle.price}</span>}
                <a
                  href={bundle.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-500"
                >
                  Book on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
