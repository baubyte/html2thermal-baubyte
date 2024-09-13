module.exports = {
  checkIsAllowed: (context, {tag}) => tag === 'textsize',
  before: (context, {attrs}) => {
    const formattedAttrs = Object.keys(attrs).reduce((acc, name) => {
      const value = Number.parseInt(attrs[name], 10);
      switch(name) {
        case 'width':
          if (Number.isNaN(value)) {
            acc.width = 0;
          } else {
            acc.width = Math.max(0, Math.min(value, 7));
          }
          break;
        case 'height':
          if (Number.isNaN(value)) {
            acc.height = 0;
          } else {
            acc.height = Math.max(0, Math.min(value, 7));
          }
          break;
      }
      return acc;
    }, { width: 0, height: 0 });
    context.textStyles = context.textStyles ? [...context.textStyles, 'TextSize'] : ['TextSize'];
    context.commands.push({name: 'setTextSize', data: [Number.parseInt(formattedAttrs.height), Number.parseInt(formattedAttrs.width)], isArrayData: true});
    return context;
  },
  after: (context) => {
    context.textStyles.pop();
    context.commands.push({name: `setText${context.textStyles.length > 0 ? context.textStyles.slice(-1).pop() : 'Normal'}`});
    return context;
  },
  sanitizeHtml: {
    allowedTags: [ 'textsize' ],
    allowedAttributes: {
      textsize: ['width', 'height'],
    },
  },
};