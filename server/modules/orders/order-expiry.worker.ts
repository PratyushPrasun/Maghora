import { expirePendingReservations } from "./order-expiry.service.js";

let workerStarted = false;
let workerTimer: NodeJS.Timeout | null = null;

export function startOrderExpiryWorker() {
  if (workerStarted) return;

  workerStarted = true;

  const run = async () => {
    try {
      await expirePendingReservations();
    } catch (error) {
      console.error("Order expiry worker error:", error);
    }
  };

  // Process expired orders immediately on startup.
  void run();

  // Then check every 15 seconds.
  workerTimer = setInterval(() => {
    void run();
  }, 15_000);

  workerTimer.unref();
}

export function stopOrderExpiryWorker() {
  if (workerTimer) {
    clearInterval(workerTimer);
    workerTimer = null;
  }

  workerStarted = false;
}
