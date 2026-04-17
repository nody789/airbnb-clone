import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ListingDetailPage from './pages/ListingDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookingsPage from './pages/BookingsPage'
import FavoritesPage from './pages/FavoritesPage'
import HostListingsPage from './pages/HostListingsPage'
import NewListingPage from './pages/NewListingPage'
import EditListingPage from './pages/EditListingPage'
import HostBookingsPage from './pages/HostBookingsPage'
import ProfilePage from './pages/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-20">
        <Routes>
          {/* 公開路由 */}
          <Route path="/" element={<HomePage />} />
          <Route path="/listings/:id" element={<ListingDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 私有路由（需登入） */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/host/listings" element={<HostListingsPage />} />
            <Route path="/host/listings/new" element={<NewListingPage />} />
            <Route path="/host/listings/:id/edit" element={<EditListingPage />} />
            <Route path="/host/bookings" element={<HostBookingsPage />} />
          </Route>

          {/* 404：放最後，所有不匹配的路由都會到這裡 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
