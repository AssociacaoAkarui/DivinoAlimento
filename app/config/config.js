module.exports = {
  "development": {
    "username": process.env.POSTGRES_USER || "postgres",
    "password": process.env.POSTGRES_PASSWORD || "senha",
    "database": process.env.POSTGRES_DB || "divinoalimento",
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
  "production": {
    "username": "carmen",
    "password": "ztm14crm",
    "database": "d4evh79fho3fnq",
    "host": "localhost",
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    },
    "use_env_variable": "DATABASE_URL"
  }
}
