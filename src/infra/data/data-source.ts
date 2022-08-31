import { Console } from "console";
import * as dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { users } from "../../core/entity/User";

const DB_TYPE = process.env.TYPEORM_CONNECTION as
  | "mysql"
  | "mariadb"
  | "mongodb";
const DB_NAME = process.env.TYPEORM_DATABASE;
const DB_HOST = process.env.TYPEORM_HOST;
const DB_PORT = Number(process.env.TYPEORM_PORT);
const DB_USERNAME = process.env.TYPEORM_USERNAME;
const DB_PASSWORD = process.env.TYPEORM_PASSWORD;

// console.log(DB_PORT);

export const AppDataSource = new DataSource({
  type: DB_TYPE,
  host: DB_HOST,
  port: DB_PORT,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: [users],
  migrations: [],
  subscribers: [],
});
