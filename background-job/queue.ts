import { Queue } from 'bullmq';

const myQueue = new Queue('foo' , {
    connection: {
        host: 'localhost',
        port: 6379
    }
});

async function addJobs() {
  await myQueue.add('myJobName', { foo: 'bar' });
  await myQueue.add('myJobName', { qux: 'baz' });
}

await addJobs();