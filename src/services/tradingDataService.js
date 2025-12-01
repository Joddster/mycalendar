import { supabase, remoteSyncAvailable } from './supabaseClient'
import { normalizeRecord } from '../utils/tradingUtils'

const TABLE_NAME = 'trading_days'

export const isRemoteSyncEnabled = remoteSyncAvailable

export const fetchRemoteTradingDays = async () => {
  if (!supabase) return null
  const { data, error } = await supabase.from(TABLE_NAME).select('date, stock, pnl, trades').order('date')
  if (error) {
    console.error('Failed to fetch remote trading days', error)
    return null
  }
  return data?.map((entry) => normalizeRecord(entry)) ?? null
}

export const upsertRemoteTradingRecord = async (record) => {
  if (!supabase) return
  const normalized = normalizeRecord(record)
  const { error } = await supabase.from(TABLE_NAME).upsert(normalized, {
    onConflict: 'date,stock',
  })
  if (error) {
    console.error('Failed to sync record', error)
  }
}

export const upsertManyRemoteRecords = async (records = []) => {
  if (!supabase || !records.length) return
  const normalized = records.map((record) => normalizeRecord(record))
  const { error } = await supabase.from(TABLE_NAME).upsert(normalized, {
    onConflict: 'date,stock',
  })
  if (error) {
    console.error('Failed to bulk sync records', error)
  }
}

