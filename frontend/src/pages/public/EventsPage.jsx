import { useEffect, useState } from 'react'
import { events } from '../../api/endpoints'

export default function EventsPage() {
  const [items, setItems] = useState([])

  useEffect(() => {
    events
      .list()
      .then((data) => setItems(data.results ?? data))
      .catch(() => setItems([]))
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold text-gold">Live Events</h1>
      <p className="mt-2 text-white/70">Rhumba nights, karaoke, live bands — never miss out.</p>

      {items.length === 0 ? (
        <p className="mt-10 text-white/50">No upcoming events published yet.</p>
      ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {items.map((event) => (
            <div
              key={event.id}
              className={`rounded-2xl border p-5 ${
                event.is_happening_now ? 'border-gold bg-tavern-800' : 'border-white/10 bg-tavern-800/60'
              }`}
            >
              {event.is_happening_now && (
                <span className="mb-2 inline-block rounded-full bg-gold px-3 py-1 text-xs font-bold text-tavern-900">
                  HAPPENING NOW
                </span>
              )}
              <h2 className="text-lg font-semibold">{event.title}</h2>
              <p className="text-sm text-white/50">
                {new Date(event.start_datetime).toLocaleString()} —{' '}
                {new Date(event.end_datetime).toLocaleTimeString()}
              </p>
              {event.description && <p className="mt-2 text-sm text-white/70">{event.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
