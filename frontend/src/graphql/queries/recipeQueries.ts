import { gql } from '@apollo/client'

export const ADD_RECIPE = gql`
  mutation createRecipe(
    $name: String!, 
    $description: String, 
    $ingredientCategories: [IngredientCategoryInput!]!
    $steps: [String!]!
    $serving: ServingInput
    $prepareTime: Int
  ) {
    createRecipe (
    name: $name
    description: $description
    ingredientCategories: $ingredientCategories
    steps: $steps
    serving: $serving
    prepareTime: $prepareTime
    ) {
    id
    }
  }
`
