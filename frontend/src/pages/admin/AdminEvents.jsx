import { useEffect, useState } from 'react'
import { events } from '../../api/endpoints'

const initialForm = {
  title: '',
  unit: 'restaurant',
  event_type: 'other',
  description: '',
  start_datetime: '',
  end_datetime: '',
  is_published: true,
}

export default function AdminEvents() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  function refresh() {
    events
      .list()
      .then((data) => setItems(data.results ?? data))
      .catch(() => setItems([]))
  }

  useEffect(refresh, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await events.create(form)
      setForm(initialForm)
      refresh()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    await events.remove(id)
    refresh()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold">Multi-Unit Content Calendar</h1>

      <form
        onSubmit={handleCreate}
        className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-tavern-800 p-6 sm:grid-cols-2"
      >
        <input
          required
          placeholder="Event title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 sm:col-span-2"
        />
        <select
          value={form.unit}
          onChange={(e) => setForm({ ...form, unit: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
        >
          <option value="restaurant">Restaurant</option>
          <option value="carwash">Carwash</option>
          <option value="barbershop">Barbershop</option>
        </select>
        <select
          value={form.event_type}
          onChange={(e) => setForm({ ...form, event_type: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
        >
          <option value="rhumba">Rhumba Night</option>
          <option value="karaoke">Karaoke</option>
          <option value="live_band">Live Band</option>
          <option value="other">Other</option>
        </select>
        <label className="flex flex-col gap-1 text-sm text-white/60">
          Start
          <input
            required
            type="datetime-local"
            value={form.start_datetime}
            onChange={(e) => setForm({ ...form, start_datetime: e.target.value })}
            className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 text-white"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm text-white/60">
          End
          <input
            required
            type="datetime-local"
            value={form.end_datetime}
            onChange={(e) => setForm({ ...form, end_datetime: e.target.value })}
            className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 text-white"
          />
        </label>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 sm:col-span-2"
        />
        <label className="flex items-center gap-2 text-sm text-white/60">
          <input
            type="checkbox"
            checked={form.is_published}
            onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
          />
          Publish immediately
        </label>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gold py-2 font-semibold text-tavern-900 hover:bg-gold-light disabled:opacity-50 sm:col-span-2"
        >
          {saving ? 'Saving…' : 'Add Event'}
        </button>
      </form>

      <div className="mt-8 space-y-3">
        {items.map((event) => (
          <div
            key={event.id}
            className="flex items-center justify-between rounded-xl border border-white/10 bg-tavern-800 p-4"
          >
            <div>
              <p className="font-medium">
                {event.title}{' '}
                {event.is_happening_now && (
                  <span className="ml-2 rounded-full bg-gold px-2 py-0.5 text-xs font-bold text-tavern-900">
                    LIVE
                  </span>
                )}
              </p>
              <p className="text-xs text-white/50">
                {event.unit} · {new Date(event.start_datetime).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => handleDelete(event.id)}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/60 hover:bg-white/5"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
