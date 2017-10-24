// @ts-check
import { ObsArray } from './types/obs-array.js';

/**
 * Global log: AlgLog.register.
 * <p>
 * Use Example: <br>
 *  const id = AlgLog.add(null, `in text: ${value}`);<br>
 *  AlgLog.add(id, `out text: ${value}`);
 *
 * @type {class}
 */
class AlgLog {
  /** global id @param {Number} value */
  static set id(value) { this._id = value; }
  static get id() { return this._id || (this._id = 0); }

  /**
   * Global storage
   * @return {*}
   */
  static get register() {
    return this._register || (this._register = new ObsArray('log'));
  }

  /**
   * Save the message in the register
   *
   * @param {Number} id - Sequencer, could be null
   * @param {String} message - To log
   */
  static add(id, message) {
    if (id == null) id = AlgLog.id++;
    const time = new Date();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const milliseconds = time.getMilliseconds().toString().padStart(3, '0');

    const timeStr = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    const item = {
      'time': timeStr,
      'id': id,
      'message': message
    };
    this.register.add(item);
    // console.log(item);
    return id;
  }
}

// @ts-ignore
if (!window.AlgLog) window.AlgLog = AlgLog;

export { AlgLog };
