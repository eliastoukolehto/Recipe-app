import { DataTypes } from 'sequelize'
import { Migration } from '../utils/db'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('recipes', {
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
    ingredient_categories: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: false,
    },
    steps: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
    },
    serving: {
      type: DataTypes.JSON,
    },
    prepare_time: {
      type: DataTypes.INTEGER,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    created_at: {
      type: DataTypes.DATE,
    },
    updated_at: {
      type: DataTypes.DATE,
    },
  })
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.dropTable('recipes')
}
