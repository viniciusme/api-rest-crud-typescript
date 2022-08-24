import "reflect-metadata";
import { DataSource } from "typeorm";
import { users } from "../../core/entity/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "P3nt3st@w3b",
  database: "api-rest-crud",
  synchronize: true,
  logging: false,
  entities: [users],
  migrations: [],
  subscribers: [],
});
