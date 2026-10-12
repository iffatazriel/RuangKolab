'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { ReportTarget } from '@/lib/types'

interface Props {
  targetType: ReportTarget
  targetId: string
}

export function ReportButton({ targetType, targetId }: Props) {
  const [open, setOpen] = useState(false)
  const [alasan, setAlasan] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function submit() {
    if (!alasan.trim()) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setLoading(false); return }
    await supabase.from('reports').insert({
      reporter_id: user.id,
      target_type: targetType,
      target_id: targetId,
      alasan: alasan.trim(),
    })
    setLoading(false)
    setDone(true)
    setOpen(false)
  }

  if (done) return <span className="text-xs text-green-600">Dilaporkan</span>

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-gray-400 hover:text-red-500"
        type="button"
      >
        Laporkan
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h3 className="font-semibold text-gray-900">Laporkan</h3>
            <textarea
              className="mt-3 w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
              rows={3}
              placeholder="Jelaskan alasanmu..."
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
            />
            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={submit}
                disabled={loading || !alasan.trim()}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-700 disabled:opacity-50"
              >
                Kirim Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
