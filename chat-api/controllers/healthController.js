const prisma = require('../prisma');

exports.healthCheck = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.status(200).json({
      status: 'OK',
      database: 'Connected',
    });
  } catch (error) {
    console.error('Database connection failed:', error.message);
    res.status(500).json({
      status: 'FAIL',
      database: 'Disconnected',
      error: error.message,
    });
  }
};
