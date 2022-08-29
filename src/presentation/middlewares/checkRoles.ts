import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../infra/data/data-source";
import { users } from "../../core/entity/User";

export const checkRole = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Pega o ID do usuário do middleware anterior
    const id = res.locals.jwtPayload.userId;

    //Pega a função do usuário do banco de dados
    const userRepository = AppDataSource.getRepository(users);
    let user: users;
    try {
      user = await userRepository.findOneOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Verifica se o array de papéis autorizados inclui o papel do usuário
    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  };
};
