const { CicloService } = require("../services/services");
const Profile = require("../model/Profile");
const Usuario = require("../model/Usuario");

module.exports = {
  async index(req, res) {
    try {
      const cicloService = new CicloService();
      const limit = parseInt(req.query.limit) || 10;
      const cursor = req.query.cursor || null;
      const resultado = await cicloService.listarCiclos(limit, cursor);

      // Lógica de usuário que já existia
      const user = req.oidc.user;
      if (!user) {
        return res.redirect("/login");
      }
      const usuarioCadastrado = await Usuario.retornaUsuarioCadastrado(
        user.email,
      );
      if (!usuarioCadastrado) {
        const usuarioAtivo = {
          email: user.email,
          picture: user.picture,
          name: user.name,
          email_verified: user.email_verified,
        };
        return res.render("usuarionovo", { usuarioAtivo: usuarioAtivo });
      }
      const usuarioAtivo = {
        ...user,
        id: usuarioCadastrado.id,
        perfil: usuarioCadastrado.perfil,
      };

      return res.render("ciclo-index", {
        ciclos: resultado.ciclos,
        total: resultado.total,
        nextCursor: resultado.nextCursor,
        limit,
        usuarioAtivo: usuarioAtivo,
        profile: Profile.get(), // Manter profile se a view usar
        statusCount: { total: resultado.total }, // Simplificar statusCount por enquanto
      });
    } catch (error) {
      console.error("Erro ao listar ciclos:", error);
      return res.status(500).send("Erro ao listar ciclos");
    }
  },
};
