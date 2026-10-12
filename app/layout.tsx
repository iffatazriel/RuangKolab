import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'RuangKolab: Temukan Lomba, Bentuk Tim, Wujudkan Proyek',
  description: 'Kolaborasi dengan mahasiswa dari berbagai jurusan: temukan lomba kampus, rekrut teman tim, dan wujudkan ide proyek bersama.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={geist.variable}>
      <body className="flex min-h-screen flex-col bg-[#fafbfc] font-sans text-slate-800 antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
