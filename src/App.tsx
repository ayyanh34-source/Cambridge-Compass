import { useState, useEffect, useCallback } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomeView from './components/HomeView'
import ResourcesView from './components/ResourcesView'
import AboutView from './components/AboutView'
import WhatsNewView from './components/WhatsNewView'
import RequestResourceView from './components/RequestResourceView'
import { SearchModal } from './components/SearchModal'
import { ResourcePreviewModal } from './components/ResourcePreviewModal'
import { Subject, ResourceDocument, ResourceRequest, ScreenTab } from './types'
import { INITIAL_REQUESTS } from './data/mockData'

// Shape of what we store in each browser history entry, so the back/forward
// buttons can restore exactly which view and subject were active.
interface NavState {
  view: string
  subject: Subject | null
}

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home')
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [previewDoc, setPreviewDoc] = useState<ResourceDocument | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [requests, setRequests] = useState<ResourceRequest[]>(INITIAL_REQUESTS)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme')
      if (stored === 'dark' || stored === 'light') return stored
    }
    return 'light'
  })

  useEffect(() => {
    const isDark = theme === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', theme)
  }, [theme])

  // On first load, seed the initial history entry so there's always a
  // well-defined state to fall back to if the user hits back all the way.
  useEffect(() => {
    window.history.replaceState({ view: 'home', subject: null } as NavState, '')
  }, [])

  // Listen for browser back/forward and restore whatever view+subject was
  // active at that point in history, instead of doing nothing (old behavior)
  // or reloading back to home (default browser fallback with no history state).
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as NavState | null
      if (state) {
        setCurrentView(state.view)
        setSelectedSubject(state.subject)
      } else {
        setCurrentView('home')
        setSelectedSubject(null)
      }
      setPreviewDoc(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Pushes a new browser history entry any time navigation actually changes
  // the view or subject, so back/forward has something real to step through.
  const pushHistory = useCallback((view: string, subject: Subject | null) => {
    window.history.pushState({ view, subject } as NavState, '')
  }, [])

  const handleToggleTheme = () => {
    const isDark = document.documentElement.classList.toggle('dark')
    const nextTheme = isDark ? 'dark' : 'light'
    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)
  }

  const handleNavigate = (view: string) => {
    setCurrentView(view)
    pushHistory(view, selectedSubject)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSelectSubject = (subject: Subject | null) => {
    setSelectedSubject(subject)
    setCurrentView('resources')
    pushHistory('resources', subject)
    window.scrollTo({ top: 0, behavior: 'smooth' })
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
            onSelectSubject={handleSelectSubject}
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
    </div>
  )
}