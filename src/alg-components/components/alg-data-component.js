// @copyright 2017 ALG
// @ts-check

import { AlgComponent } from './alg-component.js';

class AlgDataComponent extends AlgComponent {
  /**
   * Attributes managed by the component
   * @override
   * @type {Array<String>}
   */
  static get observedAttributes() {
    return super.observedAttributes.concat(['data']);
  }

  /** Template for rows. @type {HTMLTemplateElement} */
  get rowElement() {
    return this._rowElement || (this._rowElement = this.createRowTemplate());
  }

  /** Template header and row child length @type {Object} */
  get templateInfo() {
    return this._templateInfo || (this._templateInfo = (() => {
      const shadow = this.shadowRoot;
      const row = this.rowElement.content;
      return {
        header: {
          elements: shadow.childElementCount,
          total: shadow.childNodes.length
        },
        row: {
          elements: row.childElementCount,
          total: row.childNodes.length
        }
      };
    })());
  }

  /**
   * Update from data:
   * <br>
   * {
   *   method: 'add, 'create', 'delete', 'update',
   *   index: [num1, num 2, ...],
   *   data: [{}, {}]
   * }
   * @param {String} attrName - Attribute Name
   * @param {Object} value    - {}
   */
  bindedData(attrName, value) {
    switch (value.method) {
      case 'add':
        this.dataAdd(value.data);
        break;
      case 'create':
        this.dataCreate(value.data);
        break;
      case 'delete':
        this.dataDelete(value.index);
        break;
      case 'update':
        this.dataUpdate(value.index, value.data);
        break;
    }
  }

  /**
   * Create Template for Row.
   * @overrun
   * @return {HTMLTemplateElement}
   */
  createRowTemplate() {
    const row = document.createElement('template');
    row.innerHTML = `
    `;
    return row;
  }

  /**
   * Add the values array
   * @param {Array<Object>} values
   */
  dataAdd(values) {
    values.forEach((item) => {
      this.dataRowAdd(item);
    });
  }

  /**
   * Remove all childs except style and header
   */
  dataClear() {
    const nodes = this.shadowRoot.childNodes;
    const headerLength = this.templateInfo.header.total;
    let len = nodes.length;
    while (len > headerLength) {
      this.shadowRoot.removeChild(this.shadowRoot.lastChild);
      len = nodes.length;
    }
  }

  /**
   * Create the rows from values Array
   * @param {Array<Object>} values
   */
  dataCreate(values) {
    this.dataClear(); // important to create templateChilds
    values.forEach((item) => {
      this.dataRowAdd(item);
    });
  }

  /**
   * Delete de elements by index
   * @param {Array<Number>} indexList
   */
  dataDelete(indexList) {
    const headerLength = this.templateInfo.header.total;
    const rowLength = this.templateInfo.row.total;
    const elements = [];

    indexList.forEach((index) => {
      const start = headerLength + index * rowLength;
      const end = start + rowLength; // exclusive, last = end - 1
      for (let i = start; i < end; i++) {
        elements.push(this.shadowRoot.childNodes[i]);
      }
    });

    elements.forEach((element) => {
      this.shadowRoot.removeChild(element);
    });
  }

  /**
   *
   * @param {Array<Number>} indexList
   * @param {Array<Object>} values
   */
  dataUpdate(indexList, values) {
    const headerElementsLength = this.templateInfo.header.elements;
    for (let i = 0; i < indexList.length; i++) {
      const pos = indexList[i] + headerElementsLength; // style, header
      const row = this.shadowRoot.children[pos];
      this.dataRowUpdate(row, values[i]);
    }
  }

  /**
   *
   * @param {Object} item
   */
  dataRowAdd(item) {
    const row = this.rowElement.content.cloneNode(true);
    // @ts-ignore
    this.dataRowUpdate(row.firstElementChild, item);
    this.shadowRoot.appendChild(row);
  }

  /**
   *
   * @param {Node} row
   * @param {Object} item
   */
  dataRowUpdate(row, item) {
    // @ts-ignore
    for (const cell of row.children) {
      cell.innerHTML = item[cell.id];
    }
  }
}

export { AlgDataComponent };
