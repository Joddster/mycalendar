import { Fragment, useMemo } from 'react'
import { format, isSameMonth, isToday } from 'date-fns'
import { CALENDAR_DAY_FORMAT, formatCurrency } from '../utils/tradingUtils'

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const Calendar = ({ monthDate, days, onNavigate, onSelectDay }) => {
  const monthLabel = format(monthDate, 'MMMM yyyy')
  const weeks = useMemo(() => {
    const chunked = []
    for (let i = 0; i < days.length; i += 7) {
      chunked.push(days.slice(i, i + 7))
    }
    return chunked
  }, [days])

  const getWeekTotal = (week) => {
    return week.reduce(
      (acc, day) => {
        if (day.summary) {
          acc.pnl += day.summary.pnl
          if (day.summary.trades > 0) {
            acc.tradingDays += 1
          }
        }
        return acc
      },
      { pnl: 0, tradingDays: 0 },
    )
  }

  return (
    <section className="calendar">
      <header className="calendar__header">
        <div>
          <p className="eyebrow">Calendar View</p>
          <h2>{monthLabel}</h2>
        </div>
        <div className="calendar__actions">
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate('prev')}>
            ← Prev
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate('next')}>
            Next →
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate('today')}>
            Jump to Today
          </button>
        </div>
      </header>

      <div className="calendar__grid-wrapper">
        <div className="calendar__grid">
          {WEEKDAY_LABELS.map((weekday) => (
            <div key={weekday} className="calendar__weekday">
              {weekday}
            </div>
          ))}
          <div className="calendar__weekday calendar__weekday--total">Week Total</div>

          {weeks.map((week, index) => {
            const weekTotal = getWeekTotal(week)
            const weekStatus = weekTotal.pnl > 0 ? 'positive' : weekTotal.pnl < 0 ? 'negative' : ''
            const hasTrades = weekTotal.tradingDays > 0
            return (
              <Fragment key={`week-${index}`}>
                {week.map(({ date, iso, summary }) => {
                  const dayNumber = date.getDate()
                  const activeMonth = isSameMonth(date, monthDate)
                  const today = isToday(date)
                  const pnl = summary?.pnl ?? null
                  const trades = summary?.trades ?? 0
                  const status = pnl > 0 ? 'positive' : pnl < 0 ? 'negative' : ''
                  const showMuted = !activeMonth && summary

                  return (
                    <button
                      type="button"
                      key={iso}
                      className={`calendar__day ${showMuted ? 'muted' : ''} ${status} ${today ? 'today' : ''}`}
                      onClick={() => onSelectDay(iso)}
                    >
                      <div className="calendar__day-header">
                        <span>{dayNumber}</span>
                        {today && <span className="calendar__badge">Today</span>}
                      </div>
                      <div className="calendar__day-body">
                        <p className="calendar__day-pnl">{pnl !== null ? formatCurrency(pnl) : 'No trades'}</p>
                        {pnl !== null && <p className="calendar__day-trades">{trades} trades</p>}
                      </div>
                    </button>
                  )
                })}
                <div className={`calendar__week-total ${weekStatus}`}>
                  <p className="calendar__week-total-label">Week Total</p>
                  <p className="calendar__week-total-value">
                    {hasTrades ? formatCurrency(weekTotal.pnl) : 'No trades'}
                  </p>
                </div>
              </Fragment>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Calendar

