import express from "express";
import conectaNaDatabase from "./config/dbConnect.js"
import routes from "./routes/index.js"
import mongoose from "mongoose";
import manipuladorDeErros from "./middlewares/manipuladorDeErros.js";
import manipulador404 from "./middlewares/manipulador404.js";

const conexao = await conectaNaDatabase();

conexao.on("error", console.log.bind(console, 'Erro de conexão'))
conexao.once("open", () => {
  console.log('conexão com o banco feita com sucesso')
})

const app = express();
app.use(express.json())
routes(app);

app.use(manipulador404);

app.use(manipuladorDeErros);

export default app