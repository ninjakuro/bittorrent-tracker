import { HttpServer, HttpRouter } from '@/http';
import { handleAnnounce, handleScrape } from '@/app';

const PORT = Number(process.env.PORT) || 3000;

const server = new HttpServer(new HttpRouter());
server.route('/announce', req => handleAnnounce(req.query));
server.route('/scrape', req => handleScrape(req.query));
server.listen(PORT);
