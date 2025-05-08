import { worker } from './server';

// Start the worker
export function startWorker() {
  if (typeof window !== 'undefined') {
    worker.start({
      onUnhandledRequest: 'bypass',
    });
    console.log('Mock Service Worker started');
  }
}
