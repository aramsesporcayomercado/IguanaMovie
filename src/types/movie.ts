// src/types/movie.ts

export interface Movie {
  id: number
  title: string
  overview: string
  poster: string | null
  backdrop: string | null
  rating: number
  votes: number
  releaseDate: string
  year: string
  genreIds?: number[]
}

export interface MovieDetail extends Movie {
  tagline: string | null
  runtime: number | null
  genres: string[]
  budget: number
  revenue: number
  trailer: string | null
  cast: CastMember[]
}

export interface CastMember {
  name: string
  character: string
  photo: string | null
}

export interface MovieListResult {
  results: Movie[]
  totalPages: number
}

export interface SearchResult {
  results: Movie[]
  totalResults: number
}

export type Section = 'trending' | 'popular' | 'toprated' | 'favorites' | 'search'

export type ToastType = 'info' | 'warning' | 'error'

export interface ToastMessage {
  id: number
  msg: string
  type: ToastType
}

export interface FavoritesMap {
  [id: number]: Movie
}