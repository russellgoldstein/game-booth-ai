const path = require('path');

const entitiesPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'build', 'entity', '**', '*.js')
  : path.join(__dirname, 'src', 'entity', '**', '*.ts');

module.exports = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  username: 'root',
  password: process.env.DB_PASSWORD,
  database: 'webapp-template',
  entities: [entitiesPath],
  synchronize: false,
  migrations: [path.join(__dirname, 'src', 'entity', 'migrations', '**', '*.ts')],
  cli: {
    migrationsDir: path.join(__dirname, 'src', 'entity', 'migrations'),
  },
};
