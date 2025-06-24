import User from './user'
import Recipe from './recipe'
import RecipeLike from './recipeLike'

User.hasMany(Recipe)
Recipe.belongsTo(User)

User.belongsToMany(Recipe, { through: 'RecipeLike', as: 'likedRecipes' })
Recipe.belongsToMany(User, { through: 'RecipeLike', as: 'likedBy' })

export {
  User, Recipe, RecipeLike,
}
