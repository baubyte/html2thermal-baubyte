const { ThermalPrinter, PrinterTypes, CharacterSet, BreakLine } = require('node-thermal-printer');
const execute = require('../src/execute')
const convert = require('../src/convert/index');
const _ = require('lodash');
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
const metodosDePago = ["tarjeta", "efectivo", "cortesia"];
const usuario = {
    nombre: 'Cliente',
    apellido: "Test",
    tipodoc: "DNI",
    dni: "12345678"
};
const operacion = {
    id_operaciones: _.random(1, 9999999),
    fecha: `${new Date("2024-01-01 12:00").toLocaleDateString('es-AR')}`,
    hora:`${new Date("2024-01-01 12:00").toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`,
    metodo_pago:  metodosDePago[_.random(0, 2)],
    precio_regular: 100.00,
    moneda: "$",
    emision_count: 1,
    cortesia_descri: "",
};
const evento = {
    descri: "Descripción del Evento",
    importante_ticket: "Información importante"
};
const funcion = {
    fecha: `${new Date("2024-01-01").toLocaleDateString('es-AR')}`,
    horario: "19:00"
};
const ticket = {
    label: "",
    fila: 1,
    asiento: 5,
    sector: "Sector",
    qr: "101010101010.1010101010",
    ticketId:0,
    fecha: `${new Date().toLocaleDateString('es-AR')}`,
    columna: "",
};
const operador = {
    username: 'admin',
}
let template = `
<center>
  <p>*** TK PRUEBA NO VÁLIDO ***</p>
  <br/>
</center>
<doublewidth>
  <textsize width="2" height="2"/>
  <p>suticket.com</p>
  <br/>
</doublewidth>
<div>
  <p>PV ${_.padEnd(operador.username, 14)}      Nro. Operación ${_.padStart(operacion.id_operaciones, 6, '0')}</p>
  <p>Fecha ${ticket.fecha}              Hora: ${operacion.hora}</p>
</div>
<br/>
`;
if (operacion.metodo_pago === 'cortesia' || !operacion.metodo_pago) {
  if (operacion.cortesia_descri) {
    const cortesiaDescriChunks = _.chunk(operacion.cortesia_descri, 40).map(chunk => chunk.join('')).join('\n');
    template += `<p>${cortesiaDescriChunks}</p>`
  }
  template += `<center><p>*** CORTESIA ***</p><br/></center>`;
}else {
  template += `<p>${usuario.nombre}${usuario.apellido ? ' ' + usuario.apellido : ''} ${usuario.tipodoc} ${usuario.dni}</p>
  <br/>
  <p><leftRight left="TOTAL" right="${operacion.moneda} ${operacion.precio_regular.toFixed(2)}"/></p>
  <br/>`;
}

template += `
<center>
  <doublewidth>
    <p>${evento.descri}</p>
    <br/>
  </doublewidth>
  <p><b>Función del ${funcion.fecha} a las ${funcion.horario} horas</b></p>
  <br/>
  <doublewidth>
    <p>${ticket.sector}</p>
  </doublewidth>
  <br/>
</center>
`;
if (ticket.label && ticket.label.trim() !== '') {
  template += `<center><textsize width="1" height="1"/><p>${ticket.label}</p></center>`
} else if (ticket.fila === 0 && ticket.asiento === 0) {
  template += `<center><textsize width="1" height="1"/><p>SIN NUMERAR</p></center>`
} else {
  template += `<center><textsize width="1" height="1"/><p>   FILA     ASIENTO</p><br/><p>${ticket.fila}    ${ticket.columna === '' ? ticket.asiento : ticket.columna}</p></center><br/>`
}
template += `
<center>
  <div><qrcode data="${(ticket.ticketId === 0 || !ticket.ticketId || ticket.ticketId === '0') ? "101010101010.1010101010" : ticket.qr}" correction="L" cellsize="8" model="1"/></div>
  <p>Muchas gracias por su compra</p>
  <br/>
</center>`;
if (evento.importante_ticket && evento.importante_ticket.trim() !== '') {
  const importanteTicketChunks = _.chunk(evento.importante_ticket, 40).map(chunk => chunk.join('')).join('\n');
  template += `<center><p>${importanteTicketChunks}</p><br></center>`
}
template += `
<center>
  <p>No se admiten cambios ni devoluciones</p>
  <br/>
  <p>${operador.username} ${new Date().toLocaleString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} # ${(operacion.emision_count + 1)}</p>
  <br/>
  <p>*** TK PRUEBA NO VÁLIDO ***</p>
</center>`;
convert(template).then((result) => {
  console.log(result);
})
//execute(printer, template).then(console.log).catch(console.log);