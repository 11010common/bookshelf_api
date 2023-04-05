console.log('Hello, World!');

// Memanggil Hapi
const Hapi = require('@hapi/hapi');
// Mengimpor Routes
const routes = require('./routes');

const init = async () => {
	const server = Hapi.server({
		host: 'localhost',
		port: 9000,
		routes: {
			cors: {
				origin: ['*'],
			},
		},
	});
	server.route(routes);

	await server.start();
	console.log(`Server sedang berjalan pada ${server.info.uri}`);
};

init();
