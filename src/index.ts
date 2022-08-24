import "reflect-metadata";
import { AppDataSource } from "../src/infra/data/data-source";
import * as express from "express";
import * as bodyParser from "body-parser";
//import * as helmet from "helmet";
//import * as cors from "cors";
import routes from "../src/presentation/routes/routes";
import { User } from "./core/entity/User";

//Connects to the Database -> then starts the express
AppDataSource.initialize()
  .then(async (connection) => {
    const port = process.env.PORT || 3000;

    // Create a new express application instance
    const app = express();

    // Call midlewares
    //app.use(cors());
    //app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);

    // start express server
    app.listen(port);

    // insert new users for test
    await AppDataSource.manager.save(
      AppDataSource.manager.create(User, {
        firstName: "Timber",
        lastName: "Saw",
        age: 27,
      })
    );

    await AppDataSource.manager.save(
      AppDataSource.manager.create(User, {
        firstName: "Phantom",
        lastName: "Assassin",
        age: 24,
      })
    );

    console.log(
      `The Express Server ${process.env.PROJECT_NAME} was started on port 3000. Open http://localhost:${port} to see the results`
    );
  })
  .catch((error) => console.log(error));
