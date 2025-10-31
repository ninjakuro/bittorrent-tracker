import { IncomingMessage, ServerResponse } from 'node:http';

export interface RequestParams {
	info_hash: string;
	peer_id: string;
	port: number;
	uploaded: number;
	downloaded: number;
	left: number;
	key: string;
	event: string;
	numwant: number;
	compact: number;
	supportcrypto: number;
	no_peer_id: number;
	ip: string;
	corrupt: number;
	redundant: number;
}

export type QueryString<T> = { [K in keyof T]: string };

export type Query = QueryString<Partial<RequestParams>>;

export type RouterRequest = IncomingMessage & { query: Query };

export type RouteHandler = (req: RouterRequest, res: ServerResponse) => unknown | Promise<unknown>;

export interface IRouter {
	add(path: string, ...args: RouteHandler[]): void
	handle(req: IncomingMessage, res: ServerResponse): Promise<void>
}

export interface Peer {
	ip: string;
	port: number;
	peer_id: string;
}

export interface TorrentStats {
	complete: number;
	incomplete: number;
	downloaded: number;
}

export type AnnounceResponse = {
	'min interval': number;
	interval: number;
	peers: Partial<Peer>[] | Buffer<ArrayBuffer>;
} & TorrentStats;

export type ScrapeResponse = {
	files: {
		[infoHashBinary: string]: TorrentStats
	}
	flags: {
		min_request_interval: number;
	}
};
