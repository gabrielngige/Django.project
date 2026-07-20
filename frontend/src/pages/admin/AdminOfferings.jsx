import { useEffect, useState } from 'react'
import { offerings } from '../../api/endpoints'

const initialForm = {
  unit: 'restaurant',
  category: '',
  name: '',
  description: '',
  price: '',
  is_available: true,
}

export default function AdminOfferings() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialForm)
  const [saving, setSaving] = useState(false)

  function refresh() {
    offerings
      .list()
      .then((data) => setItems(data.results ?? data))
      .catch(() => setItems([]))
  }

  useEffect(refresh, [])

  async function handleCreate(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await offerings.create(form)
      setForm(initialForm)
      refresh()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    await offerings.remove(id)
    refresh()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gold">Menus, Rates & Packages</h1>

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
          placeholder="Category, e.g. Nyama Choma"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
        />
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 sm:col-span-2"
        />
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 sm:col-span-2"
        />
        <input
          required
          placeholder="Price (KES)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-gold py-2 font-semibold text-tavern-900 hover:bg-gold-light disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Add Item'}
        </button>
      </form>

      <div className="mt-8 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-tavern-800 p-4">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-white/50">{item.unit} · {item.category}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-semibold text-gold">KES {item.price}</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/60 hover:bg-white/5"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
