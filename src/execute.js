const convert = require('./convert');

module.exports = async (printer, html, isCut = true) => {
  const commands = await convert(html, printer.config.characterSet);

  for (let i = 0; i < commands.length; i++) {
    const { name, data, isAwait, isArrayData, ...attributes } = commands[i];
    // TODO it makes no sense to check isAwait - we can use await by default
    if (typeof printer[name] === 'function') {
      if (isAwait) {
        await printer[name](data, attributes);
      } else if (isArrayData) {
        printer[name](...data);
      }
      else {
        printer[name](data, attributes);
      }
    } else {
      console.warn(`Comando ${name} no reconocido.`);
    }
  }

  if (isCut) {
    printer.cut();
  }

  return printer.execute();
};