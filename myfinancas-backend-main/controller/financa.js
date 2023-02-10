const sequelize = require("sequelize");
const model = require("../models");
const Op = sequelize.Op;
const financa = model.Financa;
const categoria = model.Categoria;

module.exports = {
  // Criar uma nova Finança
  async create(request, response) {
    try {
      const { data, categoria_id, titulo, valor } = request.body; // Buscar o body do corpo html e trazendo pra cá

      const Financa = await financa.create({
        data,
        categoria_id,
        titulo,
        valor,
      });

      return response.json({ msg: "Financa cadastrada com sucesso!! " }); // Retorna mensagem tipo json
    } catch (error) {
      return response.json({ msg: "Não foi possivel cadastrar " + error }); // Retorna mensagem de erro tipo json
    }
  },

  // Buscar atualizar a finança
  async update(request, response) {
    try {
      const { id } = request.params; //Vai buscar o ID por parâmetro

      const { data, categoria_id, titulo, valor } = request.body;
      const Financa = await financa.update(
        {
          data,
          categoria_id,
          titulo,
          valor,
        },
        { where: { id } }
      );

      return response.json({ msg: "Financa alterada com sucesso!! " }); //Retorna mensagem tipo json
    } catch (error) {
      return response.json({ msg: "Não foi possivel alterar " + error }); //Retorna mensagem de erro tipo json
    }
  },

  //Listar as finanças
  async findAll(request, response) {
    try {
      const { page } = request.params; //Trazer por parâmetro as páginas
      const limite = 8;

      const Financa = await financa.findAndCountAll({
        //Listar as páginas por datas e contar por ordem do menor para o maior
        order: [["data", "ASC"]],
        // Vai usar o comando include: {all: true, } --> para obter os valores
        // do id e descricao da tabela categoria --> na tabela financa.
        include: {
          all: true,
        },
        limit: limite,
        offset: parseInt(page), //Passar o número de páginas
      });

      return response.json(Financa); //Retorna mensagem tipo json
    } catch (error) {
      return response.json("Erro ao listar " + error); //Retorna mensagem erro tipo json
    }
  },

  //Listar as finanças por página, Data Inicial e Data Final
  async findAllDate(request, response) {
    try {
      const { page, dataInicial, dataFinal } = request.params; //Vai buscar por parâmetro
      const limite = 8;

      //No const vai usar um operador onde
      //a data inicial seja > ou =
      //data final seja < ou =
      const Financa = await financa.findAndCountAll({
        limit: limite,
        offset: parseInt(page), //Passar o número de páginas
        where: {
          data: {
            [Op.gte]: dataInicial,
            [Op.lte]: dataFinal,
          },
        },

        // Vai usar o comando include: {all: true, } --> para obter os valores
        // do id e descricao da tabela categoria --> na tabela financa.
        include: {
          all: true,
        },
      });

      return response.json(Financa); // Retorna mensagem tipo json
    } catch (error) {
      return response.json("Erro ao listar " + error); // Retorna mensagem erro tipo json
    }
  },

  //Deletar finanças por ID
  async delete(request, response) {
    try {
      const { id } = request.params; //Vai buscar por parâmetro
      const Financa = await financa.destroy({
        where: {
          id: id,
        },
      });
      return response.json({ msg: "Excluido com sucesso" }); // Retorna mensagem tipo json
    } catch (error) {
      return response.json({ msg: "Erro ao excluir " + error }); // Retorna mensagem erro tipo json
    }
  },

  //Pesquisar finanças por Categoria ID
  async findById(request, response) {
    try {
      const { id } = request.params; //Vai buscar por parâmetro

      var saldo = 0;
      var soma = 0;

      const Categoria = await categoria.findOne({
        //Vai usar a condição where para filtar pelo ID da categoria
        where: { id: id },
      });

      console.log(Categoria);
      const Financa = await financa.findAll({
        where: {
          categoria_id: parseInt(id),
        },
        include: {
          all: true,
        },
      });

      //Condições criando uma lista
      //Se finanças for = 0, então não tem nenhuma finança cadastrada naquela categoria
      //como o saldo que já retorna 0
      if (Financa.length === 0) {
        return response.json({ Categoria, saldo });

        //Senão se for maior que 0 vai receber os parametros da lista de finanças vinculada a categoria
      } else {
        for (soma of Financa) {
          saldo = saldo + soma.valor;
        }
        return response.json({ Categoria, saldo }); // Retorna mensagem tipo json
      }
    } catch (error) {
      return response.json("Erro ao listar financas por categoria " + error); // Retorna mensagem tipo erro json
    }
  },
};
