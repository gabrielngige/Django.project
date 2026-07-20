import { useEffect, useState } from 'react'
import { gallery } from '../../api/endpoints'

const initialForm = {
  unit: 'restaurant',
  title: '',
  caption: '',
  is_before_after: false,
  image: null,
  before_image: null,
  after_image: null,
}

export default function AdminGallery() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  function refresh() {
    gallery
      .list()
      .then((data) => setItems(data.results ?? data))
      .catch(() => setItems([]))
  }

  useEffect(refresh, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    const formData = new FormData()
    formData.append('unit', form.unit)
    formData.append('title', form.title)
    formData.append('caption', form.caption)
    if (form.is_before_after) {
      if (form.before_image) formData.append('before_image', form.before_image)
      if (form.after_image) formData.append('after_image', form.after_image)
    } else if (form.image) {
      formData.append('image', form.image)
    }
    try {
      await gallery.create(formData)
      setForm(initialForm)
      e.target.reset()
      refresh()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    await gallery.remove(id)
    refresh()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold">Gallery</h1>
      <p className="mt-1 text-white/60">
        Standard shots for social proof, or Before &amp; After pairs for the barbershop.
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
        <input
          required
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
        />
        <input
          placeholder="Caption (optional)"
          value={form.caption}
          onChange={(e) => setForm({ ...form, caption: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 sm:col-span-2"
        />
        <label className="flex items-center gap-2 text-sm text-white/60 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.is_before_after}
            onChange={(e) => setForm({ ...form, is_before_after: e.target.checked })}
          />
          This is a Before &amp; After transformation
        </label>

        {form.is_before_after ? (
          <>
            <label className="flex flex-col gap-1 text-sm text-white/60">
              Before photo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, before_image: e.target.files[0] })}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-white/60">
              After photo
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, after_image: e.target.files[0] })}
              />
            </label>
          </>
        ) : (
          <label className="flex flex-col gap-1 text-sm text-white/60 sm:col-span-2">
            Photo
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
            />
          </label>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gold py-2 font-semibold text-tavern-900 hover:bg-gold-light disabled:opacity-50 sm:col-span-2"
        >
          {saving ? 'Uploading…' : 'Add to Gallery'}
        </button>
      </form>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {items.map((img) => (
          <div key={img.id} className="rounded-xl border border-white/10 bg-tavern-800 p-3">
            {img.before_image && img.after_image ? (
              <div className="grid grid-cols-2 gap-1">
                <img src={img.before_image} alt="before" className="h-32 w-full rounded object-cover" />
                <img src={img.after_image} alt="after" className="h-32 w-full rounded object-cover" />
              </div>
            ) : (
              img.image && <img src={img.image} alt={img.title} className="h-32 w-full rounded object-cover" />
            )}
            <p className="mt-2 text-sm">{img.title}</p>
            <button
              onClick={() => handleDelete(img.id)}
              className="mt-2 w-full rounded-lg border border-white/10 py-1 text-xs text-white/60 hover:bg-white/5"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
