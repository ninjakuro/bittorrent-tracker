import { bin2hex, hex2bin, encodeCompact, getTypedRequestParams } from '@/utils';
import { TrackerError } from '@/TrackerError';
import { AnnounceResponse, ScrapeResponse, Peer, Query } from '@/types';

// .env
const TRACKER_MIN_INTERVAL = 600;
const TRACKER_ANNOUNCE_INTERVAL = 1800;
const TRACKER_DEFAULT_ANNOUNCE_PEERS = 10;
const TRACKER_MAX_ANNOUNCE_PEERS = 50;

async function getPeers (infoHash: string, peerId?: string): Promise<{ seeders: Peer[], leechers: Peer[] }> {
	return { seeders: [], leechers: [] };
}

export async function handleAnnounce (query: Query): Promise<AnnounceResponse> {
	const params = getTypedRequestParams(query);

	if (typeof query.info_hash !== 'string' || query.info_hash.length !== 20) {
		throw new TrackerError('invalid info_hash');
	}

	if (typeof query.peer_id !== 'string' || query.peer_id.length !== 20) {
		throw new TrackerError('invalid peer_id')
	}

	if (!params.port || params.port <= 0 || params.port > 65535) {
		throw new TrackerError('invalid port')
	}

	const infoHash = bin2hex(query.info_hash);
	const peerId = bin2hex(query.peer_id);
	const numwant = Math.min(params.numwant || TRACKER_DEFAULT_ANNOUNCE_PEERS, TRACKER_MAX_ANNOUNCE_PEERS);
	const isSeeder = params.left === 0;

	const { seeders, leechers } = await getPeers(infoHash, peerId);
	const peers = isSeeder ? leechers : seeders;

	if (!isSeeder && peers.length < numwant) {
		peers.push(...leechers);
	}

	peers.splice(numwant);

	return {
		'min interval': TRACKER_ANNOUNCE_INTERVAL,
		interval: TRACKER_MIN_INTERVAL,
		complete: seeders.length,
		incomplete: leechers.length,
		downloaded: 0,
		peers: params.compact
			? encodeCompact(peers)
			: peers.map(peer => ({
					ip: peer.ip,
					port: peer.port,
					...(!query.no_peer_id && { 'peer id': hex2bin(peer.peer_id) }),
				})
			),
	};
}

export async function handleScrape (query: Query): Promise<ScrapeResponse> {
	if (typeof query.info_hash !== 'string' || query.info_hash.length !== 20) {
		throw new TrackerError('invalid info_hash');
	}

	const infoHash = bin2hex(query.info_hash);
	const { seeders, leechers } = await getPeers(infoHash);

	return {
		files: {
			[query.info_hash]: {
				complete: seeders.length,
				incomplete: leechers.length,
				downloaded: 0,
			},
		},
		flags: {
			min_request_interval: TRACKER_MIN_INTERVAL,
		},
	}
}
