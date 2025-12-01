import { useState } from 'react'
import { formatCurrency } from '../utils/tradingUtils'

const StockRow = ({
  symbol,
  isActive,
  summary,
  onClick,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  isDragging,
  isDropTarget,
}) => {
  const label = symbol === 'ALL' ? 'All Stocks' : symbol
  const totalTrades = summary?.sessions ?? 0
  const pnl = summary?.pnl ?? 0

  return (
    <button
      type="button"
      className={`sidebar__stock ${isActive ? 'active' : ''} ${isDragging ? 'dragging' : ''} ${
        isDropTarget ? 'drop-target' : ''
      }`}
      onClick={() => onClick(symbol)}
      draggable={draggable}
      onDragStart={(event) => onDragStart?.(event, symbol)}
      onDragOver={(event) => onDragOver?.(event, symbol)}
      onDrop={(event) => onDrop?.(event, symbol)}
      onDragEnd={onDragEnd}
      onDragEnter={() => onDragEnter?.(symbol)}
      onDragLeave={() => onDragLeave?.(symbol)}
    >
      <div className="sidebar__stock-info">
        <span className="sidebar__stock-label">{label}</span>
        <span className={`sidebar__stock-pnl ${pnl >= 0 ? 'positive' : 'negative'}`}>{formatCurrency(pnl)}</span>
      </div>
      <span className="sidebar__stock-meta">{totalTrades} days tracked</span>
    </button>
  )
}

const Sidebar = ({
  stocks,
  orderedStocks,
  selectedStock,
  onSelect,
  onImport,
  importFeedback,
  stockSummary,
  onReorder,
}) => {
  const [dragging, setDragging] = useState(null)
  const [dropTarget, setDropTarget] = useState(null)
  const displayList = orderedStocks?.length ? orderedStocks : stocks

  const handleDragStart = (event, symbol) => {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', symbol)
    setDragging(symbol)
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }

  const handleDropOnSymbol = (event, symbol) => {
    event.preventDefault()
    event.stopPropagation()
    if (!dragging || dragging === symbol) return
    onReorder?.(dragging, symbol)
    setDragging(null)
    setDropTarget(null)
  }

  const handleDropAtEnd = (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (!dragging) return
    onReorder?.(dragging, null)
    setDragging(null)
    setDropTarget(null)
  }

  const handleDragEnter = (symbol) => {
    if (!dragging || dragging === symbol) return
    setDropTarget(symbol)
  }

  const handleDragLeave = (symbol) => {
    if (dropTarget === symbol) {
      setDropTarget(null)
    }
  }

  const handleDragEnd = () => {
    setDragging(null)
    setDropTarget(null)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <h2>Symbols</h2>
        <p className="sidebar__subhead">Filter the calendar by stock or view everything at once.</p>
      </div>

      <div className="sidebar__list" onDragOver={handleDragOver} onDrop={handleDropAtEnd}>
        {displayList.map((symbol) => (
          <StockRow
            key={symbol}
            symbol={symbol}
            isActive={symbol === selectedStock}
            summary={stockSummary[symbol]}
            onClick={onSelect}
            draggable
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDropOnSymbol}
            onDragEnd={handleDragEnd}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            isDragging={dragging === symbol}
            isDropTarget={dropTarget === symbol}
          />
        ))}
      </div>

      <div className="sidebar__actions">
        <button type="button" className="btn btn-secondary" onClick={onImport}>
          Import JSON history
        </button>
        <p className="sidebar__helper">
          Upload an array of objects with `date`, `stock`, `pnl`, and `trades`. Existing entries are updated automatically.
        </p>
        {importFeedback && (
          <p className={`sidebar__import-feedback ${importFeedback.type}`}>
            {importFeedback.message}
          </p>
        )}
      </div>
    </aside>
  )
}

export default Sidebar

