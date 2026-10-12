import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/Toast'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

/** Skrip tema: pasang .dark/.light sebelum render agar tidak kedip. */
const themeScript = `(function(){try{var t=localStorage.getItem('rk-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}else{document.documentElement.classList.add('light')}}catch(e){}})();`

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ruangkolab.vercel.app'),
  title: {
    default: 'RuangKolab: Temukan Lomba, Bentuk Tim, Wujudkan Proyek',
    template: '%s | RuangKolab',
  },
  description: 'Kolaborasi dengan mahasiswa dari berbagai jurusan: temukan lomba kampus, rekrut teman tim, dan wujudkan ide proyek bersama.',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'RuangKolab',
    title: 'RuangKolab: Temukan Lomba, Bentuk Tim, Wujudkan Proyek',
    description: 'Kolaborasi dengan mahasiswa dari berbagai jurusan: temukan lomba kampus, rekrut teman tim, dan wujudkan ide proyek bersama.',
  },
  twitter: {
    card: 'summary',
    title: 'RuangKolab: Temukan Lomba, Bentuk Tim, Wujudkan Proyek',
    description: 'Kolaborasi dengan mahasiswa dari berbagai jurusan: temukan lomba kampus, rekrut teman tim, dan wujudkan ide proyek bersama.',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafaf9' },
    { media: '(prefers-color-scheme: dark)', color: '#0c0a09' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-[100dvh] flex-col bg-stone-50 font-sans text-stone-800 antialiased dark:bg-stone-950 dark:text-stone-200">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
