const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');
const execute = require('../src/execute')
const convert = require('../src/convert/index');
const options = {
  type: PrinterTypes.EPSON,
  interface: '//SYNBDES04/Generic',
  characterSet: CharacterSet.PC852_LATIN2,
  removeSpecialCharacters: false,
  lineCharacter: " ",
  breakLine: BreakLine.WORD,
  options:{
    timeout: 6000
  },
}

const printer = new ThermalPrinter(options);

const template = `
<leftright left="lefttag" right="righttag"></leftright>
<qrcode data="xxxyyy"></qrcode>
<textsize width="7" height="6">Size</textsize>
<div><left>this is left</left> <right>this is right</right></div>
<p>me me</p>
<hr/>
`;
convert(template).then((result) => {
  console.log(result);
})
execute(printer, template).then(console.log).catch(console.log);