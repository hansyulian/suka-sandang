module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      name: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'active', 'suspended'),
        allowNull: false,
        defaultValue: 'active',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    const id = '00000000-0000-4000-8000-000000000001';
    const name = 'Admin';
    const email = 'admin@admin.com';
    const password = 'hashedPasswordHere'; 
    const status = 'active';
    const now = new Date();
    const createdAt = now;
    const updatedAt = now;

    await queryInterface.sequelize.query(
      `INSERT INTO "Users" ("id", "name", "email", "password", "status", "createdAt", "updatedAt")
      VALUES (:id, :name, :email, :password, :status, :createdAt, :updatedAt)`,
      {
        replacements: {
          id,
          name,
          email,
          password,
          status,
          createdAt,
          updatedAt,
        },
        type: Sequelize.QueryTypes.INSERT,
      },
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
