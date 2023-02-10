const sequelize = require("sequelize");
const model = require("../models");
const categoria = model.Categoria;

module.exports = {
  // Criar uma nova categoria
  async create(request, response) {
    try {
      const { descricao } = request.body; // Buscar o body do corpo html e trazendo pra cá

      const Categoria = await categoria.create({
        descricao,
      });

      return response.json({ msg: "Categoria cadastrada com sucesso!! " }); // Retorna mensagem tipo json
    } catch (error) {
      return response.json({
        msg: "Não foi possivel cadastrar a categoria " + error,
      });
    }
  },

  async update(request, response) {
    // Buscar atualizar categoria
    try {
      const { id } = request.params; // Vai buscar o ID por parâmetro

      const { descricao } = request.body;

      const Categoria = await categoria.update(
        {
          descricao,
        },
        { where: { id } }
      );

      return response.json({ msg: "Categoria alterada com sucesso!! " }); // Retorna mensagem tipo json
    } catch (error) {
      return response.json({
        msg: "Não foi possivel alterar a categoria " + error,
      });
    }
  },

  async findAll(request, response) {
    //Listar as categorias
    try {
      const { page } = request.params; //Trazer por parâmetro as páginas
      const limite = 8;

      //Listar e contar por ordem
      const Categoria = await categoria.findAndCountAll({
        //Listar por páginas o id e contar por ordem do menor para o maior
        order: [["id", "ASC"]],
        limit: limite,
        offset: parseInt(page), //Passar o número de páginas
      });

      return response.json(Categoria);
    } catch (error) {
      return response.json("Erro ao listar categorias " + error); //Retorna mensagem erro tipo json
    }
  },
};
