import { createServer, Server } from 'node:http';
import { IRouter, RouteHandler } from '@/types';

export class HttpServer {
	private server: Server;

	constructor(private router: IRouter) {
		this.server = createServer((req, res) => {
			this.router.handle(req, res);
		});

		process.on('SIGTERM', () => {
			console.log('Received SIGTERM, shutting down gracefully');
			this.close();
		});
	}

	route(path: string, ...args: RouteHandler[]) {
		this.router.add(path, ...args);
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
