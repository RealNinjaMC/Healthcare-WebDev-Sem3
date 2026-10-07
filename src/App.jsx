import { useEffect, useState } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Book from './pages/Book.jsx'
import Bookings from './pages/Bookings.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'
import { useToast } from './hooks/useToast.js'
import { getUser, signOut } from './lib/api.js'
import { APP } from './config.js'

const PAGES_NEEDING_LOGIN = ['book', 'bookings']

export default function App() {
  const [page, setPage] = useLocalStorage('app:page', 'home')
  const [user, setUser] = useState(null)
  const [checkingUser, setCheckingUser] = useState(true)
  const [chosenItemId, setChosenItemId] = useState(APP.items[0]?.id ?? '')
  const toast = useToast()

  useEffect(() => {
    getUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setCheckingUser(false))
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [page])

  function chooseItem(itemId) {
    setChosenItemId(itemId)
    setPage('book')
  }

  function handleLogin(loggedInUser) {
    setUser(loggedInUser)
    toast.show(`Welcome, ${loggedInUser.name}`)
    if (page === 'login') setPage('book')
  }

  async function handleLogout() {
    await signOut()
    setUser(null)
    setPage('home')
    toast.show('Logged out', 'info')
  }

  function renderPage() {
    if (checkingUser) return <p className="p-10 text-center text-slate-500">Loading…</p>
    if (PAGES_NEEDING_LOGIN.includes(page) && !user) return <Login onLogin={handleLogin} />

    switch (page) {
      case 'book':
        return <Book user={user} setPage={setPage} initialItemId={chosenItemId} />
      case 'bookings':
        return <Bookings user={user} setPage={setPage} />
      case 'login':
        return <Login onLogin={handleLogin} />
      default:
        return <Home setPage={setPage} onChooseItem={chooseItem} />
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar page={page} setPage={setPage} user={user} onLogout={handleLogout} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  )
}
