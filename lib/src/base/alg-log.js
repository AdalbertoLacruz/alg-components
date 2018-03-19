// @copyright 2017-2018 adalberto.lacruz@gmail.com

const _LOG_STORE = 'logStore'; // db store
const _LOG_INDEX = 'logIndex'; // db index

/**
 * IndexedDB with promises
 */
class Idb {
  /**
   *
   * @param {String} name
   * @param {Number} version
   * @param {*} onUpgradeNeeded
   * @return {Promise}
   */
  static open(name, version, onUpgradeNeeded) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, version);
      request.onupgradeneeded = onUpgradeNeeded;

      // @ts-ignore
      request.onsuccess = (event) => { resolve(event.target.result); };
      request.onerror = (event) => { reject(event); };
    });
  }

  /**
   * clear db
   * @param {IDBObjectStore} ObjectStore
   * @return {Promise}
   */
  static clear(ObjectStore) {
    return new Promise((resolve, reject) => {
      const request = ObjectStore.clear();

      request.onsuccess = (event) => { resolve(event); };
      request.onerror = (event) => { reject(event); };
    });
  }

  /**
   * Read all items in db
   * @param {IDBObjectStore} objectStore
   * @param {Function} listen listen(cursor)
   * @return {Promise}
   */
  static readAll(objectStore, listen) {
    return new Promise((resolve, reject) => {
      const request = objectStore.openCursor();

      request.onsuccess = (event) => {
        // @ts-ignore
        const cursor = event.target.result;
        if (cursor) {
          listen(cursor);
          cursor.continue();
        } else {
          resolve();
        }
      };

      request.onerror = (event) => { reject(event); };
    });
  }
}

/**
 * Log Manager
 */
class AlgLog {
  // IDBDatabase db

  /** @type {Boolean} enable/disable log recording */
  static get disabled() { return this._disabled != null ? this._disabled : ((this._disabled = true)); }
  static set disabled(value) { this._disabled = value; }

  // Boolean isProcessingQueue

  /** @type {Array<String>} row logs pending to store in db */
  static get queue() { return this._queue || (this._queue = []); }

  // String writeUrl // For Blob write

  /**
   * Save rows to db
   */
  static emptyQueue() {
    if (this.queue.length) {
      const transaction = this.db.transaction(_LOG_STORE, 'readwrite');
      const objectStore = transaction.objectStore((_LOG_STORE));

      while (this.queue.length) {
        objectStore.add(this.queue.shift());
      }
    }
    this.isProcessingQueue = false;
  }

  /**
   * add a log row
   * @param {String} source
   * @param {*} message
   */
  static log(source, message) {
    if (this.disabled) return;

    const now = Math.ceil(performance.now());
    this.queue.push(`${now} ${source} ${message}`);
    this.processQueue();
  }

  /**
   * Open db and save pending rows
   */
  static openDb() {
    // upgrade if needed
    Idb.open('log', 1, (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore(_LOG_STORE, { autoIncrement: true });
      objectStore.createIndex(_LOG_INDEX, 'logID', { unique: true });
    }).then((/** @type {IDBDatabase} */ db) => { // clear previous data
      this.db = db;
      const transaction = db.transaction(_LOG_STORE, 'readwrite');
      return Idb.clear(transaction.objectStore((_LOG_STORE)));
    }).then((event) => {
      this.emptyQueue();
    }).catch((event) => console.log('error in log db', event));
  }

  /**
   * Store pending rows to db
   */
  static processQueue() {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true; // True, we are busy, add row to queue and exit

    this.db ? this.emptyQueue() : this.openDb();
  }

  /**
   * Save db log to a csv file
   */
  static save() {
    console.log('save');

    const transaction = this.db.transaction(_LOG_STORE, 'readonly');
    const objectStore = transaction.objectStore((_LOG_STORE));
    const csv = new CsvLog();

    Idb.readAll(objectStore, (cursor) => {
      csv.add(cursor.value);
    }).then(() => {
      this.writeToFile(csv);
    }).catch((event) => console.log('error in log db', event));
  }

  /**
   * Write to File
   * @param {CsvLog} csv
   */
  static writeToFile(csv) {
    const text = csv.toString(); // use.toTxt for plain list of log entries
    const blob = new Blob([text], { type: 'text/plain', endings: 'native'});

    if (this.writeUrl != null) URL.revokeObjectURL(this.writeUrl);
    this.writeUrl = URL.createObjectURL(blob);

    const anchor = /** @type {HTMLAnchorElement} */ (document.createElement('A'));
    anchor.href = this.writeUrl;
    anchor.download = 'log.csv';
    anchor.click();
  }
}

// ---------------------------------------------------

/**
 * Transform the log rows to csv format
 */
class CsvLog {
  /** */
  constructor() {
    /** @type {Map<String, Array<String>>} Channels data */
    this.matrix = new Map();

    /** @type {Array<String>} raw data received */
    this.raw = [];

    /** @type {Array<String>} time marks */
    this.timeLine = [];
  }

  /**
   * row = 'time channel value'
   * @param {String} row
   */
  add(row) {
    // this.raw.push(row);
    const _row = row.split(' ');
    const time = _row[0];
    const channel = _row[1];
    const value = _row[2];

    this.addChannelValue(channel, value); // order is important
    this.timeLine.push(time);
  }

  /**
   * adds a value to the matrix
   * @param {String} channel
   * @param {String} value
   */
  addChannelValue(channel, value) {
    // add channel and synchronize
    if (!this.matrix.has(channel)) {
      const entry = [];
      for (let i = 0; i < this.timeLine.length; i++) {
        entry.push('');
      }
      this.matrix.set(channel, entry);
    }

    this.matrix.forEach((entry, key) => {
      entry.push(key === channel ? value : '');
    });
  }

  // /**
  //  * Plain txt, as recorded
  //  * @return {String}
  //  */
  // toTxt() {
  //   return this.raw.join('\n');
  // }

  /**
   * Build de csv text
   *
   * TIMELINE,time1,time2, ...
   * Channel1,,,event,,...
   * ...
   * ChannelN,,event,,,,...
   *
   * @return {String}
   * @override
   */
  toString() {
    let result = 'TIMELINE,' + this.timeLine.join(',') + '\n';

    this.matrix.forEach((entry, key) => {
      result = result + key + ',' + entry.join(',') + '\n';
    });

    return result;
  }
}

export { AlgLog };
