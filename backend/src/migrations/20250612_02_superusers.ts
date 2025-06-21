import { DataTypes } from 'sequelize'
import { Migration } from '../utils/db'
import { getEnv } from '../utils/config'
import bcrypt from 'bcrypt'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.addColumn('users', 'role', {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  })

  const passwordHash = await bcrypt.hash(getEnv('ADMIN_PASSWORD'), 10)
  await queryInterface.bulkInsert('users', [{
    username: getEnv('ADMIN_USERNAME'),
    password: passwordHash,
    role: 1,
    created_at: new Date(),
    updated_at: new Date(),
  }])
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.bulkDelete('users', { username: getEnv('ADMIN_USERNAME') })
  await queryInterface.removeColumn('users', 'role')
}
