// src/App.tsx
import { useState, useEffect, useCallback, type FC } from 'react'
import type { Movie, Section } from './types/movie'
import { tmdb } from './hooks/useMovies'
import { useFavorites } from './hooks/useFavorites'
import { useInstallPWA } from './hooks/useInstallPWA'
import { ToastProvider, useToast } from './components/Toast'
import Header from './components/Header'
import HeroBanner from './components/HeroBanner'
import MovieGrid from './components/MovieGrid'
import MovieDetail from './components/MovieDetail'
import styles from './App.module.css'

const AppInner: FC = () => {
  const toast                                         = useToast()
  const { isFavorite, toggleFavorite, favoritesList } = useFavorites()
  const { canInstall, install }                       = useInstallPWA()

  const [section, setSection]         = useState<Section>('trending')
  const [isSearch, setIsSearch]       = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [movies, setMovies]           = useState<Movie[]>([])
  const [loading, setLoading]         = useState(true)
  const [page, setPage]               = useState(1)
  const [totalPages, setTotalPages]   = useState(1)
  const [selectedId, setSelectedId]   = useState<number | null>(null)
  const [isOnline, setIsOnline]       = useState(navigator.onLine)

  // ── Debug: log cada vez que selectedId cambia ──────────────────
  useEffect(() => {
    console.log('[App] selectedId cambió a:', selectedId)
  }, [selectedId])

  useEffect(() => {
    const up   = () => { setIsOnline(true);  toast('🟢 Conexión restaurada') }
    const down = () => { setIsOnline(false); toast('🔴 Sin conexión', 'warning') }
    window.addEventListener('online',  up)
    window.addEventListener('offline', down)
    return () => {
      window.removeEventListener('online',  up)
      window.removeEventListener('offline', down)
    }
  }, [toast])

  const loadData = useCallback(async (
    sec: Section, pg: number, query: string, searching: boolean,
  ) => {
    if (sec === 'favorites') { setLoading(false); return }
    setLoading(true)
    try {
      let results: Movie[] = []
      let pages = 1

      if (searching && query) {
        const data = await tmdb.search(query, pg)
        results = data.results
        pages   = Math.ceil(data.totalResults / 20)
      } else if (sec === 'trending') {
        results = await tmdb.trending()
      } else if (sec === 'popular') {
        const data = await tmdb.popular(pg)
        results = data.results; pages = data.totalPages
      } else if (sec === 'toprated') {
        const data = await tmdb.topRated(pg)
        results = data.results; pages = data.totalPages
      }

      setMovies(results)
      setTotalPages(Math.min(pages, 20))
    } catch {
      toast('Error al cargar las películas', 'error')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadData(section, page, searchQuery, isSearch)
  }, [section, page, searchQuery, isSearch, loadData])

  const handleSectionChange = (sec: Section) => {
    setSection(sec); setIsSearch(false); setSearchQuery(''); setPage(1)
  }

  const handleSearch = (q: string) => {
    setIsSearch(true); setSearchQuery(q); setPage(1)
  }

  const handleToggleFav = (movie: Movie) => {
    const wasFav = isFavorite(movie.id)
    toggleFavorite(movie)
    toast(wasFav ? 'Eliminado de favoritas' : '❤️ Agregado a favoritas')
  }

  // ── Handler con log de debug ───────────────────────────────────
  const handleOpenDetail = (id: number) => {
    console.log('[App] handleOpenDetail llamado con id:', id)
    setSelectedId(id)
  }

  const handleCloseDetail = () => {
    console.log('[App] handleCloseDetail llamado')
    setSelectedId(null)
  }

  const displayedMovies = section === 'favorites' ? favoritesList : movies
  const activeSection: Section | 'search' = isSearch ? 'search' : section
  const showBanner = !isSearch && section !== 'favorites' && movies.length > 0

  const sectionTitles: Record<string, string> = {
    trending:  '🔥 Tendencias de la Semana',
    popular:   '🎭 Películas Populares',
    toprated:  '🏆 Las Mejor Valoradas',
    favorites: `❤️ Mis Favoritas (${favoritesList.length})`,
    search:    `🔍 "${searchQuery}"`,
  }

  const hasPagination =
    (isSearch || section === 'popular' || section === 'toprated') && totalPages > 1

  return (
    <div className={styles.app}>
      {!isOnline && (
        <div className={styles.offlineBanner}>
          📡 Sin conexión — mostrando contenido guardado
        </div>
      )}

      <Header
        section={activeSection}
        onSectionChange={handleSectionChange}
        onSearch={handleSearch}
        canInstall={canInstall}
        onInstall={install}
      />

      {showBanner && !loading && (
        <HeroBanner
          movies={movies}
          onOpenDetail={handleOpenDetail}
          isFavorite={isFavorite}
          onToggleFav={handleToggleFav}
        />
      )}

      <main className={styles.main} aria-live="polite">
        <h1 className={styles.sectionTitle}>
          {sectionTitles[activeSection] ?? ''}
        </h1>

        <MovieGrid
          movies={displayedMovies}
          loading={loading}
          isFavorite={isFavorite}
          onToggleFav={handleToggleFav}
          onOpenDetail={handleOpenDetail}
          empty={
            section === 'favorites'
              ? 'Aún no tienes favoritas. ¡Agrega algunas! 🎬'
              : undefined
          }
        />

        {hasPagination && !loading && (
          <div className={styles.pagination}>
            {page > 1 && (
              <button className={styles.pageBtn}
                onClick={() => { setPage((p) => p - 1); window.scrollTo(0, 0) }}>
                ← Anterior
              </button>
            )}
            <span className={styles.pageInfo}>Página {page} de {totalPages}</span>
            {page < totalPages && (
              <button className={styles.pageBtn}
                onClick={() => { setPage((p) => p + 1); window.scrollTo(0, 0) }}>
                Siguiente →
              </button>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>
          Datos de{' '}
          <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">
            TMDB
          </a>{' '}
          — IguanaMovie PWA &copy; 2024
        </p>
      </footer>

      {/* Modal — renderiza solo si selectedId no es null */}
      {selectedId !== null && (
        <MovieDetail
          movieId={selectedId}
          isFavorite={isFavorite}
          onToggleFav={handleToggleFav}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  )
}

const App: FC = () => (
  <ToastProvider>
    <AppInner />
  </ToastProvider>
)

export default App