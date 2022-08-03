import { Dialect, Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbHost = process.env.DB_HOST as string;
const dbName = process.env.DB_NAME as string;
const dbUser = process.env.DB_USER as string;
const dbPassword = process.env.DB_PASSWORD as string;
const dbDriver = process.env.DB_DRIVER as Dialect;
// const dbPort = process.env.PORT as number;

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
	host: dbHost,
	port: 5432,
	dialect: dbDriver,
});

export default sequelizeConnection;