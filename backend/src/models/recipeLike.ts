import {
  Model, DataTypes, InferAttributes, InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize'
import db from '../utils/db'
import User from './user'
import Recipe from './recipe'

const sequelize = db.sequelize

class RecipeLike extends Model<InferAttributes<RecipeLike>, InferCreationAttributes<RecipeLike>> {
  declare recipeId: ForeignKey<Recipe['id']>
  declare userId: ForeignKey<User['id']>
  declare createdAt: CreationOptional<Date>
}

RecipeLike.init({
  recipeId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  createdAt: DataTypes.DATE,
}, {
  sequelize,
  underscored: true,
  updatedAt: false,
  modelName: 'recipeLike',
})

export default RecipeLike
