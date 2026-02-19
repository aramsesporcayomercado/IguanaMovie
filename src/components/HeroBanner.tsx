// src/components/HeroBanner.tsx
import { useState, useEffect, type FC } from 'react'
import type { Movie } from '../types/movie'
import styles from './HeroBanner.module.css'

interface Props {
  movies: Movie[]
  onOpenDetail: (id: number) => void
  isFavorite: (id: number) => boolean
  onToggleFav: (movie: Movie) => void
}

const HeroBanner: FC<Props> = ({ movies, onOpenDetail, isFavorite, onToggleFav }) => {
  const [current, setCurrent] = useState(0)
  const featured = movies.slice(0, 6)

  // Auto-advance
  useEffect(() => {
    if (!featured.length) return
    const t = setInterval(() => {
      setCurrent((c) => (c + 1) % featured.length)
    }, 5000)
    return () => clearInterval(t)
  }, [featured.length])

  if (!featured.length) return null

  const movie = featured[current]

  return (
    <div className={styles.hero}>
      {/* Background */}
      {featured.map((m, i) => (
        <div
          key={m.id}
          className={`${styles.bg} ${i === current ? styles.bgActive : ''}`}
          style={{ backgroundImage: `url(${m.backdrop ?? m.poster})` }}
        />
      ))}
      <div className={styles.overlay} />

      {/* Content */}
      <div className={styles.content}>
        <div className={styles.info}>
          <div className={styles.badge}>⭐ {movie.rating} / 10</div>
          <h2 className={styles.title}>{movie.title}</h2>
          <p className={styles.year}>{movie.year}</p>
          <p className={styles.overview}>{movie.overview}</p>
          <div className={styles.actions}>
            <button className={styles.btnDetail} onClick={() => onOpenDetail(movie.id)}>
              Ver detalles
            </button>
            <button
              className={`${styles.btnFav} ${isFavorite(movie.id) ? styles.btnFavActive : ''}`}
              onClick={() => onToggleFav(movie)}
            >
              {isFavorite(movie.id) ? '❤️' : '🤍'}
            </button>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className={styles.dots}>
        {featured.map((_, i) => (
          <button
            key={i}
            className={`${styles.dot} ${i === current ? styles.dotActive : ''}`}
            onClick={() => setCurrent(i)}
            aria-label={`Ir a película ${i + 1}`}
          />
        ))}
      </div>

      {/* Arrows */}
      <button
        className={`${styles.arrow} ${styles.arrowLeft}`}
        onClick={() => setCurrent((c) => (c - 1 + featured.length) % featured.length)}
        aria-label="Anterior"
      >‹</button>
      <button
        className={`${styles.arrow} ${styles.arrowRight}`}
        onClick={() => setCurrent((c) => (c + 1) % featured.length)}
        aria-label="Siguiente"
      >›</button>
    </div>
  )
}

export default HeroBanner