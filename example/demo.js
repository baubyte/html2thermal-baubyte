const printer = require('node-thermal-printer');
const execute = require('../src/execute')
const convert = require('../src/convert/index');
/* printer.init({
  type: 'epson',
  interface: 'tcp://192.168.192.168',
}); */

const template = `
<div>hello world</div>
<left>this is left</left>
<right>this is right</right>
<textsize width="1" height="1"><p>One</p></textsize>
<p>me me</p>
<leftRight left="lefttag" right="righttag"/>
`;
(async ()=>{
  console.log(await convert(template));
})()
//execute(printer, template);