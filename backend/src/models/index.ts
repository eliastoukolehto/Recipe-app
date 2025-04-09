import User from './user'
import Recipe from './recipe'

User.hasMany(Recipe)
Recipe.belongsTo(User)

export {
  User, Recipe,
}
