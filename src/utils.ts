import { parse } from 'node:querystring';
import { QueryString, RequestParams } from '@/types';

export function getParamsByQuery(query: QueryString<Partial<RequestParams>>): RequestParams {
	return {
		info_hash: query.info_hash || '',
		peer_id: query.peer_id || '',
		port: Number(query.port || 0),
		uploaded: Number(query.uploaded || 0),
		downloaded: Number(query.downloaded || 0),
		left: Number(query.left || 0),
		numwant: Number(query.numwant || 1),
		event: query.event || '',
		passkey: query.passkey || '',
		ip: query.ip || '',
		key: query.key || '',
		corrupt: Number(query.corrupt || 0),
		redundant: Number(query.redundant || 0),
		supportcrypto: query.supportcrypto ? 1 : 0,
		compact: query.compact ? 1 : 0,
		no_peer_id: query.no_peer_id ? 1 : 0
	};
}

export function unescapeBinary(str: string) {
	return str.replace(/%([0-9A-Fa-f]{2})/g, (_, hex) => {
		return String.fromCharCode(parseInt(hex, 16));
	});
}

export function querystringParse (q: string) {
	return parse(q, '', '', { decodeURIComponent: unescapeBinary });
}

export function bin2hex(binary: string) {
	return Buffer.from(binary, 'binary').toString('hex');
}

export function hex2bin(hex: string) {
	return Buffer.from(hex, 'hex').toString('binary');
}

export function encodeCompact(peers: any[]) {
	const buffer = Buffer.alloc(peers.length * 6);

	peers.forEach((peer, index) => {
		const ipParts = peer.ip.split('.').map(Number);
		const ip = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3];
		buffer.writeUInt32BE(ip, index * 6);
		buffer.writeUInt16BE(peer.port, index * 6 + 4);
	});

	return buffer;
}
