const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

// const flowSecundario = addKeyword(['2', 'siguiente']).addAnswer(['📄 Aquí tenemos el flujo secundario'])

// const flowDocs = addKeyword(['doc', 'documentacion', 'documentación']).addAnswer(
//     [
//         '📄 Aquí encontras las documentación recuerda que puedes mejorarla',
//         'https://bot-whatsapp.netlify.app/',
//         '\n*2* Para siguiente paso.',
//     ],
//     null,
//     null,
//     [flowSecundario]
// )

// const flowTuto = addKeyword(['tutorial', 'tuto']).addAnswer(
//     [
//         '🙌 Aquí encontras un ejemplo rapido',
//         'https://bot-whatsapp.netlify.app/docs/example/',
//         '\n*2* Para siguiente paso.',
//     ],
//     null,
//     null,
//     [flowSecundario]
// )

// const flowGracias = addKeyword(['gracias', 'grac']).addAnswer(
//     [
//         '🚀 Puedes aportar tu granito de arena a este proyecto',
//         '[*opencollective*] https://opencollective.com/bot-whatsapp',
//         '[*buymeacoffee*] https://www.buymeacoffee.com/leifermendez',
//         '[*patreon*] https://www.patreon.com/leifermendez',
//         '\n*2* Para siguiente paso.',
//     ],
//     null,
//     null,
//     [flowSecundario]
// )

// const flowDiscord = addKeyword(['discord']).addAnswer(
//     ['🤪 Únete al discord', 'https://link.codigoencasa.com/DISCORD', '\n*2* Para siguiente paso.'],
//     null,
//     null,
//     [flowSecundario]
// )

// const flowPrincipal = addKeyword(['hola', 'ole', 'alo'])
//     .addAnswer('🙌 Hola bienvenido a este *Chatbot*')
//     .addAnswer(
//         [
//             'te comparto los siguientes links de interes sobre el proyecto',
//             '👉 *doc* para ver la documentación',
//             '👉 *gracias*  para ver la lista de videos',
//             '👉 *discord* unirte al discord',
//         ],
//         null,
//         null,
//         [flowDocs, flowGracias, flowTuto, flowDiscord]
//     )

const flujoPrincipal = addKeyword(['Hola','ola', 'oli','oa','buenas', 'buenos dias','buenas tardes','buenas noches'])
.addAnswer('👋 ¡Hola soy Eribot! ¿En qué puedo ayudarte hoy?')
.addAnswer('Escribeme *Menu* para ver mas opciones', {capture: true}, (ctx,{ fallBack })=> {
    if(!ctx.body.includes("Menu")) {
        return fallBack()
    }
    console.log("Mensaje entrante: ", ctx.body)
},

 )

const flujoSecundario = addKeyword(['Gracias', 'Muchas gracias']).addAnswer('De nada! 👌 Espero haberte ayudado')

const flujoMenu = addKeyword('Menu').addAnswer('📋 Soy Eribot y puedo ayudarte con lo siguiente:')
     .addAnswer('1. 🎉 Problemas de Contraseñas ')
     .addAnswer('2. 🎁 Problemas con el Internet')
     .addAnswer('3. 🚀 Problemas con el Computador')
     .addAnswer('Escribe el numero *1* *2* o *3* segun tu necesidad en el chat 👆')


 const flujoContrasena = addKeyword("1").addAnswer("¿Cual de estos es tu problema? 🧐 ")
 .addAnswer("1. Olvide mi contraseña")    
 .addAnswer("2. Cambiar contraseña")    
 .addAnswer("Escribe el numero *1* o *2* segun tu necesidad en el chat 👆")    



const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal, flujoSecundario, flujoMenu])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
