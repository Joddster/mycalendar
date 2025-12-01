import { useEffect, useMemo, useRef, useState } from 'react'
import { addMonths, format, startOfMonth } from 'date-fns'
import Calendar from './components/Calendar'
import DayModal from './components/DayModal'
import Sidebar from './components/Sidebar'
import StatsPanel from './components/StatsPanel'
import { seedTradingDays } from './data/seedData'
import {
  aggregateByDate,
  buildCalendarDays,
  calculateWinLoss,
  CALENDAR_DAY_FORMAT,
  upsertTradingRecord,
  upsertManyTradingRecords,
} from './utils/tradingUtils'
import {
  fetchRemoteTradingDays,
  isRemoteSyncEnabled,
  upsertManyRemoteRecords,
  upsertRemoteTradingRecord,
} from './services/tradingDataService'
import './App.css'

const STORAGE_KEY = 'trading-performance-calendar'
const STOCK_ORDER_KEY = 'trading-performance-calendar-order'

const loadStoredOrder = () => {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STOCK_ORDER_KEY)
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const App = () => {
  const fileInputRef = useRef(null)
  const [selectedStock, setSelectedStock] = useState('ALL')
  const [statsRange, setStatsRange] = useState('month')
  const [currentMonth, setCurrentMonth] = useState(() => startOfMonth(new Date()))
  const [modalDate, setModalDate] = useState(null)
  const [importFeedback, setImportFeedback] = useState(null)
  const [stockOrder, setStockOrder] = useState(loadStoredOrder)
  const [isRemoteLoading, setIsRemoteLoading] = useState(isRemoteSyncEnabled)

  const getInitialData = () => {
    const normalizedSeed = upsertManyTradingRecords([], seedTradingDays)
    if (typeof window === 'undefined') return normalizedSeed

    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) return normalizedSeed

    try {
      const parsed = JSON.parse(stored)
      return upsertManyTradingRecords([], parsed)
    } catch {
      return normalizedSeed
    }
  }

  const [tradingDays, setTradingDays] = useState(getInitialData)

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tradingDays))
  }, [tradingDays])

  useEffect(() => {
    if (!isRemoteSyncEnabled) return
    let active = true
    const hydrateRemote = async () => {
      try {
        const remoteData = await fetchRemoteTradingDays()
        if (remoteData && active) {
          setTradingDays(remoteData)
          setIsRemoteLoading(false)
          if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteData))
          }
        }
      } catch (error) {
        console.error('Unable to hydrate from remote storage', error)
      } finally {
        if (active) {
          setIsRemoteLoading(false)
        }
      }
    }
    hydrateRemote()
    return () => {
      active = false
    }
  }, [])

  const availableStocks = useMemo(() => {
    const unique = new Set(tradingDays.map((entry) => entry.stock))
    return ['ALL', ...Array.from(unique).sort()]
  }, [tradingDays])

  useEffect(() => {
    setStockOrder((prev) => {
      const filtered = prev.filter((symbol) => availableStocks.includes(symbol))
      const missing = availableStocks.filter((symbol) => !filtered.includes(symbol))
      const combined = [...filtered, ...missing]
      if (combined.length === prev.length && combined.every((symbol, idx) => symbol === prev[idx])) {
        return prev
      }
      return combined
    })
  }, [availableStocks])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!stockOrder.length) return
    window.localStorage.setItem(STOCK_ORDER_KEY, JSON.stringify(stockOrder))
  }, [stockOrder])

  const filteredEntries = useMemo(() => {
    if (selectedStock === 'ALL') return tradingDays
    return tradingDays.filter((entry) => entry.stock === selectedStock)
  }, [tradingDays, selectedStock])

  const aggregatedMap = useMemo(() => aggregateByDate(filteredEntries), [filteredEntries])
  const aggregatedEntries = useMemo(
    () => Object.values(aggregatedMap).sort((a, b) => a.date.localeCompare(b.date)),
    [aggregatedMap],
  )

  const calendarDays = useMemo(() => {
    return buildCalendarDays(currentMonth).map((date) => {
      const iso = format(date, CALENDAR_DAY_FORMAT)
      return {
        date,
        iso,
        summary: aggregatedMap[iso] ?? null,
      }
    })
  }, [currentMonth, aggregatedMap])

  const stats = useMemo(
    () => calculateWinLoss(aggregatedEntries, statsRange, currentMonth),
    [aggregatedEntries, statsRange, currentMonth],
  )

  const orderedStocks = useMemo(() => {
    const seen = new Set()
    const base = stockOrder.length ? stockOrder : availableStocks
    const ordered = []
    base.forEach((symbol) => {
      if (availableStocks.includes(symbol) && !seen.has(symbol)) {
        ordered.push(symbol)
        seen.add(symbol)
      }
    })
    return ordered
  }, [stockOrder, availableStocks])

  const stockSummary = useMemo(() => {
    const map = {}
    const allDates = new Set()

    tradingDays.forEach((entry) => {
      if (!map[entry.stock]) {
        map[entry.stock] = { pnl: 0, dates: new Set() }
      }
      map[entry.stock].pnl += entry.pnl
      map[entry.stock].dates.add(entry.date)
      allDates.add(entry.date)
    })

    const summary = Object.entries(map).reduce((acc, [stock, value]) => {
      acc[stock] = { pnl: value.pnl, sessions: value.dates.size }
      return acc
    }, {})

    summary.ALL = {
      pnl: tradingDays.reduce((total, entry) => total + entry.pnl, 0),
      sessions: allDates.size,
    }

    return summary
  }, [tradingDays])

  const modalEntries = useMemo(() => {
    if (!modalDate) return []
    return filteredEntries.filter((entry) => entry.date === modalDate)
  }, [modalDate, filteredEntries])

  const handleNavigate = (direction) => {
    setCurrentMonth((prev) => {
      if (direction === 'prev') return addMonths(prev, -1)
      if (direction === 'next') return addMonths(prev, 1)
      return startOfMonth(new Date())
    })
  }

  const handleDaySelect = (isoDate) => {
    setModalDate(isoDate)
  }

  const handleModalClose = () => {
    setModalDate(null)
  }

  const handleDaySave = async (payload) => {
    setTradingDays((prev) => upsertTradingRecord(prev, payload))
    setModalDate(null)
    if (isRemoteSyncEnabled) {
      upsertRemoteTradingRecord(payload).catch((error) => {
        console.error('Failed to sync record', error)
      })
    }
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleStockReorder = (fromSymbol, toSymbol) => {
    if (!fromSymbol) return
    setStockOrder((prev) => {
      if (!prev.includes(fromSymbol)) return prev
      const next = prev.filter((symbol) => symbol !== fromSymbol)
      if (!toSymbol) {
        next.push(fromSymbol)
      } else {
        const targetIndex = next.indexOf(toSymbol)
        if (targetIndex === -1) {
          next.push(fromSymbol)
        } else {
          next.splice(targetIndex, 0, fromSymbol)
        }
      }
      return next
    })
  }

  const handleFileImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const raw = await file.text()
      const parsed = JSON.parse(raw)
      if (!Array.isArray(parsed)) {
        throw new Error('Expected an array of trading days')
      }
      setTradingDays((prev) => upsertManyTradingRecords(prev, parsed))
      if (isRemoteSyncEnabled) {
        upsertManyRemoteRecords(parsed).catch((err) => console.error('Failed to sync imported records', err))
      }
      setImportFeedback({ type: 'success', message: `Imported ${parsed.length} days` })
    } catch (error) {
      setImportFeedback({ type: 'error', message: error.message })
    } finally {
      event.target.value = ''
      setTimeout(() => setImportFeedback(null), 4000)
    }
  }

  return (
    <div className="app-shell">
      <Sidebar
        stocks={availableStocks}
        orderedStocks={orderedStocks}
        selectedStock={selectedStock}
        onSelect={setSelectedStock}
        onImport={handleImportClick}
        onReorder={handleStockReorder}
        importFeedback={importFeedback}
        stockSummary={stockSummary}
      />

      <main className="main">
        <header className="hero">
      <div>
            <p className="eyebrow">Day Trading Performance</p>
            <h1>Visualize consistency and discipline</h1>
            <p className="hero__lead">
              Log every session, surface your best symbols, and keep your win / loss percentages visible across weekly, monthly, yearly, and all-time views.
        </p>
            {isRemoteSyncEnabled && (
              <p className="hero__sync">
                {isRemoteLoading ? 'Syncing latest data…' : 'Live data sync enabled'}
              </p>
            )}
      </div>
        </header>

        <StatsPanel stats={stats} range={statsRange} onRangeChange={setStatsRange} selectedStock={selectedStock} />
        <Calendar monthDate={currentMonth} days={calendarDays} onNavigate={handleNavigate} onSelectDay={handleDaySelect} />
      </main>

      <DayModal
        isOpen={Boolean(modalDate)}
        date={modalDate}
        selectedStock={selectedStock}
        stocks={availableStocks}
        entries={modalEntries}
        onClose={handleModalClose}
        onSubmit={handleDaySave}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        hidden
        onChange={handleFileImport}
      />
    </div>
  )
}

export default App
