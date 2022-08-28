import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { users } from "../../core/entity/User";

export class UserController {
  private userRepository = getRepository(users);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async one(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    return this.userRepository.findOne({ where: { id: Number(id) } });
  }

  async save(req: Request, res: Response, next: NextFunction) {
    return this.userRepository.save(req.body);
  }

  async remove(req: Request, response: Response, next: NextFunction) {
    let userToRemove = await this.userRepository.findOneBy({
      id: Number(req.params.id),
    });
    await this.userRepository.remove(userToRemove);
  }
}
