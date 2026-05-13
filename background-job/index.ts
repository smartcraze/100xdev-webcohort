import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({ host: 'localhost', port: 6379 , maxRetriesPerRequest: null });

const queueName = 'video-processing';

const queue = new Queue(queueName, { connection });

const worker = new Worker(
	queueName,
	async job => {
		const { file, step } = job.data as { file: string; step: string };
		const startedAt = new Date().toISOString();
		console.log(`[${startedAt}] start job=${job.id} file=${file} step=${step}`);

		// Simulate work taking 0.5-1.5s.
		const workMs = 500 + Math.floor(Math.random() * 1000);
		await new Promise(resolve => setTimeout(resolve, workMs));

		const finishedAt = new Date().toISOString();
		console.log(`[${finishedAt}] done  job=${job.id} file=${file} step=${step}`);
	},
	{ connection },
);

async function enqueueSimulationJobs() {
	const steps = ['upload', 'transcode', 'thumbnail', 'notify'];
	const files = ['intro.mp4', 'lesson-1.mp4', 'lesson-2.mp4'];

	for (const file of files) {
		for (const step of steps) {
			await queue.add('process-video', { file, step });
		}
	}
}

worker.on('completed', job => {
	console.log(`completed job=${job.id}`);
});

worker.on('failed', (job, err) => {
	console.error(`failed job=${job?.id} error=${err.message}`);
});

await enqueueSimulationJobs();

console.log('Simulation enqueued. Worker will keep running...');

process.on('SIGINT', async () => {
	await worker.close();
	await queue.close();
	await connection.quit();
	process.exit(0);
});
