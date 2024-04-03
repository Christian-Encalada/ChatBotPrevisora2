const { addKeyword, addAnswer, EVENTS } = require('@bot-whatsapp/bot');
const { createBot, createFlow, createProvider } = require('@bot-whatsapp/bot');


const flujoInactivo = addKeyword(EVENTS.ACTION).addAnswer('Se canceló por inactividad')

module.exports = flujoInactivo;