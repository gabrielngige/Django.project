import { useEffect, useState } from 'react'
import { socialLogs } from '../../api/endpoints'

const initialForm = {
  unit: 'restaurant',
  platform: 'instagram',
  date: new Date().toISOString().slice(0, 10),
  reach: '',
  engagement: '',
  notes: '',
}

export default function AdminSocialLogs() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  function refresh() {
    socialLogs
      .list()
      .then((data) => setItems(data.results ?? data))
      .catch(() => setItems([]))
  }

  useEffect(refresh, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await socialLogs.create({ ...form, reach: form.reach || 0, engagement: form.engagement || 0 })
      setForm(initialForm)
      refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold">Social Engagement Log</h1>
      <p className="mt-1 text-white/60">
        Manual entries feed the dashboard's reach &amp; engagement trends — the real accountability metric.
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-tavern-800 p-6 sm:grid-cols-2"
      >
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
          value={form.platform}
          onChange={(e) => setForm({ ...form, platform: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
        >
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
          <option value="tiktok">TikTok</option>
          <option value="other">Other</option>
        </select>
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
        />
        <input
          placeholder="Reach"
          value={form.reach}
          onChange={(e) => setForm({ ...form, reach: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
        />
        <input
          placeholder="Engagement (likes+comments+shares)"
          value={form.engagement}
          onChange={(e) => setForm({ ...form, engagement: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 sm:col-span-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gold py-2 font-semibold text-tavern-900 hover:bg-gold-light disabled:opacity-50 sm:col-span-2"
        >
          {saving ? 'Saving…' : 'Log Entry'}
        </button>
      </form>

      <div className="mt-8 space-y-2">
        {items.map((log) => (
          <div key={log.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-tavern-800 p-4 text-sm">
            <span className="capitalize">{log.unit} · {log.platform} · {log.date}</span>
            <span className="text-white/60">Reach {log.reach} · Engagement {log.engagement}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
