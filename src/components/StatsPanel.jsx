const RANGE_LABELS = {
  week: 'Weekly',
  month: 'Monthly',
  year: 'Yearly',
  all: 'All-Time',
}

const StatsPanel = ({ stats, range, onRangeChange, selectedStock }) => {
  const buttons = ['week', 'month', 'year', 'all']

  return (
    <section className="stats">
      <div className="stats__header">
        <div>
          <p className="eyebrow">Win / Loss Consistency</p>
          <h2>{RANGE_LABELS[range]} performance</h2>
          <p className="stats__subtitle">
            Tracking {selectedStock === 'ALL' ? 'all symbols' : selectedStock} by the percentage of profitable trading days.
          </p>
        </div>
        <div className="stats__toggle">
          {buttons.map((value) => (
            <button
              key={value}
              type="button"
              className={`btn btn-toggle ${value === range ? 'active' : ''}`}
              onClick={() => onRangeChange(value)}
            >
              {RANGE_LABELS[value]}
            </button>
          ))}
        </div>
      </div>

      <div className="stats__grid">
        <div className="stats__card highlight">
          <p className="stats__label">Win rate</p>
          <p className="stats__value">{stats.winPercentage}%</p>
          <span className="stats__detail">{stats.wins} / {stats.total} winning days</span>
        </div>
        <div className="stats__card">
          <p className="stats__label">Winning days</p>
          <p className="stats__value">{stats.wins}</p>
          <span className="stats__detail">Positive P&amp;L sessions</span>
        </div>
        <div className="stats__card">
          <p className="stats__label">Losing days</p>
          <p className="stats__value">{stats.losses}</p>
          <span className="stats__detail">Negative P&amp;L sessions</span>
        </div>
        <div className="stats__card">
          <p className="stats__label">Total tracked</p>
          <p className="stats__value">{stats.total}</p>
          <span className="stats__detail">Trading days in range</span>
        </div>
      </div>
    </section>
  )
}

export default StatsPanel


