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

export const DELETE_RECIPE = gql`
 mutation deleteRecipe($id: ID!) {
  deleteRecipe(id: $id)
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
    totalLikes
    likedByCurrentUser
    }
  }
`

export const GET_RECIPES = gql`
  query recipes (
    $page: Int!
    $search: String
  ) {
    recipes (
      page: $page
      search: $search
    ) {
    count
    rows {
      id
      name
      description
      user {
        id
        username
      }
      totalLikes
      likedByCurrentUser
    }
    }
  }
`

export const ADD_RECIPE_LIKE = gql`
  mutation likeRecipe($id: ID!) {
    likeRecipe(id: $id) {
      recipeId
      userId
    }
  }
`

export const REMOVE_RECIPE_LIKE = gql`
  mutation removeRecipeLike($id: ID!) {
    removeRecipeLike(id: $id)
  }
`
