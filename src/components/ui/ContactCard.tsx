'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { LockSimple, WhatsappLogo, ArrowSquareOut } from '@phosphor-icons/react/dist/ssr'
import { EASE_OUT, SPRING, D_COMPONENT } from '@/lib/motion'

interface Props {
  /** Nomor WhatsApp pemilik postingan. Hanya diisi server jika pengajuan sudah diterima. */
  whatsapp: string | null
  /** Nama pemilik postingan untuk penjelasan kontak */
  ownerName: string
  /** True bila pengajuan viewer sudah diterima (terlepas dari ada tidaknya nomor). */
  accepted?: boolean
}

function waLink(nomor: string) {
  return `https://wa.me/${nomor.replace(/\D/g, '').replace(/^0/, '62')}`
}

/** Kontak WhatsApp: terkunci sampai pengajuan diterima, lalu terbuka dengan animasi. */
export function ContactCard({ whatsapp, ownerName, accepted = false }: Props) {
  const reduce = useReducedMotion()
  const open = !!whatsapp
  const acceptedTanpaNomor = accepted && !whatsapp

  return (
    <AnimatePresence mode="wait" initial={false}>
      {!open && !acceptedTanpaNomor ? (
        <motion.section
          key="terkunci"
          aria-labelledby="kontak-terkunci"
          className="rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-900 p-5"
          exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
          transition={{ duration: D_COMPONENT, ease: EASE_OUT }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-400 ring-1 ring-stone-200 dark:ring-stone-700">
              <LockSimple size={20} weight="bold" />
            </div>
            <div className="min-w-0">
              <h2 id="kontak-terkunci" className="text-sm font-bold text-stone-900 dark:text-stone-100">
                Kontak WhatsApp terkunci
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                Nomor {ownerName} akan terbuka setelah pengajuanmu diterima. Ajukan gabung dulu, lalu tunggu balasan.
              </p>
            </div>
          </div>
        </motion.section>
      ) : acceptedTanpaNomor ? (
        <motion.section
          key="diterima-tanpa-nomor"
          aria-labelledby="kontak-kosong"
          className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-5"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-stone-900 text-amber-700 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800">
              <WhatsappLogo size={22} weight="fill" />
            </div>
            <div className="min-w-0">
              <h2 id="kontak-kosong" className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Pengajuanmu diterima
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-amber-900 dark:text-amber-200">
                {ownerName} belum menyimpan nomor WhatsApp di profilnya. Minta ia melengkapinya lewat halaman profil agar kamu bisa menghubunginya.
              </p>
            </div>
          </div>
        </motion.section>
      ) : (
        <motion.section
          key="terbuka"
          aria-labelledby="kontak-terbuka"
          className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-5"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT }}
        >
          <div className="flex items-start gap-3">
            {/* Ikon berganti dengan putar kecil: momen kontak terbuka */}
            <motion.div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-stone-900 text-emerald-700 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800"
              initial={reduce ? false : { rotate: -25, scale: 0.7 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={SPRING}
            >
              <WhatsappLogo size={22} weight="fill" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <h2 id="kontak-terbuka" className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                Pengajuanmu diterima
              </h2>
              <p className="mt-1 text-sm text-emerald-900 dark:text-emerald-200">
                Hubungi {ownerName} lewat WhatsApp: <span className="font-semibold">{whatsapp}</span>
              </p>
              <motion.a
                href={waLink(whatsapp!)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800 active:scale-[0.98]"
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.15 }}
              >
                Buka WhatsApp
                <ArrowSquareOut size={16} weight="bold" />
              </motion.a>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
