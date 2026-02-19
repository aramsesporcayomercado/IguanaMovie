// src/components/MovieDetail.tsx
import { useEffect, useState, type FC } from 'react'
import type { Movie, MovieDetail as MovieDetailType } from '../types/movie'
import { tmdb } from '../hooks/useMovies'
import styles from './MovieDetail.module.css'

interface Props {
  movieId: number
  isFavorite: (id: number) => boolean
  onToggleFav: (movie: Movie) => void
  onClose: () => void
}

const MovieDetail: FC<Props> = ({ movieId, isFavorite, onToggleFav, onClose }) => {
  const [movie, setMovie]     = useState<MovieDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(false)
    setMovie(null)
    tmdb.detail(movieId)
      .then(setMovie)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [movieId])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleFav = () => {
    if (!movie) return
    const asMovie: Movie = {
      id:          movie.id,
      title:       movie.title,
      overview:    movie.overview,
      poster:      movie.poster,
      backdrop:    movie.backdrop,
      rating:      movie.rating,
      votes:       movie.votes,
      releaseDate: movie.releaseDate,
      year:        movie.year,
    }
    onToggleFav(asMovie)
  }

  const fav = movie ? isFavorite(movie.id) : false

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Detalle de película"
    >
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose} aria-label="Cerrar">✕</button>

        {loading && (
          <div className={styles.center}>
            <div className={styles.spinner} />
            <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>Cargando...</p>
          </div>
        )}

        {error && (
          <div className={styles.center}>
            <p style={{ color: 'var(--muted)' }}>No se pudo cargar la película 😕</p>
            <button className={styles.retry} onClick={onClose}>Cerrar</button>
          </div>
        )}

        {movie && !loading && (
          <div className={styles.detail}>
            {movie.backdrop && (
              <div
                className={styles.bgImage}
                style={{ backgroundImage: `url(${movie.backdrop})` }}
              />
            )}
            <div className={styles.bgOverlay} />

            <div className={styles.content}>
              <div className={styles.posterCol}>
                {movie.poster ? (
                  <img src={movie.poster} alt={movie.title} className={styles.poster} />
                ) : (
                  <div className={styles.noPoster}>🎬</div>
                )}
                <button
                  className={`${styles.favBtn} ${fav ? styles.favActive : ''}`}
                  onClick={handleFav}
                  aria-pressed={fav}
                >
                  {fav ? '❤️ En Favoritas' : '🤍 Agregar'}
                </button>
              </div>

              <div className={styles.infoCol}>
                <h2 className={styles.title}>{movie.title}</h2>
                {movie.tagline && <p className={styles.tagline}>"{movie.tagline}"</p>}

                <div className={styles.meta}>
                  <span>⭐ {movie.rating}/10</span>
                  <span>🗳 {movie.votes?.toLocaleString()}</span>
                  {movie.runtime && <span>⏱ {movie.runtime} min</span>}
                  {movie.releaseDate && <span>📅 {movie.releaseDate}</span>}
                </div>

                <div className={styles.genres}>
                  {movie.genres.map((g) => (
                    <span key={g} className={styles.genre}>{g}</span>
                  ))}
                </div>

                <p className={styles.overview}>{movie.overview}</p>

                {movie.cast.length > 0 && (
                  <div className={styles.castSection}>
                    <h4 className={styles.subTitle}>Reparto Principal</h4>
                    <div className={styles.castList}>
                      {movie.cast.map((c, i) => (
                        <div key={i} className={styles.castItem}>
                          {c.photo ? (
                            <img src={c.photo} alt={c.name} className={styles.castPhoto} />
                          ) : (
                            <div className={styles.castPlaceholder}>👤</div>
                          )}
                          <span className={styles.castName}>{c.name}</span>
                          <span className={styles.castChar}>{c.character}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {movie.trailer && (
                  <div className={styles.trailerSection}>
                    <h4 className={styles.subTitle}>Trailer</h4>
                    <div className={styles.trailerWrap}>
                      <iframe
                        src={movie.trailer}
                        title={`Trailer de ${movie.title}`}
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovieDetail