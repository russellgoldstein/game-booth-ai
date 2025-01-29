const path = require('path');

const entitiesPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'build', 'entity', '**', '*.js')
  : path.join(__dirname, 'src', 'entity', '**', '*.ts');

module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: 'admin',
  password: process.env.DB_PASSWORD,
  database: 'mlb-data',
  entities: [entitiesPath],
  synchronize: false,
  migrations: [path.join(__dirname, 'src', 'entity', 'migrations', '**', '*.ts')],
  cli: {
    migrationsDir: path.join(__dirname, 'src', 'entity', 'migrations'),
  },
  extra: {
    connectionLimit: 10,
    connectTimeout: 30000,
    acquireTimeout: 30000,
    timeout: 30000,
    keepAliveInitialDelay: 10000,
    enableKeepAlive: true,
  },
  // Add reconnection options
  retryAttempts: 10,
  retryDelay: 3000,
  poolSize: 10
};
