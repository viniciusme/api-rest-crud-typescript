import { Router } from "express";

const router = Router();

//Get all users
router.get("/", (req, res) => {
  res.send({ msg: "Rota filtrar todos usuários funcionando!" });
});

// Get one user
router.get("/:id", (req, res) => {
  res.send({ msg: "Rota filtrar usuários por id funcionando!" });
});

//Create a new user
router.post("/", (req, res) => {
  res.send({ msg: "Rota criar usuários funcionando!" });
});

//Edit one user
router.patch("/:id", (req, res) => {
  res.send({ msg: "Rota editar usuários funcionando!" });
});

//Delete one user
router.delete("/:id", (req, res) => {
  res.send({ msg: "Rota deletar usuários funcionando!" });
});

export default router;
