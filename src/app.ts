import { encodeCompact, hex2bin } from '@/utils';
import { AnnounceResponse, ScrapeResponse, Peer, Query } from '@/types';
import { TrackerError } from '@/TrackerError';

export async function handleAnnounce (query: Query): Promise<AnnounceResponse> {
	const peers: Peer[] = [];

	return {
		'min interval': 10,
		interval: 60,
		complete: 0,
		incomplete: 0,
		downloaded: 0,
		peers: query.compact
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
	if (!query.info_hash) throw new TrackerError('Invalid info hash');

	return {
		files: {
			[query.info_hash]: {
				complete: 0,
				incomplete: 0,
				downloaded: 0,
			},
		},
		flags: {
			min_request_interval: 10,
		},
	}
}
