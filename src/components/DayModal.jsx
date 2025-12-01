import { useEffect, useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'

const DayModal = ({ isOpen, date, selectedStock, stocks, entries, onClose, onSubmit }) => {
  const [form, setForm] = useState({ stock: '', pnl: '', trades: 0 })

  const readableDate = useMemo(() => {
    if (!date) return ''
    return format(parseISO(date), 'MMMM dd, yyyy')
  }, [date])

  const entriesByStock = useMemo(() => {
    return entries.reduce((acc, entry) => {
      acc[entry.stock] = entry
      return acc
    }, {})
  }, [entries])

  useEffect(() => {
    if (!date) return
    const targetStock = selectedStock === 'ALL' ? stocks.find((symbol) => symbol !== 'ALL') ?? '' : selectedStock
    const existing = entriesByStock[targetStock]

    setForm({
      stock: targetStock,
      pnl: existing?.pnl ?? '',
      trades: existing?.trades ?? 0,
    })
  }, [date, selectedStock, stocks, entriesByStock])

  if (!isOpen) return null

  const handleChange = (evt) => {
    const { name, value } = evt.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (evt) => {
    evt.preventDefault()
    if (!date || !form.stock) return

    onSubmit({
      date,
      stock: form.stock,
      pnl: Number(form.pnl),
      trades: Number(form.trades),
    })
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal">
        <header className="modal__header">
          <div>
            <p className="eyebrow">Update trading day</p>
            <h3>{readableDate}</h3>
          </div>
          <button type="button" className="btn btn-icon" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </header>

        <form className="modal__form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Stock / Symbol</span>
            <input
              name="stock"
              type="text"
              list="stock-options"
              value={selectedStock === 'ALL' ? form.stock : selectedStock}
              onChange={handleChange}
              required
              disabled={selectedStock !== 'ALL'}
            />
            {selectedStock === 'ALL' && (
              <datalist id="stock-options">
                {stocks
                  .filter((symbol) => symbol !== 'ALL')
                  .map((symbol) => (
                    <option key={symbol} value={symbol} />
                  ))}
              </datalist>
            )}
          </label>

          <label className="field">
            <span>Net P&amp;L (USD)</span>
            <input
              name="pnl"
              type="number"
              step="100"
              value={form.pnl}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <span>Number of trades</span>
            <input
              name="trades"
              type="number"
              min="0"
              step="1"
              value={form.trades}
              onChange={handleChange}
              required
            />
          </label>

          <div className="modal__actions">
            <button type="submit" className="btn btn-primary">
              Save day
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>

        {entries.length > 0 && (
          <div className="modal__existing">
            <p className="eyebrow">Existing entries</p>
            <ul>
              {entries.map((entry) => (
                <li key={`${entry.stock}-${entry.date}`}>
                  <strong>{entry.stock}:</strong> {entry.trades} trades, {entry.pnl >= 0 ? '+' : ''}
                  {entry.pnl}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default DayModal