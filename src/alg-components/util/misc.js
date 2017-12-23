// @copyright 2017 ALG
// Miscelaneous functions

/**
 * Run the pending tasks in the taskQueue
 * @param {Set<Function>} taskQueue
 */
export function executeTaskQueue(taskQueue) {
  taskQueue.forEach((task) => {
    task();
    taskQueue.delete(task);
  });
}

/**
 * Encadena llamadas a funciones:
 *   result = pipe(2, incrementar, doblar);
 *
 * @param {*} argument
 * @param {Array} functions
 * @return {*}
 */
export function pipe(argument, ...functions) {
  let result = argument;
  for (let i = 0; i < functions.length; i++) {
    result = functions[i](result);
  }
  return result;
}

/**
 * Speaks the text
 * @param {String} text
 */
export function speach(text) {
  const utterThis = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterThis);
}

/**
 * If value is null, returns byDefault
 * @template T
 * @param {T} value
 * @param {T} byDefault
 * @return {T}
 */
export function valueByDefault(value, byDefault) {
  return (value == null) ? byDefault : value;
}
