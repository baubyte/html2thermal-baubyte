module.exports = {
  checkIsAllowed: (context, {tag}) => tag === 'textsize',
  before: (context, {attrs}) => {
    const formattedAttrs = Object.keys(attrs).reduce((acc, name) => {
      const value = attrs[name];
      switch(name) {
        case 'width':
          const width = Number.parseInt(value) || 0;
          if(width >= 1 && width <= 7) {
            acc.width = width;
          }
          if(width <=  0) {
            acc.width = 1;
          }
          if(width > 7) {
            acc.width = 7;
          }
          break;
        case 'height':
          const height =  Number.parseInt(value) || 0;
          if(height >= 1 && height <= 7) {
            acc.height = height;
          }
          if(height <= 0) {
            acc.height = 1;
          }
          if(height > 7) {
            acc.height = 7;
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