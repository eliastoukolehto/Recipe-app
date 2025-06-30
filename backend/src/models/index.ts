import User from './user'
import Recipe from './recipe'
import RecipeLike from './recipeLike'

User.hasMany(Recipe)
Recipe.belongsTo(User)

User.belongsToMany(Recipe, { through: 'recipeLike', as: 'likedRecipes' })
Recipe.belongsToMany(User, { through: 'recipeLike', as: 'likedBy' })

export {
  User, Recipe, RecipeLike,
}
