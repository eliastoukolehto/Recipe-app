const recipeTypeDefs = /* GraphQL */`
  type Recipe {
    id: ID!
    name: String!
    description: String
    ingredientCategories: [IngredientCategory!]!
    steps: [String!]!
    serving: Serving
    prepareTime: Int
    user: User!
    totalLikes: Int
    likedByCurrentUser: Boolean!
  }
  type IngredientCategory {
    name: String
    ingredients: [Ingredient!]!
  }
  type Ingredient {
    amount: Float
    unit: String
    name: String!
  }
  type Serving {
    amount: Int!
    per: Int!
    unit: String!
  }
  type RecipeListPage {
    count: Int
    rows: [Recipe]
  } 
  type RecipeLike {
    userId: ID!
    recipeId: ID!
  }
  input IngredientCategoryInput {
    name: String
    ingredients: [IngredientInput!]!
  }
  input IngredientInput {
    amount: Float
    unit: String
    name: String!
  }
  input ServingInput {
    amount: Int!
    per: Int!
    unit: String!
  }
  extend type Query {
    recipes(
      page: Int!
      search: String
    ): RecipeListPage
    recipe(
      id: ID!
    ): Recipe
  }
  extend type Mutation {
    createRecipe(
      name: String!
      description: String
      ingredientCategories: [IngredientCategoryInput!]!
      steps: [String!]!
      serving: ServingInput
      prepareTime: Int
    ): Recipe
    deleteRecipe(id: ID!): Boolean
    likeRecipe(id: ID!): RecipeLike
    removeRecipeLike(id: ID!): Boolean
  }
`

export default recipeTypeDefs
