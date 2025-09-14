import { createServer } from 'node:http';
import { Router } from '@/http';
import { handleAnnounce, handleScrape } from '@/app';

const router = new Router();
router.add('/announce', req => handleAnnounce(req.query));
router.add('/scrape', req => handleScrape(req.query));

const server = createServer((req, res) => router.handle(req, res));

const PORT = Number(process.env.PORT || 3000);

server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
	console.log('Received SIGTERM, shutting down gracefully');
	server.close(() => {
		console.log('Server closed');
		process.exit(0);
	});
});
