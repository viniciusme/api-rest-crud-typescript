import { Router, Request, Response } from "express";
import user from "../routes/v1/user";
import auth from "../routes/v1/auth";

const routes = Router();

//Chama rotas do App
routes.use("/auth", auth);
routes.use("/user", user);

//Rota health-check
routes.get("/", (req, res, next) => {
  res.status(200).send({ msg: "Rota health-check funcionando!" });
});

export default routes;
