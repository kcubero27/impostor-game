import { type Category } from '@/types'

export const CATEGORIES: readonly Category[] = [
  { id: 'animals', nameKey: 'category.animals' },
  { id: 'food', nameKey: 'category.food' },
  { id: 'sports', nameKey: 'category.sports' },
  { id: 'professions', nameKey: 'category.professions' },
  { id: 'objects', nameKey: 'category.objects' },
  { id: 'places', nameKey: 'category.places' },
  { id: 'technology', nameKey: 'category.technology' },
  { id: 'nature', nameKey: 'category.nature' },
  { id: 'transportation', nameKey: 'category.transportation' },
  { id: 'entertainment', nameKey: 'category.entertainment' },
  { id: 'clothing', nameKey: 'category.clothing' },
  { id: 'household', nameKey: 'category.household' },
] as const

