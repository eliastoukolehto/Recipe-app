import { z } from 'zod'
import { NewRecipe } from '../types/recipeTypes'

const NewRecipeSchema = z.object({
  name: z.string().max(100).trim(),
  description: z.string().max(1000).trim().optional(),
  ingredientCategories: z.array(z.object({
    name: z.string().max(20).trim().optional(),
    ingredients: z.array(z.object({
      amount: z.number().min(0).max(10000).optional(),
      unit: z.string().max(10).trim().optional(),
      name: z.string().max(20).trim(),
    })).max(100).nonempty(),
  })).max(10).nonempty(),
  steps: z.array(z.string().max(1000).trim()).max(10).nonempty(),
  serving: z.object({
    amount: z.number().max(100),
    per: z.number().max(1000),
    unit: z.string().max(10).trim(),
  }).optional(),
  prepareTime: z.number().max(3000).optional(),
})

export const toNewRecipe = (object: unknown): NewRecipe => {
  return NewRecipeSchema.parse(object)
}
