import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import HomePage from './pages/HomePage'
import OrderListPage from './pages/OrderListPage'
import OrderCreatePage from './pages/OrderCreatePage'
import OrderDetailPage from './pages/OrderDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/orders" element={<OrderListPage />} />
        <Route path="/orders/new" element={<OrderCreatePage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App