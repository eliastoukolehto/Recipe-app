interface Ingredient {
  amount?: number
  unit?: string
  name: string
}

export interface IngredientCategory {
  name?: string
  ingredients: Ingredient[]
}

export interface Serving {
  amount: number
  per: number
  unit: string
}

export interface NewRecipe {
  name: string
  description?: string
  ingredientCategories: IngredientCategory[]
  steps: string[]
  serving?: Serving
  prepareTime?: number
}
