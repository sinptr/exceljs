'use strict';

var _ = require('../../../utils/under-dash');
var utils = require('../../../utils/utils');
var StringXform = require('../simple/string-xform');
var BaseXform = require('../base-xform');

var HeaderFooterXform = module.exports = function () {
  this.map = {
    oddHeader: new StringXform({ tag: 'oddHeader' }),
    evenHeader: new StringXform({ tag: 'evenHeader' }),
    firstHeader: new StringXform({ tag: 'firstHeader' }),
    oddFooter: new StringXform({ tag: 'oddFooter' }),
    evenFooter: new StringXform({ tag: 'evenFooter' }),
    firstFooter: new StringXform({ tag: 'firstFooter' })
  };
};

utils.inherits(HeaderFooterXform, BaseXform, {

  get tag() {
    return 'headerFooter';
  },

  render: function render(xmlStream, model) {
    if (model) {
      xmlStream.openNode(this.tag);

      this._addAttrs(xmlStream, model);

      if (model.header && model.header.odd) {
        this.map.oddHeader.render(xmlStream, this._getRawString(model.header.odd));
      }
      if (model.header && model.header.even) {
        this.map.evenHeader.render(xmlStream, this._getRawString(model.header.even));
      }
      if (model.header && model.header.first) {
        this.map.firstHeader.render(xmlStream, this._getRawString(model.header.first));
      }
      if (model.footer && model.footer.odd) {
        this.map.oddFooter.render(xmlStream, this._getRawString(model.footer.odd));
      }
      if (model.footer && model.footer.even) {
        this.map.evenFooter.render(xmlStream, this._getRawString(model.footer.even));
      }
      if (model.footer && model.footer.first) {
        this.map.firstFooter.render(xmlStream, this._getRawString(model.footer.first));
      }

      xmlStream.closeNode();
    }
  },

  _getRawString: function _getRawString(config) {
    return config && config.raw;
  },

  _addAttrs: function _addAttrs(xmlStream, model) {
    if (model.header.even && !_.isEqual(model.header.odd, model.header.even) || model.footer.even && !_.isEqual(model.footer.odd, model.footer.even)) {
      xmlStream.addAttribute('differentOddEven', '1');
    }
    if (model.header && model.header.first || model.footer && model.footer.first) {
      xmlStream.addAttribute('differentFirst', '1');
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
          header: {
            odd: this.map.oddHeader.model ? { raw: this.map.oddHeader.model } : null,
            even: this.map.evenHeader.model ? { raw: this.map.evenHeader.model } : null,
            first: this.map.firstHeader.model ? { raw: this.map.firstHeader.model } : null
          },
          footer: {
            odd: this.map.oddFooter.model ? { raw: this.map.oddFooter.model } : null,
            even: this.map.evenHeader.model ? { raw: this.map.evenFooter.model } : null,
            first: this.map.firstHeader.model ? { raw: this.map.firstFooter.model } : null
          },
          differentOddEven: !!node.attributes.differentOddEven,
          differentFirst: !!node.attributes.differentFirst
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
        this.model.header = {
          odd: this.map.oddHeader.model ? { raw: this.map.oddHeader.model } : null,
          even: this.map.evenHeader.model ? { raw: this.map.evenHeader.model } : null,
          first: this.map.firstHeader.model ? { raw: this.map.firstHeader.model } : null
        };
        this.model.footer = {
          odd: this.map.oddFooter.model ? { raw: this.map.oddFooter.model } : null,
          even: this.map.evenHeader.model ? { raw: this.map.evenFooter.model } : null,
          first: this.map.firstHeader.model ? { raw: this.map.firstFooter.model } : null
        };
        return false;
      default:
        throw new Error('Unexpected xml node in parseClose: ' + name);
    }
  }

});
//# sourceMappingURL=header-footer-xform.js.map
