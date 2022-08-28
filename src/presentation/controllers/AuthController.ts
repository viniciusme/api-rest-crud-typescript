import { Request, response, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../../infra/data/data-source";
import { validate } from "class-validator";

import { users } from "../../core/entity/User";
import config from "../../core/config/config";

class AuthController {
  static login = async (req: Request, res: Response) => {
    //Verifica se usuário e senha estão configurados
    let { username, password } = req.body;
    console.log(username, password);

    if (!(username && password)) {
      res.status(400).send();
    }

    //Pega usuário do banco de dados
    const userRepository = AppDataSource.getRepository(users);
    let user: users;

    try {
      user = await userRepository.findOneOrFail({ where: { username } });
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

  static changePassword = async (req: Request, res: Response) => {
    //Pega ID do JWT
    const id = res.locals.jwtPayload.userId;
    // const id = req.body;
    console.log(id);

    // //Pega os parâmetros do corpo
    // const { oldPassword, newPassword } = req.body;

    // if (!(oldPassword && newPassword)) {
    //   res.status(400).send();
    // }

    // //Pega usuário do banco de dados
    // const userRepository = AppDataSource.getRepository(users);
    // let user: users;

    // try {
    //   user = await userRepository.findOneOrFail(id);
    // } catch (id) {
    //   res.status(401).send();
    // }

    // //Verifica se a senha antiga corresponde
    // if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
    //   res.status(401).send();

    //   return;
    // }

    // //Valida o modelo (comprimento da senha)
    // user.password = newPassword;

    // const errors = await validate(user);
    // if (errors.length > 0) {
    //   res.status(400).send(errors);
    //   return;
    // }

    // //Hash a nova senha e salva
    // user.hashPassword();
    // userRepository.save(user);

    // res.status(204).send();
  };
}

export default AuthController;
