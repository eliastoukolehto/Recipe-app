import {
  Model, DataTypes, InferAttributes, InferCreationAttributes,
  CreationOptional,
  ForeignKey,
} from 'sequelize'
import db from '../utils/db'
import { IngredientCategory, Serving } from '../types/recipeTypes'
import User from './user'

const sequelize = db.sequelize

class Recipe extends Model<InferAttributes<Recipe>, InferCreationAttributes<Recipe>> {
  declare id: CreationOptional<number>
  declare name: string
  declare description?: string
  declare ingredientCategories: IngredientCategory[]
  declare steps: string[]
  declare serving?: Serving
  declare prepareTime?: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare userId: ForeignKey<User['id']>
  declare totalLikes: CreationOptional<number>
}

Recipe.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  ingredientCategories: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    allowNull: false,
  },
  steps: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    allowNull: false,
  },
  serving: {
    type: DataTypes.JSON,
  },
  prepareTime: {
    type: DataTypes.INTEGER,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  totalLikes: DataTypes.NUMBER,
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'recipe',
})

export default Recipe
