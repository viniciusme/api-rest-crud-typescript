import { Router } from "express";
import AuthController from "../../controllers/AuthController";
import { checkJwt } from "../../middlewares/checkJwt";

const router = Router();

//Rota de login
router.post("/login", AuthController.login);

//Rota para mudar senha do usuário
router.post("/change-password", [checkJwt], AuthController.changePassword);

export default router;
