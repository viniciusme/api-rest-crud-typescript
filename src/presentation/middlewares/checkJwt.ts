import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import config from "../../core/config/config";

export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
  //Pega o token jwt da head
  const token = <string>req.headers["auth"];
  let jwtPayload;
  console.log(jwtPayload);

  //Tente validar o token e obter dados
  try {
    jwtPayload = <any>jwt.verify(token, config.jwtSecret);

    res.locals.jwtPayload = jwtPayload;
  } catch (error) {
    //Se o token não for válido, responda com 401 (não autorizado)
    res.status(401).send();

    return;
  }

  //O token é válido por 1 hora
  //Queremos enviar um novo token a cada solicitação
  const { userId, username } = jwtPayload;

  const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
    expiresIn: "1h",
  });

  res.setHeader("token", newToken);

  //Chama o próximo middleware ou controlador
  next();
};
