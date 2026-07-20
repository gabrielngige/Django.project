import { useEffect, useState } from 'react'
import { events } from '../api/endpoints'

export default function HappeningTonightBanner() {
  const [liveEvents, setLiveEvents] = useState([])

  useEffect(() => {
    events
      .happeningNow()
      .then(setLiveEvents)
      .catch(() => setLiveEvents([]))
  }, [])

  if (liveEvents.length === 0) return null

  return (
    <div className="bg-gold text-tavern-900 px-4 py-2 text-center text-sm font-semibold tracking-wide">
      🔥 Happening Tonight:{' '}
      {liveEvents.map((e, i) => (
        <span key={e.id}>
          {e.title}
          {i < liveEvents.length - 1 ? ' · ' : ''}
        </span>
      ))}
    </div>
  )
}
