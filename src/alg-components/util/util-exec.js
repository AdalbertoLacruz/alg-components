// @copyright 2017 ALG
// @ts-check
// Process handling functions

/**
 * Run the pending tasks in the taskQueue
 * @param {Set<Function>} taskQueue
 */
export const executeTaskQueue = (taskQueue) => {
  taskQueue.forEach((task) => {
    task();
    taskQueue.delete(task);
  });
};
