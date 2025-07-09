import { SafeUser } from './user'

export interface Ingredient {
  amount?: number
  unit?: string
  name: string
}

export interface IngredientCategory {
  name?: string
  ingredients: Ingredient[]
}

interface Serving {
  amount: number
  per: number
  unit: string
}

export interface Recipe {
  id: number
  name: string
  description?: string
  ingredientCategories: IngredientCategory[]
  steps: string[]
  serving?: Serving
  prepareTime?: number
  user: SafeUser
  likedByCurrentUser: boolean
  totalLikes: number
}

export type RecipeFromInputs = Omit<Recipe, 'user' | 'id' | 'likedByCurrentUser' | 'totalLikes'>

export type RecipeListItem = Omit<Recipe, 'ingredientCategories' | 'steps'>
