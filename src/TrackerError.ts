export class TrackerError extends Error {
	constructor(message: string, public statusCode: number = 400) {
		super(message);
		this.name = 'TrackerError';
	}
}
