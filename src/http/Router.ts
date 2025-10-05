import { IncomingMessage, ServerResponse } from 'node:http';
import bencode from 'bencode';
import { TrackerError } from '@/TrackerError';
import { querystringParse } from '@/utils';
import { getIp } from '@/http/utils';
import { Query } from '@/types';

type RouterRequest = IncomingMessage & { query: Query };

export type RouteHandler = (req: RouterRequest, res: ServerResponse) => Promise<any>;

export class Router {
	constructor(private routes = new Map<string, RouteHandler>()) {}

	add(path: string, handler: RouteHandler) {
		this.routes.set(path, handler);
	}

	async handle(req: IncomingMessage, res: ServerResponse) {
		res.setHeader('Content-Type', 'text/plain');
		res.setHeader('Access-Control-Allow-Origin', '*');
		res.setHeader('Access-Control-Allow-Methods', 'GET');

		try {
			if (req.method !== 'GET' || !req.url) {
				throw new TrackerError('Method not allowed', 405);
			}

			const [pathname, queryString] = req.url.split('?');
			const handler = this.routes.get(pathname);

			if (!handler) {
				throw new TrackerError('Not found', 404);
			}

			const query = querystringParse(queryString) as Query;
			Object.assign(query, {
				ip: query.ip || getIp(req),
			});

			const routerRequest = Object.assign(req, { query }) as RouterRequest;
			const result = await handler(routerRequest, res);

			res.end(bencode.encode(result));
		} catch (err) {
			if (err instanceof TrackerError) {
				res.statusCode = err.statusCode;
				res.end(bencode.encode({ 'failure reason': err.message }));
			} else {
				console.error(err);
				res.statusCode = 500;
				res.end(bencode.encode({ 'failure reason': 'Unknown server error' }));
			}
		}
	}
}
