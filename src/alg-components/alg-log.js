// @ts-check
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
   * @return {Array<Object>}
   */
  static get register() {
    return this._register || (this._register = []);
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
    // @ts-ignore
    const hours = time.getHours().toString().padStart(2, '0');
    // @ts-ignore
    const minutes = time.getMinutes().toString().padStart(2, '0');
    // @ts-ignore
    const seconds = time.getSeconds().toString().padStart(2, '0');
    // @ts-ignore
    const milliseconds = time.getMilliseconds().toString().padStart(3, '0');

    const timeStr = `${hours}:${minutes}:${seconds}.${milliseconds}`;
    const item = {
      'time': timeStr,
      'id': id,
      'message': message
    };
    this.register.push(item);
    // console.log(item);
    return id;
  }
}

// @ts-ignore
if (!window.AlgLog) window.AlgLog = AlgLog;

export { AlgLog };
