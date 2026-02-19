// src/components/Header.tsx

import { useState, type FC, type FormEvent } from 'react'
import type { Section } from '../types/movie'
import styles from './Header.module.css'

interface NavItem { id: Section; label: string }

const NAV_ITEMS: NavItem[] = [
  { id: 'trending',  label: '🔥 Tendencias' },
  { id: 'popular',   label: '🎭 Populares'  },
  { id: 'toprated',  label: '🏆 Top Valoradas' },
  { id: 'favorites', label: '❤️ Favoritas'  },
]

interface Props {
  section: Section | 'search'
  onSectionChange: (s: Section) => void
  onSearch: (q: string) => void
  canInstall: boolean
  onInstall: () => void
}

const Header: FC<Props> = ({ section, onSectionChange, onSearch, canInstall, onInstall }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <a
          href="/"
          className={styles.logo}
          onClick={(e) => { e.preventDefault(); onSectionChange('trending') }}
        >
          IGUANA<em>MOVIE</em>
        </a>

        <nav className={styles.nav} aria-label="Secciones principales">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`${styles.navLink} ${section === item.id ? styles.active : ''}`}
              onClick={() => onSectionChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className={styles.actions}>
          <form className={styles.searchForm} onSubmit={handleSubmit} role="search">
            <span className={styles.searchIcon} aria-hidden="true">🔍</span>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="Buscar película..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Buscar película"
            />
          </form>

          {canInstall && (
            <button className={styles.installBtn} onClick={onInstall} aria-label="Instalar app">
              📲 Instalar
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header