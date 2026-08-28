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
import { useDocumentMetadata } from './hooks/useDocumentMetadata'
import { useSubjects } from './hooks/useSubjects'

// Shape of what we store in each browser history entry, so the back/forward
// buttons can restore exactly which view and subject were active.
interface NavState {
  view: string
  subject: Subject | null
}

// Derives a URL slug from subject.name (the only viable field — Subject has no
// dedicated slug column). Lowercase + spaces→hyphens. Must match sitemap.xml exactly.
function slugify(subject: Subject): string {
  return subject.name.toLowerCase().replace(/\s+/g, '-')
}

// Parses a pathname back to a { view, subjectSlug } pair.
// Anything unrecognized falls back to home.
function pathToView(pathname: string): { view: string; subjectSlug: string | null } {
  if (pathname === '/' || pathname === '') return { view: 'home', subjectSlug: null }
  if (pathname === '/about')     return { view: 'about',     subjectSlug: null }
  if (pathname === '/whats-new') return { view: 'whats-new', subjectSlug: null }
  if (pathname === '/request')   return { view: 'request',   subjectSlug: null }
  const subjectMatch = pathname.match(/^\/subjects\/(.+)$/)
  if (subjectMatch) return { view: 'resources', subjectSlug: subjectMatch[1] }
  return { view: 'home', subjectSlug: null }
}

export default function App() {
  // Lazily initialize from the URL to eliminate flash on non-subject routes.
  // For /subjects/:slug we can't resolve the Subject yet (subjects haven't loaded),
  // but we CAN start in 'resources' so ResourcesView renders its own
  // subjectsLoading skeleton instead of the full homepage flashing in.
  const [currentView, setCurrentView] = useState<string>(() => {
    const { view, subjectSlug } = pathToView(window.location.pathname)
    // /subjects/:slug → start in 'resources' (selectedSubject stays null until
    // the mount useEffect resolves the slug — ResourcesView handles null gracefully
    // by showing its subject grid + loading skeleton while data fetches)
    if (view === 'resources' && subjectSlug) return 'resources'
    return view
  })
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)

  useDocumentMetadata(currentView, selectedSubject)

  // Needed for deep-link resolution on mount (e.g. /subjects/physics)
  const { subjects } = useSubjects()

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

  // On mount: parse the actual URL the user landed on and restore the correct
  // view + subject. Non-subject paths (/about, /, etc.) resolve immediately.
  // /subjects/:slug waits for subjects to load before trying to match.
  useEffect(() => {
    const { view, subjectSlug } = pathToView(window.location.pathname)

    if (view === 'resources' && subjectSlug) {
      if (subjects.length === 0) return // only this branch waits on subjects
      const matched = subjects.find((s) => slugify(s) === subjectSlug)
      if (matched) {
        setSelectedSubject(matched)
        setCurrentView('resources')
        window.history.replaceState({ view: 'resources', subject: matched } as NavState, '', `/subjects/${subjectSlug}`)
      } else {
        // Unknown/stale slug — fall back to home
        setCurrentView('home')
        window.history.replaceState({ view: 'home', subject: null } as NavState, '', '/')
      }
    } else {
      setCurrentView(view)
      const path = view === 'home' ? '/' : `/${view}`
      window.history.replaceState({ view, subject: null } as NavState, '', path)
    }
  }, [subjects])

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

  // Pushes a new browser history entry with a real URL path.
  // NavState shape is unchanged — view + subject are still stored in state.
  const pushHistory = useCallback((view: string, subject: Subject | null) => {
    const path = view === 'resources' && subject
      ? `/subjects/${slugify(subject)}`
      : view === 'home' ? '/'
      : `/${view}`
    console.log('[pushHistory]', { view, subjectName: subject?.name, path })
    window.history.pushState({ view, subject } as NavState, '', path)
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