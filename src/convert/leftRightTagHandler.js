const _ = require('lodash');

module.exports = {
  isWithoutClosingTag: true,
  checkIsAllowed: (context, {tag}) => tag === 'leftright',
  after: (context, {attrs}) => {
    const formattedAttrs = Object.keys(attrs).reduce((acc, name) => {
      const value = attrs[name];
      switch(name) {
        case 'left':
            acc.left = (_.isString(value)) ? value : '';
          break;
        case 'right':
            acc.right = _.isString(value) ? value : '';
          break;
      }
      return acc;
    }, {left: '', right: ''});
    context.commands.push({name: 'leftRight', data: [formattedAttrs.left, formattedAttrs.right], isArrayData: true});
    return context;
  },
  sanitizeHtml: {
    allowedTags: [ 'leftright' ],
    allowedAttributes: {
      leftright: ['left', 'right'],
    },
  },
};