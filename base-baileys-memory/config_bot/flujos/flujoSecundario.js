const { addKeyword, addAnswer } = require('@bot-whatsapp/bot');
const { createBot, createFlow, createProvider } = require('@bot-whatsapp/bot');


//flujo Secundario
 const flujoSecundario = addKeyword(['Gracias', 'Muchas gracias']).addAnswer('De nada! 👌 Espero haberte ayudado')