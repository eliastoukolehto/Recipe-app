import { DataTypes } from "sequelize"
import { Migration } from "../utils/db"


export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('users', {
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
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    }
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('users')
}