import {autores, livros} from "../models/index.js";
import NaoEncontrado from "../erros/NaoEncontrado.js";

class LivroController {

  static listarLivros = async (req, res, next) => {
    try {

      req.resultado = livros.find();

      next();


    } catch (erro) {
      // res.status(500).json({ message: "Erro interno no servidor" });
      next(erro);
    }
  }

  static listarLivroPorId = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findById(id)
        .populate("autor", "nome")
        .exec();

      if (livroResultado !== null) {
        res.status(200).send(livroResultado);
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  }

  static cadastrarLivro = async (req, res, next) => {
    try {
      let livro = new livros(req.body);

      const livroResultado = await livro.save();

      res.status(201).send(livroResultado.toJSON());
    } catch (erro) {
      // res.status(500).send({message: `${erro.message} - falha ao cadastrar livro.`});
      next(erro);
    }
  }

  static atualizarLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndUpdate(id, {$set: req.body});

      if  (livroResultado !== null) {
        res.status(200).send({message: "Livro atualizado com sucesso"});
      } else {
        next(new NaoEncontrado("Id do livro não localizdo."));
      }
    } catch (erro) {
      next(erro);
    }
  }

  static excluirLivro = async (req, res, next) => {
    try {
      const id = req.params.id;

      const livroResultado = await livros.findByIdAndDelete(id);

      if (livroResultado !== null) {
        res.status(200).send({message: "Livro removido com sucesso"});
      } else {
        next(new NaoEncontrado("Id do livro não localizado."));
      }
    } catch (erro) {
      next(erro);
    }
  }

  static listarLivroPorFiltro = async (req, res, next) => {
    try {
        const busca = await processaBusca(req.query);

        if (busca !== null) {
          const livrosResultado = livros.find(busca).populate("autor");

          req.resultado = livrosResultado;

          next();
        } else {
          res.status(200).send([]);
        }

    } catch (erro) {
      next(erro);
    }
  }

}

async function processaBusca(parametros) {
  const {editora, titulo, minPaginas, maxPaginas, nomeAutor} = parametros;

  // const regEx = new RegExp(titulo, "i");

  let busca = {};

  if (editora) busca.editora = editora;
  // if (titulo) busca.titulo = regEx;

  if (titulo) busca.titulo = {$regex: titulo, $options: "i"};

  if (minPaginas || maxPaginas) busca.numeroPaginas = {};

  if (minPaginas) {
    busca.numeroPaginas.$gte = minPaginas;
  }

  if (maxPaginas) busca.numeroPaginas.$lte = maxPaginas;

  if (nomeAutor) {
    const autor = await autores.findOne({nome: nomeAutor});

    if (autor !== null) {
      busca.autor = autor._id;
    } else {
      busca = null;
    }
  }

  return busca;
}

export default LivroController;