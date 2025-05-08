module.exports = {
  "development": {
    "username": process.env.POSTGRES_USER || "postgres",
    "password": process.env.POSTGRES_PASSWORD || "senha",
    "database": process.env.POSTGRES_DB || "divinoalimento",
    "host": process.env.DB_HOST || "db.dev",
    "dialect": "postgres"
  },
  "production": {
    "username": process.env.POSTGRES_USER,
    "password": process.env.POSTGRES_PASSWORD,
    "database": process.env.POSTGRES_DB,
    "host": process.env.DB_HOST || "db.dev",
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "localhost",
    "dialect": "postgres"
  },
}
