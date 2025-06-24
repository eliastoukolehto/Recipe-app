import { DataTypes } from 'sequelize'
import { Migration } from '../utils/db'

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.createTable('recipe_likes', {
    recipe_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'recipes', key: 'id' },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    },
    created_at: {
      type: DataTypes.DATE,
    },
  })
  await queryInterface.addColumn('recipes', 'total_likes', {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
  })
  await queryInterface.sequelize.query(`
    CREATE OR REPLACE FUNCTION increment_recipe_likes()
    RETURNS TRIGGER AS 
    $$
    BEGIN
      UPDATE recipes
      SET total_likes = total_likes + 1
      WHERE id = NEW.post_id;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `)

  await queryInterface.sequelize.query(`
    CREATE TRIGGER trigger_increment_recipe_likes
    AFTER INSERT ON recipe_likes
    FOR EACH ROW EXECUTE FUNCTION increment_recipe_likes();
  `)

  await queryInterface.sequelize.query(`
    CREATE OR REPLACE FUNCTION decrement_recipe_likes()
    RETURNS TRIGGER AS 
    $$
    BEGIN
      UPDATE recipes
      SET total_likes = total_likes - 1
      WHERE id = OLD.post_id;
      RETURN OLD;
    END;
    $$ LANGUAGE plpgsql;
  `)

  await queryInterface.sequelize.query(`
    CREATE TRIGGER trigger_decrement_recipe_likes
    AFTER DELETE ON recipe_likes
    FOR EACH ROW EXECUTE FUNCTION decrement_recipe_likes();
  `)
}

export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trigger_increment_recipe_likes ON recipe_likes')
  await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS increment_recipe_likes()')
  await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS trigger_decrement_recipe_likes ON recipe_likes')
  await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS decrement_recipe_likes()')
  await queryInterface.removeColumn('recipes', 'total_likes')
  await queryInterface.dropTable('recipe_likes')
}
