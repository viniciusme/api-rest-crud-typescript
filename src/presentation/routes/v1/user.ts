import { Router } from "express";
import UserController from "./../../controllers/UserController";
import { checkJwt } from "../../middlewares/checkJwt";
import { checkRoles } from "../../middlewares/checkRoles";

const router = Router();

//Pega todos os usuários
router.get("/", UserController.listAll);

// Pega um único usuário pelo Id
router.get("/:id", UserController.getOneById);

//Cria um novo usuário
router.post("/", UserController.newUser);

//Edito um único usuário pelo Id
router.patch("/:id", UserController.editUser);

// //Deleta um único usuário pelo Id
router.delete("/:id", UserController.deleteUser);

export default router;
