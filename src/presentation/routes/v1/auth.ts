import { Router } from "express";
import { checkJwt } from "../../middlewares/checkJwt";
const router = Router();

//Rota de login
router.post("/login", (req, res) => {
  res.send({ msg: "Rota login funcionando!" });
});

//Rota para mudar senha do usuário
router.post("/change-password", (req, res) => {
  res.send({ msg: "Rota change-password funcionando!" });
});

export default router;
