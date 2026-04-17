import { Outlet } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'
import { Footer } from './Footer'
import { Header } from './Header'

export function RootLayout() {
  return (
    <div className="relative min-h-dvh flex flex-col bg-slate-50 text-slate-900 transition duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <Breadcrumbs />
      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-sky-100/60 via-sky-50/10 to-transparent dark:from-slate-900/70 dark:via-slate-950/20 dark:to-transparent" />
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

