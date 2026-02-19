// src/hooks/useFavorites.ts

import { useState, useCallback } from 'react'
import type { Movie, FavoritesMap } from '../types/movie'

const KEY = 'cinewave_favorites'

function load(): FavoritesMap {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') as FavoritesMap
  } catch {
    return {}
  }
}

interface UseFavoritesReturn {
  favorites: FavoritesMap
  favoritesList: Movie[]
  isFavorite: (id: number) => boolean
  toggleFavorite: (movie: Movie) => void
}

export function useFavorites(): UseFavoritesReturn {
  const [favorites, setFavorites] = useState<FavoritesMap>(load)

  const isFavorite = useCallback((id: number): boolean => !!favorites[id], [favorites])

  const toggleFavorite = useCallback((movie: Movie): void => {
    setFavorites((prev) => {
      const next = { ...prev }
      if (next[movie.id]) {
        delete next[movie.id]
      } else {
        next[movie.id] = movie
      }
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const favoritesList = Object.values(favorites)

  return { favorites, favoritesList, isFavorite, toggleFavorite }
}