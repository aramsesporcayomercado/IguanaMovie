// src/hooks/useMovies.ts

import type { Movie, MovieDetail, MovieListResult, SearchResult, CastMember } from '../types/movie'

const TMDB_BASE   = 'https://api.themoviedb.org/3'
const TMDB_IMG    = 'https://image.tmdb.org/t/p/w500'
const TMDB_IMG_LG = 'https://image.tmdb.org/t/p/w1280'
const TMDB_IMG_OG = 'https://image.tmdb.org/t/p/original'

// ⚠️  Pon tu API key de TMDB en .env → VITE_TMDB_API_KEY
// Gratis en: https://www.themoviedb.org/settings/api (solo email, sin tarjeta)
const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string

async function tmdbGet<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${endpoint}`)
  url.searchParams.set('api_key', API_KEY)
  url.searchParams.set('language', 'es-MX')
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`TMDB error ${res.status}: ${endpoint}`)
  return res.json() as Promise<T>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatMovie(m: any): Movie {
  return {
    id:          m.id,
    title:       m.title ?? 'Sin título',
    overview:    m.overview ?? 'Sin descripción.',
    poster:      m.poster_path   ? `${TMDB_IMG}${m.poster_path}`    : null,
    backdrop:    m.backdrop_path ? `${TMDB_IMG_LG}${m.backdrop_path}` : null,
    rating:      parseFloat((m.vote_average ?? 0).toFixed(1)),
    votes:       m.vote_count ?? 0,
    releaseDate: m.release_date ?? '',
    year:        m.release_date?.split('-')[0] ?? '',
    genreIds:    m.genre_ids ?? [],
  }
}

export const tmdb = {
  async trending(): Promise<Movie[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = await tmdbGet<{ results: any[] }>('/trending/movie/week')
    return d.results.map(formatMovie)
  },

  async popular(page = 1): Promise<MovieListResult> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = await tmdbGet<{ results: any[]; total_pages: number }>('/movie/popular', { page })
    return { results: d.results.map(formatMovie), totalPages: d.total_pages }
  },

  async topRated(page = 1): Promise<MovieListResult> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = await tmdbGet<{ results: any[]; total_pages: number }>('/movie/top_rated', { page })
    return { results: d.results.map(formatMovie), totalPages: d.total_pages }
  },

  async search(query: string, page = 1): Promise<SearchResult> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const d = await tmdbGet<{ results: any[]; total_results: number }>('/search/movie', { query, page })
    return { results: d.results.map(formatMovie), totalResults: d.total_results }
  },

  async detail(id: number): Promise<MovieDetail> {
    const d = await tmdbGet<{
      id: number; title: string; tagline: string; overview: string
      poster_path: string | null; backdrop_path: string | null
      vote_average: number; vote_count: number; runtime: number | null
      release_date: string; genres: { name: string }[]
      budget: number; revenue: number
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      videos: { results: any[] }; credits: { cast: any[] }
    }>(`/movie/${id}`, { append_to_response: 'credits,videos' })

    const trailer = d.videos?.results?.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    )

    const cast: CastMember[] = (d.credits?.cast ?? []).slice(0, 8).map((c) => ({
      name:      c.name as string,
      character: c.character as string,
      photo:     c.profile_path ? `${TMDB_IMG}${c.profile_path}` : null,
    }))

    return {
      id:          d.id,
      title:       d.title,
      tagline:     d.tagline || null,
      overview:    d.overview,
      poster:      d.poster_path   ? `${TMDB_IMG}${d.poster_path}`    : null,
      backdrop:    d.backdrop_path ? `${TMDB_IMG_OG}${d.backdrop_path}` : null,
      rating:      parseFloat((d.vote_average ?? 0).toFixed(1)),
      votes:       d.vote_count,
      runtime:     d.runtime ?? null,
      releaseDate: d.release_date,
      year:        d.release_date?.split('-')[0] ?? '',
      genres:      d.genres?.map((g) => g.name) ?? [],
      budget:      d.budget,
      revenue:     d.revenue,
      trailer:     trailer ? `https://www.youtube.com/embed/${trailer.key}?rel=0` : null,
      cast,
    }
  },
}