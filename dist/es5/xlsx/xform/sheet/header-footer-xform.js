'use strict';

var utils = require('../../../utils/utils');
var StringXform = require('../simple/string-xform');
var BaseXform = require('../base-xform');

var HeaderFooterXform = module.exports = function () {
  this.map = {
    oddHeader: new StringXform({ tag: 'oddHeader' }),
    oddFooter: new StringXform({ tag: 'oddFooter' })
  };
};

utils.inherits(HeaderFooterXform, BaseXform, {

  get tag() {
    return 'headerFooter';
  },

  render: function render(xmlStream, model) {
    if (model) {
      xmlStream.openNode(this.tag);
      if (model.header && model.header.odd) {
        this.map.oddHeader.render(xmlStream, model.header.odd);
      }
      if (model.footer && model.footer.odd) {
        this.map.oddFooter.render(xmlStream, model.footer.odd);
      }
      xmlStream.closeNode();
    }
  },

  parseOpen: function parseOpen(node) {
    if (this.parser) {
      this.parser.xform.parseOpen(node);
      return true;
    }
    switch (node.name) {
      case this.tag:
        this.model = {
          // oddHeader: this.map.oddHeader.model,
          // oddFooter: this.map.oddFooter.model,
          header: {
            odd: this.map.oddHeader.model
          },
          footer: {
            odd: this.map.oddFooter.model
          }
        };
        return true;
      default:
        this.parser = this.map[node.name];
        if (this.parser) {
          this.parser.parseOpen(node);
          return true;
        }
        throw new Error('Unexpected xml node in parseOpen: ' + JSON.stringify(node));
    }
  },
  parseText: function parseText(text) {
    if (this.parser) {
      this.parser.parseText(text);
    }
  },
  parseClose: function parseClose(name) {
    if (this.parser) {
      if (!this.parser.parseClose(name)) {
        this.parser = undefined;
      }
      return true;
    }
    switch (name) {
      case this.tag:
        this.model = {
          header: {
            odd: this.map.oddHeader.model
          },
          footer: {
            odd: this.map.oddFooter.model
          }
        };
        return false;
      default:
        throw new Error('Unexpected xml node in parseClose: ' + name);
    }
  }

});
//# sourceMappingURL=header-footer-xform.js.map
