import { createServer, Server } from 'node:http';
import { Router, RouteHandler } from './Router';

export class HttpServer {
	private server: Server;

	constructor(private router: Router = new Router()) {
		this.server = createServer((req, res) => {
			this.router.handle(req, res);
		});

		process.on('SIGTERM', () => {
			console.log('Received SIGTERM, shutting down gracefully');
			this.close();
		});
	}

	route(path: string, handler: RouteHandler) {
		this.router.add(path, handler);
	}

	listen(port: number, callback?: () => void) {
		const defaultCallBack = () => {
			console.log(`HTTP Server running at http://localhost:${port}`);
		};

		this.server.listen(port, callback ?? defaultCallBack);
	}

	close(callback?: () => void) {
		const defaultCallBack = () => {
			console.log('HTTP Server closed');
			process.exit(0);
		};

		this.server.close(callback ?? defaultCallBack);
	}
}
