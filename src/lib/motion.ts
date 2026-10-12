/**
 * Token motion RuangKolab.
 * Semua komponen bermotion wajib memakai token dari sini, bukan angka
 * lepas, agar ritme gerak konsisten di seluruh aplikasi.
 *
 * Prinsip: setiap animasi wajib punya alasan (hierarki, urutan cerita,
 * umpan balik, atau perubahan state). Animasi tanpa alasan dihapus.
 * Hanya transform dan opacity yang dianimasikan.
 */
import type { Transition, Variants } from 'motion/react'

/** Easing keluar standar untuk semua transisi komponen. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Pegas standar (dipakai untuk scale/badge/magnetik). */
export const SPRING: Transition = { type: 'spring', stiffness: 100, damping: 20 }

/** Durasi mikro: hover, tekan, umpan balik kecil. */
export const D_MICRO = 0.18
/** Durasi transisi komponen: fade, geser, ganti state. */
export const D_COMPONENT = 0.3
/** Durasi reveal section: hero, kartu masuk. */
export const D_REVEAL = 0.6
/** Jeda antar item dalam satu kelompok stagger. */
export const STAGGER_STEP = 0.06
/** Batas item yang di-stagger; sisanya muncul bersamaan. */
export const STAGGER_MAX = 6

/** Fade + naik 24px: masuk konten per blok. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: D_REVEAL, ease: EASE_OUT },
  },
}

/** Fade murni: elemen yang tidak perlu berpindah posisi. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: D_COMPONENT, ease: EASE_OUT } },
}

/** Scale dari 0.96: badge, angka berganti, elemen kecil. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: SPRING },
}

/** Wadah stagger: anak berturut-turut, maks STAGGER_MAX item. */
export function staggerContainer(itemCount: number, step = STAGGER_STEP): Variants {
  return {
    hidden: {},
    show: {
      transition: {
        staggerChildren: itemCount > STAGGER_MAX ? 0 : step,
      },
    },
  }
}

/** Viewport default whileInView: sekali, saat 30% terlihat. */
export const VIEWPORT_ONCE = { once: true, amount: 0.3 } as const
