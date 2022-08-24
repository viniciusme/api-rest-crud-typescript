import { Router, Request, Response } from "express";
//import auth from "./auth";
import user from "../routes/v1/user";
import auth from "../routes/v1/auth";

const routes = Router();

routes.use("/auth", auth);
routes.use("/user", user);

//health-check
routes.get("/", (req, res, next) => {
  res.status(200).send({ msg: "Rota health-check funcionando!" });
});

export default routes;
