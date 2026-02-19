// src/components/MovieGrid.tsx

import type { FC } from 'react'
import type { Movie } from '../types/movie'
import MovieCard from './MovieCard'
import styles from './MovieGrid.module.css'

interface Props {
  movies: Movie[]
  loading: boolean
  isFavorite: (id: number) => boolean
  onToggleFav: (movie: Movie) => void
  onOpenDetail: (id: number) => void
  empty?: string
}

const MovieGrid: FC<Props> = ({
  movies,
  loading,
  isFavorite,
  onToggleFav,
  onOpenDetail,
  empty,
}) => {
  if (loading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
        <p className={styles.loadText}>Cargando...</p>
      </div>
    )
  }

  if (!movies.length) {
    return (
      <div className={styles.center}>
        <span className={styles.emptyIcon}>🎬</span>
        <p className={styles.emptyText}>{empty ?? 'No hay películas para mostrar'}</p>
      </div>
    )
  }

  return (
    <div className={styles.grid}>
      {movies.map((m, i) => (
        <div
          key={m.id}
          className={styles.item}
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <MovieCard
            movie={m}
            isFavorite={isFavorite(m.id)}
            onToggleFav={onToggleFav}
            onOpenDetail={onOpenDetail}
          />
        </div>
      ))}
    </div>
  )
}

export default MovieGrid