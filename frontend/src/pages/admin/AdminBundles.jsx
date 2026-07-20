import { useEffect, useState } from 'react'
import { bundles, redemptions } from '../../api/endpoints'

const unitOptions = ['restaurant', 'carwash', 'barbershop']

const initialBundleForm = {
  name: '',
  description: '',
  units_included: [],
  price: '',
  discount_label: '',
  is_active: true,
}

const initialRedemptionForm = {
  bundle: '',
  customer_name: '',
  customer_phone: '',
  revenue_amount: '',
  notes: '',
}

export default function AdminBundles() {
  const [items, setItems] = useState([])
  const [redemptionLog, setRedemptionLog] = useState([])
  const [bundleForm, setBundleForm] = useState(initialBundleForm)
  const [redemptionForm, setRedemptionForm] = useState(initialRedemptionForm)
  const [saving, setSaving] = useState(false)

  function refresh() {
    bundles
      .list()
      .then((data) => setItems(data.results ?? data))
      .catch(() => setItems([]))
    redemptions
      .list()
      .then((data) => setRedemptionLog(data.results ?? data))
      .catch(() => setRedemptionLog([]))
  }

  useEffect(refresh, [])

  function toggleUnit(unit) {
    setBundleForm((prev) => ({
      ...prev,
      units_included: prev.units_included.includes(unit)
        ? prev.units_included.filter((u) => u !== unit)
        : [...prev.units_included, unit],
    }))
  }

  async function handleCreateBundle(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await bundles.create({ ...bundleForm, price: bundleForm.price || null })
      setBundleForm(initialBundleForm)
      refresh()
    } finally {
      setSaving(false)
    }
  }

  async function handleLogRedemption(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await redemptions.create({
        ...redemptionForm,
        bundle: Number(redemptionForm.bundle),
        revenue_amount: redemptionForm.revenue_amount || null,
      })
      setRedemptionForm(initialRedemptionForm)
      refresh()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-bold text-gold">Cross-Unit Bundles</h1>
        <form
          onSubmit={handleCreateBundle}
          className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-tavern-800 p-6 sm:grid-cols-2"
        >
          <input
            required
            placeholder="Bundle name, e.g. Ultimate Groom & Gleam"
            value={bundleForm.name}
            onChange={(e) => setBundleForm({ ...bundleForm, name: e.target.value })}
            className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 sm:col-span-2"
          />
          <textarea
            placeholder="Description"
            value={bundleForm.description}
            onChange={(e) => setBundleForm({ ...bundleForm, description: e.target.value })}
            className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 sm:col-span-2"
          />
          <div className="flex gap-4 sm:col-span-2">
            {unitOptions.map((unit) => (
              <label key={unit} className="flex items-center gap-2 text-sm capitalize text-white/70">
                <input
                  type="checkbox"
                  checked={bundleForm.units_included.includes(unit)}
                  onChange={() => toggleUnit(unit)}
                />
                {unit}
              </label>
            ))}
          </div>
          <input
            placeholder="Price (KES, optional)"
            value={bundleForm.price}
            onChange={(e) => setBundleForm({ ...bundleForm, price: e.target.value })}
            className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
          />
          <input
            placeholder='Discount label, e.g. "Save 20%"'
            value={bundleForm.discount_label}
            onChange={(e) => setBundleForm({ ...bundleForm, discount_label: e.target.value })}
            className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
          />
          <button
            type="submit"
            disabled={saving || bundleForm.units_included.length === 0}
            className="rounded-lg bg-gold py-2 font-semibold text-tavern-900 hover:bg-gold-light disabled:opacity-50 sm:col-span-2"
          >
            {saving ? 'Saving…' : 'Create Bundle'}
          </button>
        </form>

        <div className="mt-6 space-y-2">
          {items.map((bundle) => (
            <div key={bundle.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-tavern-800 p-4">
              <div>
                <p className="font-medium">{bundle.name}</p>
                <p className="text-xs text-white/50">{bundle.units_included?.join(' + ')}</p>
              </div>
              <span className="text-sm text-white/60">{bundle.is_active ? 'Active' : 'Inactive'}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gold">Log a Redemption</h2>
        <p className="mt-1 text-sm text-white/60">
          Record cross-unit conversions manually to track bundle ROI.
        </p>
        <form
          onSubmit={handleLogRedemption}
          className="mt-4 grid gap-4 rounded-2xl border border-white/10 bg-tavern-800 p-6 sm:grid-cols-2"
        >
          <select
            required
            value={redemptionForm.bundle}
            onChange={(e) => setRedemptionForm({ ...redemptionForm, bundle: e.target.value })}
            className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2 sm:col-span-2"
          >
            <option value="">Select bundle…</option>
            {items.map((bundle) => (
              <option key={bundle.id} value={bundle.id}>
                {bundle.name}
              </option>
            ))}
          </select>
          <input
            placeholder="Customer name (optional)"
            value={redemptionForm.customer_name}
            onChange={(e) => setRedemptionForm({ ...redemptionForm, customer_name: e.target.value })}
            className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
          />
          <input
            placeholder="Customer phone (optional)"
            value={redemptionForm.customer_phone}
            onChange={(e) => setRedemptionForm({ ...redemptionForm, customer_phone: e.target.value })}
            className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
          />
          <input
            placeholder="Revenue amount (KES)"
            value={redemptionForm.revenue_amount}
            onChange={(e) => setRedemptionForm({ ...redemptionForm, revenue_amount: e.target.value })}
            className="rounded-lg border border-white/10 bg-tavern-900 px-4 py-2"
          />
          <button
            type="submit"
            disabled={saving || !redemptionForm.bundle}
            className="rounded-lg bg-gold py-2 font-semibold text-tavern-900 hover:bg-gold-light disabled:opacity-50"
          >
            Log Redemption
          </button>
        </form>

        <div className="mt-6 space-y-2">
          {redemptionLog.map((r) => (
            <div key={r.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-tavern-800 p-4 text-sm">
              <span>{r.bundle_name} — {r.customer_name || 'Walk-in'}</span>
              <span className="text-white/50">{new Date(r.redeemed_at).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
