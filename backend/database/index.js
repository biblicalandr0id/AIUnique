import { Sequelize } from 'sequelize';
import { logger } from '../utils/logger';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  logging: msg => logger.debug(msg)
});

export const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    logger.info('Database connection established successfully');
  } catch (error) {
    logger.error('Unable to connect to database:', error);
    throw error;
  }
};

export default sequelize;