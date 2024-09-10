const printer = require('node-thermal-printer');
const execute = require('../src/execute')
const {convert} = require('../src/convert');
printer.init({
  type: 'epson',
  interface: 'tcp://192.168.192.168',
});

const template = `
<div>hello world</div>
<p>it is</p>
<p>me
me</p>
`;
//console.log(convert(template));

execute(printer, template);