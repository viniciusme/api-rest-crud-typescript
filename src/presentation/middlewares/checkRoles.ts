import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";

import { users } from "../../core/entity/User";

export const checkRoles = (roles: Array<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Pega o ID do usuário do middleware anterior
    const id = res.locals.jwtPayload.userId;

    //Pega a role do usuário do banco de dados
    const userRepository = getRepository(users);
    let user: users;

    try {
      user = await userRepository.findOneByOrFail(id);
    } catch (error) {
      res.status(401).send();
    }

    //Verifica se o array de roles autorizados inclui a role do usuário
    if (roles.indexOf(user.role) > -1) next();
    else res.status(401).send();
  };
};
