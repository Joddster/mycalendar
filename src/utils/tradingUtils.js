import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns'

export const CALENDAR_DAY_FORMAT = 'yyyy-MM-dd'

export const buildCalendarDays = (monthDate) => {
  const start = startOfWeek(startOfMonth(monthDate))
  const end = endOfWeek(endOfMonth(monthDate))
  const days = []
  let cursor = start

  while (!isAfter(cursor, end)) {
    days.push(cursor)
    cursor = addDays(cursor, 1)
  }

  return days
}

export const aggregateByDate = (entries = []) => {
  return entries.reduce((acc, entry) => {
    const key = entry.date
    if (!acc[key]) {
      acc[key] = {
        date: key,
        pnl: 0,
        trades: 0,
        stocks: {},
      }
    }

    acc[key].pnl += Number(entry.pnl) || 0
    acc[key].trades += Number(entry.trades) || 0
    acc[key].stocks[entry.stock] = {
      pnl: Number(entry.pnl) || 0,
      trades: Number(entry.trades) || 0,
    }

    return acc
  }, {})
}

const clampRange = (date, start, end) => {
  if (start && isBefore(date, start)) return false
  if (end && isAfter(date, end)) return false
  return true
}

export const calculateWinLoss = (aggregatedEntries = [], range, referenceDate = new Date()) => {
  let windowStart = null
  let windowEnd = null

  if (range === 'week') {
    windowStart = startOfWeek(referenceDate)
    windowEnd = endOfWeek(referenceDate)
  } else if (range === 'month') {
    windowStart = startOfMonth(referenceDate)
    windowEnd = endOfMonth(referenceDate)
  } else if (range === 'year') {
    windowStart = new Date(referenceDate.getFullYear(), 0, 1)
    windowEnd = new Date(referenceDate.getFullYear(), 11, 31)
  }

  const entries = aggregatedEntries.filter((entry) => {
    if (!entry?.date) return false
    if (range === 'all') return true

    const date = parseISO(entry.date)
    return clampRange(date, windowStart, windowEnd)
  })

  const totals = entries.reduce(
    (acc, entry) => {
      const dateHasTrades = entry.trades > 0 || Object.keys(entry.stocks ?? {}).length > 0
      if (!dateHasTrades) {
        return acc
      }

      acc.total += 1
      if (entry.pnl > 0) {
        acc.wins += 1
      } else if (entry.pnl < 0) {
        acc.losses += 1
      } else {
        acc.flats += 1
      }

      return acc
    },
    { wins: 0, losses: 0, flats: 0, total: 0 },
  )

  const winPct = totals.total ? ((totals.wins / totals.total) * 100).toFixed(1) : '0.0'

  return {
    range,
    wins: totals.wins,
    losses: totals.losses,
    flats: totals.flats,
    total: totals.total,
    winPercentage: Number(winPct),
  }
}

export const formatCurrency = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) return '—'

  const absValue = Math.abs(value)
  const formatter = absValue >= 1000 ? Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }) : Intl.NumberFormat('en-US', { minimumFractionDigits: 0 })
  const formatted = formatter.format(absValue)

  if (value > 0) return `+$${formatted}`
  if (value < 0) return `-$${formatted}`
  return '$0'
}

const splitCompositeStock = (record) => {
  if (!record.stock?.includes('+')) {
    return [record]
  }

  const symbols = record.stock
    .split('+')
    .map((symbol) => symbol.trim())
    .filter(Boolean)

  if (symbols.length <= 1) {
    return [record]
  }

  return symbols.map((symbol) => ({
    ...record,
    stock: symbol,
    pnl: record.pnl / symbols.length,
    trades: record.trades,
  }))
}

export const normalizeRecord = (record) => {
  if (!record?.date || !record?.stock) {
    throw new Error('Record is missing date or stock')
  }

  const isoDate =
    typeof record.date === 'string' ? record.date.slice(0, 10) : format(record.date, CALENDAR_DAY_FORMAT)

  return {
    date: isoDate,
    stock: record.stock.toUpperCase(),
    pnl: Number(record.pnl) || 0,
    trades: Number(record.trades) || 0,
  }
}

export const upsertTradingRecord = (existing = [], nextRecord) => {
  const target = normalizeRecord(nextRecord)
  const expanded = splitCompositeStock(target)

  return expanded.reduce((acc, entry) => {
    const idx = acc.findIndex((item) => item.date === entry.date && item.stock === entry.stock)
    if (idx >= 0) {
      const clone = acc.slice()
      clone[idx] = entry
      return clone
    }
    return [...acc, entry]
  }, existing)
}

export const upsertManyTradingRecords = (existing = [], nextRecords = []) => {
  return nextRecords.reduce((acc, record) => {
    try {
      return upsertTradingRecord(acc, record)
    } catch {
      return acc
    }
  }, existing)
}

