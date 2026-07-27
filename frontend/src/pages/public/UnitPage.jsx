import { useEffect, useState } from 'react'
import { offerings, gallery } from '../../api/endpoints'
import WhatsAppButton from '../../components/WhatsAppButton'

const backgroundImages = {
  restaurant: '/assets/backgrounds/restaurant-bg.jpg',
  barbershop: '/assets/backgrounds/barbershop-bg.jpg',
  carwash: '/assets/backgrounds/carwash-bg.jpg',
}

const backgroundColors = {
  restaurant: 'from-red-900/40 to-amber-900/40',
  barbershop: 'from-slate-900/40 to-gray-900/40',
  carwash: 'from-blue-900/40 to-cyan-900/40',
}

export default function UnitPage({ unit, title }) {
  const [items, setItems] = useState([])
  const [images, setImages] = useState([])
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    offerings
      .list({ unit })
      .then((data) => setItems(data.results ?? data))
      .catch(() => setItems([]))
    gallery
      .list({ unit })
      .then((data) => setImages(data.results ?? data))
      .catch(() => setImages([]))
  }, [unit])

  const bgImage = backgroundImages[unit]
  const bgGradient = backgroundColors[unit]

  return (
    <div className="min-h-screen bg-tavern-900">
      {/* Hero Section with Background Image */}
      <div
        className="relative min-h-64 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Dark Overlay for Readability */}
        <div className={`absolute inset-0 bg-gradient-to-b ${bgGradient}`} />

        {/* Content */}
        <div className="relative z-10 flex min-h-64 flex-col items-center justify-center px-6 text-center">
          <h1 className="text-4xl font-bold text-gold drop-shadow-lg md:text-5xl">{title}</h1>
          <p className="mt-4 text-lg text-white/90 drop-shadow">Experience excellence at 109 Tavern</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-16">
        {/* Header with Button */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-white/60">Browse our offerings</p>
          </div>
          <WhatsAppButton message={`Hi 109 Tavern, I'd like to book at the ${title}.`} />
        </div>

        {/* Menu & Rates Section */}
        <section className="mt-10">
          <h2 className="mb-6 text-2xl font-semibold text-gold">Menu & Rates</h2>
          {items.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-tavern-800/50 p-8 text-center">
              <p className="text-white/50">Nothing published yet — check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-gradient-to-r from-tavern-800 to-tavern-800/50 p-4 transition hover:border-gold/30 hover:from-tavern-700 hover:to-tavern-700/50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-white">{item.name}</p>
                    {item.category && (
                      <p className="text-xs text-gold/70">{item.category}</p>
                    )}
                    {item.description && (
                      <p className="mt-1 text-sm text-white/60">{item.description}</p>
                    )}
                  </div>
                  <span className="ml-4 whitespace-nowrap font-semibold text-gold">
                    KES {item.price}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Gallery Section */}
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-semibold text-gold">Gallery</h2>
          {images.length === 0 ? (
            <div className="rounded-xl border border-white/10 bg-tavern-800/50 p-8 text-center">
              <p className="text-white/50">Gallery coming soon.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  className="overflow-hidden rounded-xl border border-white/10 bg-tavern-800 transition hover:border-gold/30"
                >
                  {img.before_image && img.after_image ? (
                    <div className="grid grid-cols-2">
                      <img
                        src={img.before_image}
                        alt={`${img.title} before`}
                        className="h-40 w-full object-cover"
                      />
                      <img
                        src={img.after_image}
                        alt={`${img.title} after`}
                        className="h-40 w-full object-cover"
                      />
                    </div>
                  ) : img.image ? (
                    <img
                      src={img.image}
                      alt={img.title}
                      className="h-40 w-full object-cover"
                    />
                  ) : null}
                  <p className="p-3 text-sm text-white/70">{img.caption || img.title}</p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* CTA Section */}
        <section className="mt-16 rounded-xl border border-gold/30 bg-gradient-to-r from-gold/10 to-gold/5 p-8 text-center">
          <h3 className="text-xl font-semibold text-gold">Ready to visit?</h3>
          <p className="mt-2 text-white/80">Contact us now to make your reservation</p>
          <div className="mt-6">
            <WhatsAppButton message={`Hi 109 Tavern, I'd like to book at the ${title}.`} />
          </div>
        </section>
      </div>
    </div>
  )
}
