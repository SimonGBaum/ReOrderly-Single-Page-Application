import { Routes, Route } from 'react-router-dom'
import './App.css'

import ProtectedRoute     from './components/ProtectedRoute/ProtectedRoute'
import Navbar             from './components/Navbar/Navbar'
import OfflineBanner      from './components/OfflineBanner/OfflineBanner'
import VoltronTransition  from './components/VoltronTransition/VoltronTransition'

import Home         from './pages/Home/Home'
import Signup       from './pages/Signup/Signup'
import Login        from './pages/Login/Login'
import CreateOrder  from './pages/CreateOrder/CreateOrder'
import Orders       from './pages/Orders/Orders'
import UpdateOrder  from './pages/UpdateOrder/UpdateOrder'
import TrackOrder   from './pages/TrackOrder/TrackOrder'
import Profile      from './pages/Profile/Profile'
import Contact      from './pages/Contact/Contact'
import ErrorPage    from './pages/ErrorPage/ErrorPage'

export default function App() {
  return (
    <>
      <OfflineBanner />
      <VoltronTransition />
      <Navbar />

      <main style={{ flex: 1, paddingBottom: '4rem' }}>
        <Routes>
          {/* Public */}
          <Route path="/signup"  element={<Signup />} />
          <Route path="/login"   element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/error"   element={<ErrorPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/"               element={<Home />} />
            <Route path="/create"         element={<CreateOrder />} />
            <Route path="/orders"         element={<Orders />} />
            <Route path="/update"         element={<UpdateOrder />} />
            <Route path="/update/:orderId" element={<UpdateOrder />} />
            <Route path="/track"          element={<TrackOrder />} />
            <Route path="/track/:orderId" element={<TrackOrder />} />
            <Route path="/profile"        element={<Profile />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>

      {/* Bottom contact link */}
      <footer className="app-footer">
        <a href="/contact">Contact Us</a>
      </footer>
    </>
  )
}
