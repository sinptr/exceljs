'use strict';

var utils = require('../../../utils/utils');
var BaseXform = require('../base-xform');

var BooleanXform = module.exports = function (options) {
  this.tag = options.tag;
  this.attr = options.attr;
};

utils.inherits(BooleanXform, BaseXform, {

  render: function render(xmlStream, model) {
    if (model) {
      xmlStream.openNode(this.tag);
      xmlStream.closeNode();
    }
  },

  parseOpen: function parseOpen(node) {
    if (node.name === this.tag) {
      this.model = true;
    }
  },
  parseText: function parseText() {},
  parseClose: function parseClose() {
    return false;
  }
});
//# sourceMappingURL=boolean-xform.js.map