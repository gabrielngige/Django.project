import { useEffect, useState } from 'react'
import { posters } from '../../api/endpoints'

const initialForm = {
  title: '',
  unit: 'restaurant',
  headline_text: '',
  subtext: '',
  platform: 'both',
  base_image: null,
}

export default function AdminContentStudio() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [busyId, setBusyId] = useState(null)
  const [creating, setCreating] = useState(false)

  function refresh() {
    posters
      .list()
      .then((data) => setItems(data.results ?? data))
      .catch(() => setItems([]))
  }

  useEffect(refresh, [])

  async function handleCreate(e) {
    e.preventDefault()
    setCreating(true)
    const formData = new FormData()
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== '') formData.append(key, value)
    })
    try {
      await posters.create(formData)
      setForm(initialForm)
      e.target.reset()
      refresh()
    } finally {
      setCreating(false)
    }
  }

  async function handleGenerate(id) {
    setBusyId(id)
    try {
      await posters.generate(id)
      refresh()
    } finally {
      setBusyId(null)
    }
  }

  async function handlePublish(id) {
    setBusyId(id)
    try {
      await posters.publish(id)
      refresh()
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold">Content Studio</h1>
      <p className="mt-1 text-white/60">
        Drop in a raw photo, add copy, and export a ready-to-post Instagram/Facebook graphic.
      </p>

      <form
        onSubmit={handleCreate}
        className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-tavern-800 p-6 sm:grid-cols-2"
      >
        <input
          required
          placeholder="Poster title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
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
        <input
          required
          placeholder="Headline text"
          value={form.headline_text}
          onChange={(e) => setForm({ ...form, headline_text: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 sm:col-span-2"
        />
        <input
          placeholder="Subtext (optional)"
          value={form.subtext}
          onChange={(e) => setForm({ ...form, subtext: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 sm:col-span-2"
        />
        <select
          value={form.platform}
          onChange={(e) => setForm({ ...form, platform: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
        >
          <option value="both">Instagram + Facebook</option>
          <option value="instagram">Instagram only</option>
          <option value="facebook">Facebook only</option>
        </select>
        <input
          required
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, base_image: e.target.files[0] })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={creating}
          className="rounded-lg bg-gold py-2 font-semibold text-tavern-900 hover:bg-gold-light disabled:opacity-50 sm:col-span-2"
        >
          {creating ? 'Uploading…' : 'Add to Content Studio'}
        </button>
      </form>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((poster) => (
          <div key={poster.id} className="rounded-2xl border border-white/10 bg-tavern-800 p-4">
            <img
              src={poster.generated_image || poster.base_image}
              alt={poster.title}
              className="aspect-square w-full rounded-lg object-cover"
            />
            <p className="mt-3 font-medium">{poster.title}</p>
            <p className="text-xs uppercase tracking-wide text-white/40">
              {poster.status} · {poster.platform}
            </p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleGenerate(poster.id)}
                disabled={busyId === poster.id}
                className="flex-1 rounded-lg border border-white/10 py-1.5 text-sm hover:bg-white/5 disabled:opacity-50"
              >
                Generate
              </button>
              <button
                onClick={() => handlePublish(poster.id)}
                disabled={busyId === poster.id || poster.status === 'published'}
                className="flex-1 rounded-lg bg-gold py-1.5 text-sm font-semibold text-tavern-900 hover:bg-gold-light disabled:opacity-50"
              >
                {poster.status === 'published' ? 'Published' : 'Publish'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
