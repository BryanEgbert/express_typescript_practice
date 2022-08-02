// {
//   "development": {
//     "username": "root",
//     "password": null,
//     "database": "database_development",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "test": {
//     "username": "root",
//     "password": null,
//     "database": "database_test",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   },
//   "production": {
//     "username": "root",
//     "password": null,
//     "database": "database_production",
//     "host": "127.0.0.1",
//     "dialect": "mysql"
//   }
// }

import { Dialect, Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config()

const dbHost = process.env.DB_HOST as string;
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbDriver = process.env.DB_DRIVER as Dialect;

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
	host: dbHost,
	dialect: dbDriver
});

export default sequelizeConnection;