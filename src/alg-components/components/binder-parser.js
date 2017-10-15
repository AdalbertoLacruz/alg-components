// @ts-check

const CHANNEL = 'channel';
const CONTROLLER = 'controller';
const DEFAULT_VALUE = 'default_value';
const PROPERTY = 'property';
const VALUE = 'value';

class BinderParser {
  /**
   * Process bindings:
   * on-handler="*"
   * attr="[[controller:channel:defaultValue]]"
   * attr={{controller:channel:defaultValue}} (sync to html)
   * attr="value"
   * style="*"
   * style="property:value"
   *
   * @param {String} attrName
   * @param {String} value
   * @param {String} defaultController
   */
  constructor(attrName, value, defaultController = '', id = '') {
    const _attrName = this.attrName = attrName.toLowerCase().trim();
    const _value = value.trim();
    this.defaultController = defaultController.trim();
    this.id = id;

    if (this.attributeIsHandler(_attrName)) {
      if (value === '') {
        this.isEventBinder = true;
        this.controller = this.defaultController;
        if (this.id !== '') this.channel = (this.id + '_' + this.handler).toUpperCase();
      } else {
        this.isEventBinder = this.getAttributeBinder(_value);
      }
    } else if (this.attributeIsStyle(_attrName)) {
      this.getAttributeStyle(value);
    } else if (this.getAttributeBinder(_value)) {
      this.isAttributeBinder = true;
    } else {
      // no binding
      this.value = value;
    }
  }

  /** attrName="*" @param {String} value */
  set attrName(value) { this._attrName = value; }
  get attrName() { return this._attrName; }

  /**
   * Get channel in attrName="[[:channel:]]"" binding or guest a channel from id
   * @return {String} Null if not possible
   */
  get autoChannel() {
    if (!this.id) return null;
    return this.channel !== '' ? this.channel : this.id + '-' + this.attrName;
  }

  /**
   * Get channel in style="property:[[:channel:]]"" binding or guest a channel from id
   * @param {String} property
   * @return {String} Null if not possible
   */
  getAutoStyleChannel(property) {
    if (!this.id) return null;
    return this.channel !== '' ? this.channel : this.id + '-style-' + property;
  }

  /**
   * Get defaultValue in attrName="[[:channel:defaultValue]]"" binding or value in attrName="value"
   * @return {String}
   */
  get autoValue() {
    return this.channel !== '' ? this.defaultValue : this.value;
  }

  /** attr="[[*:channel:*]]" @param {String} value */
  set channel(value) { this.data.set(CHANNEL, value); }
  get channel() { return this.data.get(CHANNEL); }

  /** attr="[[controller:*:*]]" @param {String} value */
  set controller(value) { this.data.set(CONTROLLER, value); }
  get controller() { return this.data.get(CONTROLLER); }

  /**
   * Set of parsed data. In style, each one of styleProperty data stored in datas.
   * @param {Map} value
   * */
  set data(value) { this._data = value; }
  get data() { return this._data || this.createData(); }

  get datas() {
    return this._datas || (this._datas = []);
  }

  /** Default controller @param {String} value */
  set defaultController(value) { this._defaultController = value; }
  get defaultController() { return this._defaultController; }

  /** attr="[[*:*:default-value]]" @param {String} value */
  set defaultValue(value) { this.data.set(DEFAULT_VALUE, value); }
  get defaultValue() { return this.data.get(DEFAULT_VALUE); }

  /** on-handler="*" @param {String} value */
  set handler(value) { this._handler = value; }
  get handler() { return this._handler || ''; }

  /** component id @param {String} value */
  set id(value) { this._id = value; }
  get id() { return this._id || ''; }

  /** data index in datas @param {Number} value */
  set index(value) { this._index = value; }
  get index() { return this._index || (this._index = 0); }

  /** attr="[[*]]" @parama {Boolean} value */
  set isAttributeBinder(value) { this._isAttributeBinder = value; }
  get isAttributeBinder() { return this._isAttributeBinder || false; }

  /** on-handler="[[*]]" @parama {Boolean} value */
  set isEventBinder(value) { this._isEventBinder = value; }
  get isEventBinder() { return this._isEventBinder || false; }

  /** style="*" @parama {Boolean} value */
  set isStyleBinder(value) { this._isStyleBinder = value; }
  get isStyleBinder() { return this._isStyleBinder || false; }

  /** ={{*}} @parama {Boolean} value */
  set isSync(value) { this._isSync = value; }
  get isSync() { return this._isSync || false; }

  /** style="property:[[*]]"" @param {String} value */
  set styleProperty(value) { this.data.set(PROPERTY, value); }
  get styleProperty() { return this.data.get(PROPERTY); }

  /** attr="value" @param {String} value */
  set value(value) { this.data.set(VALUE, value); }
  get value() { return this.data.get(VALUE); }

  // ____________________________________________ Methods ______________

  /**
   * Detects on-handler="*"
   * @param {String} attrName
   * @return {Boolean} true if found
   */
  attributeIsHandler(attrName) {
    const re = /^on-(\w+)/g;
    const match = re.exec(attrName);
    if (!match) return false;

    this.handler = match[1];
    return true;
  }

  /**
   * detects style="*"
   * @param {String} attrName
   * @return {Boolean} true if is style
   */
  attributeIsStyle(attrName) {
    return attrName === 'style';
  }

  /**
   * Storage for bindings processed
   * @return {Map}
   */
  createData() {
    const d = new Map();
    d.set(CONTROLLER, this.defaultController.substring(0))
      .set(CHANNEL, '')
      .set(DEFAULT_VALUE, '')
      .set(PROPERTY, '')
      .set(VALUE, '');

    this._data = d;
    this.datas.push(d);
    return d;
  }

  /**
   * Process de binding in attr="[[controller:channel:defaultValue]]"
   * or attr={{*}}
   * or attr="value"
   * or attr="property:value"
   *
   * @param {String} value
   * @return {Boolean} false == no binding
   */
  getAttributeBinder(value) {
    const re = /^[[{]{2}([a-z-_\d]*):{1}([a-z-_\d)]+):{0,1}([a-z-_\d)]+)*[\]}]{2}/ig;
    const match = re.exec(value);
    if (!match) return false;

    if (match[1] !== '') this.controller = match[1]; // we have default controller
    this.channel = match[2];
    this.defaultValue = match[3];
    this.isSync = value.startsWith('{');
    return true;
  }

  /**
   * Process style="property1:[[]];property2:[[]]"
   * @param {String} value
   */
  getAttributeStyle(value) {
    this.isStyleBinder = true;
    const values = value.split(';');

    // value is "property:[[]]"
    values.forEach((value) => {
      let _value = this.getPropertyAndValue(value); // property goes to this.styleProperty
      if (!_value) {
        _value = value; // no style property
      }
      if (!this.getAttributeBinder(_value)) { // no binding
        this.getStylePropertyNoBinding(_value);
      }
      if (this.datas.length < values.length) this.createData();
    });

    // Pointer to first data
    if (this.datas.length > 1) {
      this.index = -1;
      this.next();
    }
  }

  /**
   * For style, split property and [[*]]
   * @param {String} value "property:[[*]]"
   * @return {String} [[*]]
   */
  getPropertyAndValue(value) {
    const re = /([a-z-_\d]+):{1}[[{]{2}/ig;
    const match = re.exec(value);
    if (!match) return null;

    const property = match[1];
    this.styleProperty = property;
    return value.slice(property.length + 1);
  }

  /**
   * The style hasn't binding
   * style="property:value" or style="property" (error?)
   * @param {String} value = property:value
   */
  getStylePropertyNoBinding(value) {
    const values = value.split(':');
    this.styleProperty = values[0];
    if (values.length > 1) {
      this.value = values[1];
    }
  }

  /**
   * In styles, reading datas, get next data
   * @return {Boolean} false == no more
   */
  next() {
    if (this.index < this.datas.length - 1) {
      this.index = this.index + 1;
      this.data = this.datas[this.index];
      return true;
    }
    return false;
  }
}

export { BinderParser };
