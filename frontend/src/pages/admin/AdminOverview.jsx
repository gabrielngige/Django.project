import { useEffect, useState } from 'react'
import { analytics } from '../../api/endpoints'

export default function AdminOverview() {
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    analytics.summary().then(setSummary).catch(() => setSummary(null))
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gold">Business Intelligence Overview</h1>
        <button
          onClick={() => window.print()}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm hover:bg-white/5"
        >
          Print Monthly Report
        </button>
      </div>

      {!summary ? (
        <p className="mt-8 text-white/50">Loading analytics…</p>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Bundle ROI & Redemptions</h2>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-tavern-800 text-white/50">
                  <tr>
                    <th className="px-4 py-2">Bundle</th>
                    <th className="px-4 py-2">Redemptions</th>
                    <th className="px-4 py-2">Revenue (KES)</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.bundle_performance.map((row) => (
                    <tr key={row.id} className="border-t border-white/10">
                      <td className="px-4 py-2">{row.name}</td>
                      <td className="px-4 py-2">{row.redemption_count}</td>
                      <td className="px-4 py-2">{row.total_revenue ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-white/80">Social Engagement by Unit</h2>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-tavern-800 text-white/50">
                  <tr>
                    <th className="px-4 py-2">Unit</th>
                    <th className="px-4 py-2">Total Reach</th>
                    <th className="px-4 py-2">Total Engagement</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.social_by_unit.map((row) => (
                    <tr key={row.unit} className="border-t border-white/10">
                      <td className="px-4 py-2 capitalize">{row.unit}</td>
                      <td className="px-4 py-2">{row.total_reach ?? 0}</td>
                      <td className="px-4 py-2">{row.total_engagement ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
