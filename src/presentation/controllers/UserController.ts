import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../infra/data/data-source";
import { validate } from "class-validator";

import { users } from "../../core/entity/User";

class UserController {
  static listAll = async (req: Request, res: Response, next: NextFunction) => {
    //Pega usuários do banco de dados
    const userRepository = AppDataSource.getRepository(users);

    const user = await userRepository.find({
      select: ["id", "username", "role", "createdAt", "updatedAt"], //Não queremos enviar as senhas na resposta
    });

    console.log(user);

    //Envia o objeto de usuários
    res.send(user);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Pega o ID da url
    const id = req.params.id;
    console.log(id);

    //Pega o usuário do banco de dados
    const userRepository = AppDataSource.getRepository(users);

    try {
      const user = await userRepository.findOneOrFail({
        where: { id: Number(id) },
        select: ["id", "username", "role", "createdAt", "updatedAt"], //Não queremos enviar as senhas na resposta
      });

      console.log(user);

      res.send(user);
    } catch (error) {
      res.status(404).send("Usuário não encontrado");

      return;
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Pega os parâmetros do corpo
    let { username, password, role } = req.body;
    let user = new users();

    user.username = username;
    user.password = password;
    user.role = role;

    console.log(user.username, user.password, user.role);

    //Valida se os parâmetros estão ok
    const errors = await validate(user);

    if (errors.length > 0) {
      res.status(400).send({ errors });

      return;
    }

    //Hash a senha, para armazenar com segurança no banco de dados
    user.hashPassword();

    //Tente salvar. Se falhar, o nome de usuário já está em uso
    const userRepository = AppDataSource.getRepository(users);

    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("Nome de usuário já em uso");

      return;
    }

    //Se tudo ok, envia 201 resposta
    res.status(201).send("Usuário criado");
  };

  static editUser = async (req: Request, res: Response) => {
    //Get the ID from the url
    const id = req.params.id;

    //Get values from the body
    const { username, role } = req.body;

    //Try to find user on database
    const userRepository = AppDataSource.getRepository(users);
    let user;

    try {
      user = await userRepository.findOneOrFail({
        where: { id: Number(id) },
      });
    } catch (error) {
      //If not found, send a 404 response
      res.status(404).send("Usuário não encontrado");

      return;
    }

    //Validate the new values on model
    user.username = username;
    user.role = role;

    const errors = await validate(user);

    if (errors.length > 0) {
      res.status(400).send(errors);

      return;
    }

    //Try to safe, if fails, that means username already in use
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("Nome de usuário já em uso");

      return;
    }
    //After all send a 204 (no content, but accepted) response
    res.status(204).send();
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Pega o ID da url
    const id = req.params.id;
    console.log(id);

    const userRepository = AppDataSource.getRepository(users);
    let user: users;

    try {
      user = await userRepository.findOneOrFail({
        where: { id: Number(id) },
      });

      res.status(200).send({
        message: "Usuário deletado",
      });
    } catch (error) {
      res.status(404).send("Usuário não encontrado");

      return;
    }

    userRepository.delete(id);

    //Após tudo enviar uma resposta 204 (sem conteúdo, mas aceito)
    res.status(204).send();
  };
}

export default UserController;
