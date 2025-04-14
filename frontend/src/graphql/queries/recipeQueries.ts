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

export const GET_RECIPE = gql`
  query recipe (
    $id: ID!
  ) {
    recipe (
      id: $id
    ) {
    id
    name
    description
    ingredientCategories {
      name
      ingredients {
        amount
        name
        unit
      }
    }
    steps
    serving {
      amount
      per
      unit
    }
    prepareTime
    user {
      id
      username
    }
    }
  }
`
