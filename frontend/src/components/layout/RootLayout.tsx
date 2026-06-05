import { Outlet } from 'react-router-dom'
import { Breadcrumbs } from './Breadcrumbs'
import { Footer } from './Footer'
import { Header } from './Header'
import { CompareDrawer } from '../books/CompareDrawer'
import { MockChatWidget } from '../ui/MockChatWidget'

export function RootLayout() {
  return (
    <div className="relative min-h-dvh flex flex-col bg-[var(--page-bg)] text-slate-900 transition duration-300 dark:bg-slate-950 dark:text-slate-100">
      <Header />
      <Breadcrumbs />
      <main className="flex-1 min-h-[65vh]">
        <div className="mx-auto w-full max-w-6xl px-4 py-6">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-gradient-to-b from-amber-100/30 via-amber-50/5 to-transparent dark:from-amber-950/10 dark:via-transparent dark:to-transparent" />
          <Outlet />
        </div>
      </main>
      <Footer />
      <CompareDrawer />
      <MockChatWidget />
    </div>
  )
}

