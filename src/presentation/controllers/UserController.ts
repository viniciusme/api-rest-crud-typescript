import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../../infra/data/data-source";
import { validate } from "class-validator";

import { users } from "../../core/entity/User";

class UserController {
  static listAll = async (req: Request, res: Response) => {
    //Pega usuários do banco de dados
    const userRepository = AppDataSource.getRepository(users);

    const usersList = await userRepository.find({
      select: [
        "id",
        "first_name",
        "last_name",
        "username",
        "email",
        "role",
        "createdAt",
        "updatedAt",
      ], //Não queremos enviar as senhas na resposta
    });

    //Envia o objeto de usuários
    res.status(200).send(usersList);
  };

  static getOneById = async (req: Request, res: Response) => {
    //Pega o ID da url
    const id = req.params.id;
    // console.log(id);

    //Pega o usuário do banco de dados
    const userRepository = AppDataSource.getRepository(users);

    try {
      const user = await userRepository.findOneOrFail({
        where: { id: Number(id) },
        select: [
          "id",
          "first_name",
          "last_name",
          "username",
          "email",
          "role",
          "createdAt",
          "updatedAt",
        ], //Não queremos enviar as senhas na resposta
      });

      //Envia o objeto de usuários
      res.status(200).send(user);
    } catch (error) {
      res.status(404).send("Usuário não encontrado na base de dados.");
    }
  };

  static newUser = async (req: Request, res: Response) => {
    //Pega os parâmetros do corpo
    let { first_name, last_name, username, email, password, role } = req.body;
    let user = new users();

    // console.log(req.body);

    user.first_name = first_name;
    user.last_name = last_name;
    user.username = username;
    user.email = email;
    user.password = password;
    user.role = role;

    // console.log(user.password, user.role);

    //Valida se os parâmetros estão ok
    const errors = await validate(user);

    if (errors.length > 0) {
      return res.status(400).json(errors.map((e) => e.constraints));
    }

    //Hash a senha, para armazenar com segurança no banco de dados
    user.hashPassword();

    //Tente salvar. Se falhar, o nome de usuário já está em uso
    const userRepository = AppDataSource.getRepository(users);

    console.log(userRepository);

    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("Nome de usuário já está em uso.");

      return;
    }

    //Se tudo ok, envia 201 resposta
    res.status(201).send({
      msg: "Usuário criado com sucesso.",
    });
  };

  static editUser = async (req: Request, res: Response) => {
    //Pega o ID da url
    const id = req.params.id;

    //Pega os valores do corpo
    const { username, role } = req.body;

    //Tenta encontrar o usuário no banco de dados
    const userRepository = AppDataSource.getRepository(users);
    let user;

    try {
      user = await userRepository.findOneOrFail({
        where: { id: Number(id) },
      });
    } catch (errors) {
      //Se não for encontrado, envia uma resposta 404
      res.status(404).send("Usuário não encontrado em nossa base dados.");
      return;
    }

    //Valida os novos valores no modelo
    user.username = username;
    user.role = role;
    const errors = await validate(user);

    if (errors.length > 0) {
      res.status(400).json(errors.map((e) => e.constraints));
      return;
    }

    //Tente salvar, se falhar significa que o username está em uso
    try {
      await userRepository.save(user);
    } catch (e) {
      res.status(409).send("Nome de usuário já está em uso.");

      return;
    }
    //Após tudo enviar uma resposta 204 (sem conteúdo, mas aceito)
    res.status(200).send({
      msg: "Usuário atualizado com sucesso.",
    });
  };

  static deleteUser = async (req: Request, res: Response) => {
    //Pega o ID da url
    const id = req.params.id;

    const userRepository = AppDataSource.getRepository(users);
    let user: users;

    try {
      user = await userRepository.findOneOrFail({
        where: { id: Number(id) },
        select: ["id", "username", "role", "createdAt", "updatedAt"], //Não queremos enviar a senha na resposta
      });
    } catch (error) {
      res.status(404).send("Usuário não encontrado em nossa base dados.");

      return;
    }

    userRepository.delete(id);

    //Após tudo enviar uma resposta 204 (sem conteúdo, mas aceito)
    res.status(200).send({
      msg: "Usuário deletado com sucesso.",
      data: user,
    });
  };
}

export default UserController;
