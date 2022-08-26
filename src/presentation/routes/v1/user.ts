import { Router } from "express";

const router = Router();

//Pega todos os usuários
router.get("/", (req, res) => {
  res.send({ msg: "Rota filtrar todos usuários funcionando!" });
});

// Pega um único usuário pelo Id
router.get("/:id", (req, res) => {
  res.send({ msg: "Rota filtrar usuários por id funcionando!" });
});

//Cria um novo usuário
router.post("/", (req, res) => {
  res.send({ msg: "Rota criar usuários funcionando!" });
});

//Edito um único usuário pelo Id
router.patch("/:id", (req, res) => {
  res.send({ msg: "Rota editar usuários funcionando!" });
});

//Deleta um único usuário pelo Id
router.delete("/:id", (req, res) => {
  res.send({ msg: "Rota deletar usuários funcionando!" });
});

export default router;
