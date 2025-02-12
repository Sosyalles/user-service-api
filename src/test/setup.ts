import { sequelize } from '../config/database';

beforeAll(async () => {
  // Wait for database connection
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
});

afterAll(async () => {
  // Close database connection
  await sequelize.close();
}); 