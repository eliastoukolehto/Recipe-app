export const createRecipeQuery = /* GraphQL */`
  mutation createRecipe(
    $name: String!
    $description: String
    $ingredientCategories: [IngredientCategoryInput!]!
    $steps: [String!]!,
    $serving: ServingInput,
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
    name
    description
    totalLikes
    likedByCurrentUser
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

export const recipeLikesQuery = /* GraphQL */`
  query recipe( $id: ID! ) { recipe ( id: $id ) { totalLikes likedByCurrentUser } }
`

export const deleteRecipeQuery = /* GraphQL */`
  mutation deleteRecipe( $id: ID! ) { deleteRecipe ( id: $id ) }
`

export const recipesQuery = /* GraphQL */`
  query recipes( $search: String ) { recipes ( page: 0, search: $search ) { count rows { name } } }
`

export const likeRecipeQuery = /* GraphQL */`
  mutation likeRecipe( $id: ID! ) { likeRecipe ( id: $id ) { recipeId, userId }}
`

export const removeRecipeLikeQuery = /* GraphQL */`
  mutation removeRecipeLike( $id: ID! ) { removeRecipeLike ( id: $id ) }
`
