module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Agregar adminmercado al ENUM de perfis en PostgreSQL
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_enum
          WHERE enumlabel = 'adminmercado'
          AND enumtypid = (
            SELECT oid FROM pg_type WHERE typname = 'enum_Usuarios_perfis'
          )
        ) THEN
          ALTER TYPE "enum_Usuarios_perfis" ADD VALUE 'adminmercado';
        END IF;
      END
      $$;
    `);
  },

  down: async (queryInterface, Sequelize) => {
    // PostgreSQL no permite remover valores de un ENUM directamente
    // Sería necesario recrear el tipo y la columna
    console.log('Rollback not implemented - ENUM values cannot be easily removed in PostgreSQL');
  },
};
