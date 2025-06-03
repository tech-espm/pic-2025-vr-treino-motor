import app = require("teem");
import appsettings = require("./appsettings");
import http = require("http");
import socketio = require("socket.io");
import Perfil = require("./enums/perfil");

app.run({
	root: appsettings.root,
	port: appsettings.port,
	sqlConfig: appsettings.sqlConfig,

	onInit: function () {
		app.express.locals.Perfil = Perfil;
	},

	onFinish: function () {
		const server = new http.Server(app.express);
		const io = new socketio.Server(server);

		io.on("connection", function (socket: any) {
			console.log("Novo usuário conectado");

			// Recebe mensagem de mudança de animação e repassa para todos os clientes
			socket.on("reproduzirAnimacao", (dados: any) => {
				console.log("Recebido comando para mudar animação:", dados);
				// Repassa a mensagem para todos os clientes conectados
				io.emit("reproduzirAnimacao", dados);
			});

			socket.on("disconnect", () => {
				console.log("Usuário desconectado");
			});
		});

		server.listen(app.port, app.localIp, function () {
			console.log(`Servidor executando na porta ${app.port} e IP ${app.localIp}`);
		});
	},

	htmlErrorHandler: function (err: any, req: app.Request, res: app.Response, next: app.NextFunction) {
		// Como é um ambiente de desenvolvimento, deixa o objeto do erro
		// ir para a página, que possivelmente exibirá suas informações
		res.render("index/erro", { layout: "layout-externo", mensagem: (err.status === 404 ? null : (err.message || "Ocorreu um erro desconhecido")), erro: err });
	}
});
