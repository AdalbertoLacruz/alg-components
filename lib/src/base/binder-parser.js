// @copyright 2017-2018 adalberto.lacruz@gmail.com

/**
 * Process bindings:
 * on-handler="*"
 * attr="[[controller:channel=defaultValue]]"
 * attr={{controller:channel=defaultValue}} (sync to html)
 * attr="value"
 * style="*"
 * style="property=value"
 */
class BinderParser {
  /**
   * @param {String} attrName
   * @param {String} value
   * @param {String|Object} defaultController
   */
  constructor(attrName, value, defaultController = '', id = '') {
    // this.attrName Attribute Name
    const _attrName = this.attrName = attrName.toLowerCase().trim();
    const _value = value.trim();

    /** @type {String|Object} */
    this.defaultController = (typeof defaultController === 'string')
      ? defaultController.trim()
      : defaultController;

    /** @type {Array<BinderData>} */
    this.datas = []; // data elevator. In style, each one of styleProperty data is stored in datas.

    /** @type {Number} */
    this.index = 0; // data index in datas

    /** @type {BinderData} */
    this.data = this.createData(); // Set of parsed data

    /**  @type {String}  */
    this.id = id; // component id

    /** @type {String} */
    this.handler = ''; // on-handler="*"

    /** @type {Boolean} */
    this.isAttributeBinder = false; // attr="[[*]]"

    /** @type {Boolean} */
    this.isEventBinder = false; // on-handler="[[*]]"

    /** @type {Boolean} */
    this.isStyleBinder = false; // style="*"

    /** @type {Boolean} */
    this.isSync = false; // ={{*}}

    if (this.attributeIsHandler(_attrName)) {
      if (_value === '') {
        this.isEventBinder = true;
        this.controller = this.defaultController;
        if (this.id !== '') this.channel = `${this.id}_${this.handler}`.toUpperCase();
      } else {
        this.isEventBinder = this.getAttributeBinder(_value);
      }
    } else if (this.attributeIsStyle(_attrName)) {
      this.getAttributeStyle(_value);
    } else if (this.getAttributeBinder(_value)) {
      this.isAttributeBinder = true;
    } else {
      // no binding
      this.value = _value;
    }
  }

  /**
   * Get channel in attrName="[[:channel:]]"" binding or guest a channel from id
   * Returns '' if not possible
   * @type {String}
   */
  get autoChannel() {
    return this.channel
      ? this.channel
      : this.id ? `${this.id}-${this.attrName}` : '';
  }

  /**
   * Get defaultValue in attrName="[[:channel:defaultValue]]" binding or value in attrName="value"
   * @type {String}
   */
  get autoValue() {
    return this.channel !== '' ? this.defaultValue : this.value;
  }

  /**
   * attr="[[*:channel:*]]"
   * @type {String}
   */
  set channel(value) { this.data.channel = value; }
  get channel() { return this.data.channel; }

  /**
   * attr="[[controller:*:*]]"
   * @type {String}
   */
  set controller(value) { this.data.controller = value; }
  get controller() { return this.data.controller; }

  /**
   * attr="[[*:*:default-value]]"
   * @type {String}
   * */
  set defaultValue(value) { this.data.defaultValue = value; }
  get defaultValue() { return this.data.defaultValue; }

  /**
   * style="property:[[*]]""
   * @type {String}
   */
  set styleProperty(value) { this.data.styleProperty = value; }
  get styleProperty() { return this.data.styleProperty; }

  /**
   * attr="value"
   * @type {String}
   */
  set value(value) { this.data.value = value; }
  get value() { return this.data.value; }

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
   * @return {BinderData}
   */
  createData() {
    const data = this.data = new BinderData(this.defaultController);
    this.datas.push(data);
    return data;
  }

  /**
   * Process binding in attr="[[controller:channel=defaultValue]]"
   *   or attr={{*}}
   *   or attr="value"
   *   or attr="property:value"
   *
   * @param {String} value
   * @return {Boolean} false == no binding
   */
  getAttributeBinder(value) {
    const re = /^[[{]{2}([a-z-_\d]*):{1}([a-z-_\d)]+)={0,1}([a-z-_\d)]+)*[\]}]{2}/ig;
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
      // property if exist goes to this.styleProperty
      let _value = this.getPropertyAndValue(value) || value;

      if (!this.getAttributeBinder(_value)) { // no binding
        this.getStylePropertyNoBinding(_value);
      }
      if (this.datas.length < values.length) this.createData();
    });

    // Pointer to first data
    if (this.datas.length > 1) this.resetIndex();
  }

  /**
   * Get channel in style="property:[[:channel:]]" binding or guest a channel from id
   * @param {String} property
   * @return {String} empty string if not possible
   */
  getAutoStyleChannel(property) {
    return (!this.id)
      ? ''
      : this.channel !== '' ? this.channel : `${this.id}-style-${property}`;
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
    const values = value.split('=');
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
      this.data = this.datas[++this.index];
      return true;
    }
    return false;
  }

  /**
   * set index = 0
   */
  resetIndex() {
    this.index = 0;
    this.data = this.datas[0];
  }
}

// ---------------------------------------------------

/**
 * Binder Parser results
 */
class BinderData {
  /**
   * @constructor
   * @param {*} controller String | Object
   */
  constructor(controller) {
    this.channel = '';
    this.controller = controller;
    this.defaultValue = '';
    this.styleProperty = '';
    this.value = '';
  }
}

export { BinderParser };
