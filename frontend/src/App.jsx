import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import PublicLayout from './components/PublicLayout'
import AdminLayout from './components/AdminLayout'

import Home from './pages/public/Home'
import UnitPage from './pages/public/UnitPage'
import EventsPage from './pages/public/EventsPage'
import BundlesPage from './pages/public/BundlesPage'

import AdminLogin from './pages/admin/AdminLogin'
import AdminOverview from './pages/admin/AdminOverview'
import AdminContentStudio from './pages/admin/AdminContentStudio'
import AdminEvents from './pages/admin/AdminEvents'
import AdminBundles from './pages/admin/AdminBundles'
import AdminOfferings from './pages/admin/AdminOfferings'
import AdminGallery from './pages/admin/AdminGallery'
import AdminSocialLogs from './pages/admin/AdminSocialLogs'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/restaurant" element={<UnitPage unit="restaurant" title="Restaurant & Entertainment" />} />
            <Route path="/carwash" element={<UnitPage unit="carwash" title="Premium Carwash" />} />
            <Route path="/barbershop" element={<UnitPage unit="barbershop" title="Premium Barbershop" />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/bundles" element={<BundlesPage />} />
          </Route>

          <Route path="/hub/login" element={<AdminLogin />} />
          <Route
            path="/hub"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="content-studio" element={<AdminContentStudio />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="bundles" element={<AdminBundles />} />
            <Route path="offerings" element={<AdminOfferings />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="social-logs" element={<AdminSocialLogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
