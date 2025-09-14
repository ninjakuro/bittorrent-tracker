export interface RequestParams {
	passkey: string;
	info_hash: string;
	peer_id: string;
	port: number;
	uploaded: number;
	downloaded: number;
	left: number;
	key: string;
	event: string;
	numwant: number;
	compact: 1 | 0;
	supportcrypto: 1 | 0;
	no_peer_id: 1 | 0;
	ip: string;
	corrupt: number;
	redundant: number;
}

export type QueryString<T> = { [K in keyof T]: string };

export type Query = QueryString<Partial<RequestParams>>;

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
