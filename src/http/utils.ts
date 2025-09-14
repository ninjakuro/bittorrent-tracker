import { IncomingMessage } from 'node:http';

function getForwardedIp(req: IncomingMessage) {
	const xForwardedFor = req.headers['x-forwarded-for'];

	if (typeof xForwardedFor === 'string') {
		return xForwardedFor.split(',')[0].trim();
	} else if (Array.isArray(xForwardedFor)) {
		return xForwardedFor[0].trim();
	}
}

export function getIp(req: IncomingMessage) {
	const ip = getForwardedIp(req) || req.socket.remoteAddress || '';
	return ip.replace('::ffff:', '');
}

export function getUserAgent(req: IncomingMessage) {
	return req.headers['user-agent'] || 'unknown';
}
