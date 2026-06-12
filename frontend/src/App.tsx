import { Navigate, Route, Routes } from 'react-router-dom'
import { RootLayout } from './components/layout/RootLayout'
import { BookDetailPage } from './pages/BookDetailPage'
import { BooksPage } from './pages/BooksPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'

import { HomePage } from './pages/HomePage'
import { InvoicePage } from './pages/InvoicePage'
import { NewsDetailPage } from './pages/NewsDetailPage'
import { NewsPage } from './pages/NewsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { WishlistPage } from './pages/WishlistPage'
import { TrendsPage } from './pages/TrendsPage'
import { CollectionDetailPage } from './pages/CollectionDetailPage'
import { AdminLayout } from './pages/admin/AdminLayout.tsx'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminBooksPage } from './pages/admin/AdminBooksPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminUsersPage } from './pages/admin/AdminUsersPage'
import { AdminProfilePage } from './pages/admin/AdminProfilePage'
import { SupportPage } from './pages/SupportPage'
import { ContactPage } from './pages/ContactPage'
import { PolicyPage } from './pages/PolicyPage'
import { NotificationsPage } from './pages/NotificationsPage'
import { ProfilePage } from './pages/ProfilePage'

export default function App() {
  return (
    <Routes>
      {/* Standalone Authentication Pages */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<RootLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/invoice" element={<InvoicePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/collections/:id" element={<CollectionDetailPage />} />

        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/auth" element={<Navigate to="/login" replace />} />

        {/* Trang mới */}
        <Route path="/support" element={<SupportPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/policy" element={<PolicyPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/profile" element={<ProfilePage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="books" element={<AdminBooksPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  )
}

