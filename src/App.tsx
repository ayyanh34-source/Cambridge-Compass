import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomeView from './components/HomeView'
import ResourcesView from './components/ResourcesView'
import AboutView from './components/AboutView'
import WhatsNewView from './components/WhatsNewView'
import RequestResourceView from './components/RequestResourceView'
import { SearchModal } from './components/SearchModal'
import { ResourcePreviewModal } from './components/ResourcePreviewModal'
import { LoginModal } from './components/LoginModal'
import { Subject, ResourceDocument, ResourceRequest, UserProfile, ScreenTab } from './types'
import { INITIAL_REQUESTS } from './data/mockData'

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home')
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [previewDoc, setPreviewDoc] = useState<ResourceDocument | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [requests, setRequests] = useState<ResourceRequest[]>(INITIAL_REQUESTS)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark' || stored === 'light') return stored
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark'
      }
    }
    return 'light'
  })

  useEffect(() => {
    const isDark = theme === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', theme)
  }, [theme])

  const handleToggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    const nextTheme = isDark ? 'dark' : 'light'
    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)
  }
  const [user, setUser] = useState<UserProfile>({
    name: 'Alex Vance',
    email: 'alex.vance@cambridge-prep.edu',
    role: 'Student',
    isLoggedIn: false,
    activeSubjects: [],
    recentlyViewed: [],
    pendingRequests: [],
    monthlyExploredCount: 14,
  })

  const handleNavigate = (view: string) => {
    setCurrentView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectSubject = (subject: Subject | null) => {
    setSelectedSubject(subject)
    setCurrentView('resources')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLogin = (email: string, name: string) => {
    setUser((prev) => ({
      ...prev,
      name,
      email,
      isLoggedIn: true,
    }))
  }

  const handleToggleAuth = () => {
    setUser((prev) => ({
      ...prev,
      isLoggedIn: !prev.isLoggedIn,
    }))
  }

  const handleAddRequest = (newReq: ResourceRequest) => {
    setRequests((prev) => [newReq, ...prev])
  }

  // Function to render the active view based on user navigation
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView
            onSelectSubject={handleSelectSubject}
            onNavigate={(tab: ScreenTab) => handleNavigate(tab)}
          />
        )
      case 'resources':
        return (
          <ResourcesView
            selectedSubject={selectedSubject}
            onSelectSubject={setSelectedSubject}
            onPreviewDocument={(doc) => setPreviewDoc(doc)}
          />
        )
      case 'about':
        return <AboutView onNavigate={(tab: ScreenTab) => handleNavigate(tab)} />
      case 'whats-new':
        return <WhatsNewView onPreviewDocument={(doc) => setPreviewDoc(doc)} />
      case 'request':
        return (
          <RequestResourceView
            requests={requests}
            onSubmitRequest={handleAddRequest}
            userEmail={user.email}
          />
        )
      default:
        return (
          <HomeView
            onSelectSubject={handleSelectSubject}
            onNavigate={(tab: ScreenTab) => handleNavigate(tab)}
          />
        )
    }
  }

  return (
    <div className={`min-h-screen flex flex-col bg-background text-foreground ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Navbar receives the view switcher function */}
      <Navbar
        currentView={currentView}
        setCurrentView={handleNavigate}
        currentTab={currentView as ScreenTab}
        onNavigate={(tab: ScreenTab) => handleNavigate(tab)}
        onOpenSearch={() => setIsSearchOpen(true)}
        user={user}
        onToggleAuth={handleToggleAuth}
        onOpenLoginModal={() => setIsLoginOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-grow">
        {renderView()}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab: ScreenTab) => handleNavigate(tab)}
        onOpenLoginModal={() => setIsLoginOpen(true)}
        isLoggedIn={user.isLoggedIn}
      />

      {/* Global Interactive Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSubject={(subject) => {
          handleSelectSubject(subject)
          setIsSearchOpen(false)
        }}
        onSelectDocument={(doc) => {
          setPreviewDoc(doc)
          setIsSearchOpen(false)
        }}
      />

      <ResourcePreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}