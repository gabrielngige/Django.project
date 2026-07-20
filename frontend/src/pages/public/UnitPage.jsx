import { useEffect, useState } from 'react'
import { offerings, gallery } from '../../api/endpoints'
import WhatsAppButton from '../../components/WhatsAppButton'

export default function UnitPage({ unit, title }) {
  const [items, setItems] = useState([])
  const [images, setImages] = useState([])

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

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gold">{title}</h1>
        <WhatsAppButton message={`Hi 109 Tavern, I'd like to book at the ${title}.`} />
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-white/80">Menu & Rates</h2>
        {items.length === 0 ? (
          <p className="text-white/50">Nothing published yet — check back soon.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-tavern-800 p-4"
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.category && <p className="text-xs text-white/50">{item.category}</p>}
                  {item.description && <p className="mt-1 text-sm text-white/60">{item.description}</p>}
                </div>
                <span className="font-semibold text-gold">KES {item.price}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-14">
        <h2 className="mb-4 text-lg font-semibold text-white/80">Gallery</h2>
        {images.length === 0 ? (
          <p className="text-white/50">Gallery coming soon.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-3">
            {images.map((img) => (
              <div key={img.id} className="overflow-hidden rounded-xl border border-white/10">
                {img.before_image && img.after_image ? (
                  <div className="grid grid-cols-2">
                    <img src={img.before_image} alt={`${img.title} before`} className="h-40 w-full object-cover" />
                    <img src={img.after_image} alt={`${img.title} after`} className="h-40 w-full object-cover" />
                  </div>
                ) : (
                  img.image && <img src={img.image} alt={img.title} className="h-40 w-full object-cover" />
                )}
                <p className="p-2 text-sm text-white/70">{img.caption || img.title}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
