// src/components/MovieCard.tsx
import type { FC, MouseEvent } from 'react'
import type { Movie } from '../types/movie'
import styles from './MovieCard.module.css'

interface Props {
  movie: Movie
  isFavorite: boolean
  onToggleFav: (movie: Movie) => void
  onOpenDetail: (id: number) => void
}

const MovieCard: FC<Props> = ({ movie, isFavorite, onToggleFav, onOpenDetail }) => {

  const handleCardClick = () => {
    console.log('[MovieCard] click en card, id:', movie.id)
    onOpenDetail(movie.id)
  }

  const handleFav = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onToggleFav(movie)
  }

  const handleDetail = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    console.log('[MovieCard] click en botón Ver más, id:', movie.id)
    onOpenDetail(movie.id)
  }

  return (
    <article className={styles.card} onClick={handleCardClick}>
      <div className={styles.poster}>
        {movie.poster ? (
          <img src={movie.poster} alt={movie.title} />
        ) : (
          <div className={styles.noPoster}><span>🎬</span></div>
        )}

        <div className={styles.overlay}>
          <button
            className={`${styles.favBtn} ${isFavorite ? styles.favActive : ''}`}
            aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            aria-pressed={isFavorite}
            onClick={handleFav}
          >
            {isFavorite ? '❤️' : '🤍'}
          </button>
          <button
            className={styles.detailBtn}
            aria-label="Ver detalles"
            onClick={handleDetail}
          >
            Ver más
          </button>
        </div>

        <div className={styles.rating}>
          ⭐ {movie.rating || 'N/A'}
        </div>
      </div>

      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        {movie.year && <p className={styles.year}>{movie.year}</p>}
      </div>
    </article>
  )
}

export default MovieCard