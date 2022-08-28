import { Request, response, Response } from "express";
import * as jwt from "jsonwebtoken";
import { getRepository } from "typeorm";
import { validate } from "class-validator";

import { users } from "../../core/entity/User";
import config from "../../core/config/config";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Verifica se usuário e senha estão configurados
    let { username, password } = req.body;

    if (!(username && password)) {
      response.status(400).send();
    }

    //Pega usuário do banco de dados
    const userRepository = getRepository(users);
    let user: users;

    try {
      user = await userRepository.findOneByOrFail({ username });
    } catch (error) {
      res.status(401).send();
    }

    //Verifica se a senha criptografada corresponde
    if (!user.checkIfUnencryptedPasswordIsValid(password)) {
      res.status(401).send();

      return;
    }

    //Canta JWT, válido por 1 hora
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    //Envia o jwt na resposta
    res.send(token);
  };

  static chengePassword = async (req: Request, res: Response) => {
    //Pega ID do JWT
    const id = res.locals.jwtPayload.userId;

    //Pega os parâmetros do body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Pega usuário do banco de dados
    const userRepository = getRepository(users);
    let user: users;

    try {
      user = await userRepository.findOneByOrFail(id);
    } catch (id) {
      res.status(401).send();
    }

    //Verifica se a senha antiga corresponde
    if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
      res.status(401).send();

      return;
    }

    //Valida os modelos (comprimento da senha)
    user.password = newPassword;
    const errors = await validate(user);

    if (errors.length > 0) {
      res.status(400).send();

      return;
    }

    //Hash nova senha e salva
    user.hashPassword();
    userRepository.save(user);

    res.status(204).send();
  };
}

export default AuthController;
