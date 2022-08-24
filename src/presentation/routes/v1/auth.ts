import { Router } from "express";

const router = Router();

//Login route
router.post("/login", (req, res) => {
  res.send({ msg: "Rota login funcionando!" });
});

//Change my password
router.post("/change-password", (req, res) => {
  res.send({ msg: "Rota change-password funcionando!" });
});

export default router;
