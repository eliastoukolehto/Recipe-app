import {
  Model, DataTypes, InferAttributes, InferCreationAttributes,
  CreationOptional,
  NonAttribute,
} from 'sequelize'
import db from '../utils/db'
import Recipe from './recipe'

const sequelize = db.sequelize

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>
  declare username: string
  declare password: string
  declare role: number
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
  declare recipes?: NonAttribute<Recipe[]>
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      len: [3, 14],
      notContains: ' ',
    },
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  role: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user',
})

export default User
