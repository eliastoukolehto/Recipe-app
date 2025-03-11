import { 
  Model, DataTypes, InferAttributes, InferCreationAttributes,
  CreationOptional
 } from "sequelize"
import db from "../utils/db"

const sequelize = db.sequelize 

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>
  declare username: string
  declare password: string
  declare createdAt: CreationOptional<Date>
  declare updatedAt: CreationOptional<Date>
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
    validate: {
      len: [3,14],
      notContains: ' '
    }
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'user'
})


export default User 