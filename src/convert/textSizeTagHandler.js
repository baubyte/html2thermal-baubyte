module.exports = {
  checkIsAllowed: (context, {tag}) => tag === 'textsize',
  before: (context, {attrs}) => {
    const formattedAttrs = Object.keys(attrs).reduce((acc, name) => {
      const value = attrs[name];
      switch(name) {
        case 'width':
          const width = Number.parseInt(value);
          if(width >= 1 && width <= 7) {
            acc.width = width;
          }
          break;
        case 'height':
          const  height= Number.parseInt(value);
          if(height >= 1 && height <= 7) {
            acc.height = height;
          }
          break;
      }
      return acc;
    }, {});

    context.textStyles = context.textStyles ? [...context.textStyles, 'TextSize'] : ['TextSize'];
    context.commands.push({name: 'setTextSize', data: [formattedAttrs.height, formattedAttrs.width], isArrayData: true});
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