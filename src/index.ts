import "reflect-metadata";
import { AppDataSource } from "../src/infra/data/data-source";
import * as express from "express";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import * as cors from "cors";

import routes from "../src/presentation/routes/routes";
import { users } from "./core/entity/User";

//Conecta-se ao banco de dados -> então inicia o expresso
AppDataSource.initialize()
  .then(async (connection) => {
    const port = process.env.PORT || 3000;

    // Cria uma nova instância do aplicativo expresso
    const app = express();

    //Chama midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    //Definir todas as rotas da pasta de rotas
    app.use("/", routes);

    // Inicia servidor express
    app.listen(port);

    // Insere novo usuário para teste com role Admin
    await AppDataSource.manager.save(
      AppDataSource.manager.create(users, {
        first_name: "Vinicius",
        last_name: "Mendes",
        email: "vini@vinimendes.com.br",
        username: "vinimendes",
        password: "12345678",
        role: "admin",
      })
    );

    // Insere novo usuário para teste com role User
    await AppDataSource.manager.save(
      AppDataSource.manager.create(users, {
        first_name: "Pedro",
        last_name: "Henrique Ferreira",
        email: "suporte@multi.com.br",
        username: "pedrohf",
        password: "12345678",
        role: "user",
      })
    );

    console.log(
      `O servidor da API ${process.env.PROJECT_NAME} foi iniciado na porta 3000. Abra http://localhost:${port} para ver os resultados`
    );
  })
  .catch((error) => console.log(error));
