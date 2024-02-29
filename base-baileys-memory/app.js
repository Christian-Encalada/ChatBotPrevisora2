const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

//flujo fin
const flujoFin = addKeyword("Terminar").addAnswer("¡Hasta luego! Gracias por usar Eribot. 🤖")

//flujo problemaws internet
const flujoInternet = addKeyword("2").addAnswer("PROBANDO... PROBANDO *FUNCION AUN NO DISPONIBLE 🎠*") 

//flujo problemas computador
const flujoComputador = addKeyword("3").addAnswer("PROBANDO... PROBANDO *FUNCION AUN NO DISPONIBLE 🎠*")

//flujo 
const flujoOlvideContrasena = addKeyword("1").addAnswer("¡No te preocupes! Aquí están los pasos para recuperar tu contraseña:")
.addAnswer(["1. Ingresa a este link.",
            "2. Ve a la página de inicio de sesión.",
            "3. Haz clic en '¿Olvidaste tu contraseña?'",
            "4. Ingresa tu dirección de correo electrónico y haz clic en 'Enviar'.",
            "5. Revisa tu correo electrónico para el enlace de restablecimiento de contraseña.",
            "6. Haz clic en el enlace y establece una nueva contraseña.",
            "Puedes escribir *Terminar* para finalizar la conversación"],
             null, 
             null, 
             [flujoFin])




const flujoCambiarContrasena = addKeyword("2").addAnswer("Aquí están los pasos para cambiar tu contraseña:")
.addAnswer(["1. Ve a la página de configuración de tu cuenta.",
            "2. Haz clic en 'Cambiar contraseña'.",
            "3. Ingresa tu contraseña actual.",
            "4. Ingresa tu nueva contraseña y confírmala.",
            "5. Haz clic en 'Guardar' o 'Actualizar'.",
            "¡Listo! podras cambiar tu contraseña exitosamente.",
            "Puedes escribir *Terminar* para finalizar la conversación"], 
            null, 
            null, [flujoFin])




//FLujo de problemas recurrentes con la contraseña
 const flujoContrasena = addKeyword("1").addAnswer("¿Cual de estos es tu problema? 🧐 ")
 .addAnswer(["1. Olvide mi contraseña",
              "2. Cambiar contraseña",
              "Escribe el numero *1* o *2* segun tu necesidad en el chat 👆",
              "También puedes escribir *Terminar* para finalizar la conversación"],
              null, 
              null,
              [flujoOlvideContrasena, flujoCambiarContrasena, flujoFin]

)    




 //flujo para las opciones del menu
 const flujoMenu = addKeyword('Menu').addAnswer('📋 Soy Eribot y puedo ayudarte con lo siguiente:',  { capture: true }, (ctx, { fallBack }) => {
    if (!ctx.body.includes("Menu")) {
        console.log("Mensaje entrante:", ctx.body); // Aquí se imprime en la consola lo que escriba el usuario
        return fallBack();
    }})

.addAnswer(
    [    '1. 🎉 Problemas de Contraseñas',
         '2. 🎁 Problemas con el Internet',
         '3. 🚀 Problemas con el Computador',
         'Escribe el numero *1* *2* o *3* segun tu necesidad en el chat 👆',
         "También puedes escribir *Terminar* para finalizar la conversación"],
         null,
         null,
    
        [flujoContrasena, flujoInternet, flujoComputador, flujoFin])
  




//flujo main
const flujoPrincipal = addKeyword(['Hola','ola', 'oli','oa','buenas', 'buenos dias','buenas tardes','buenas noches'])
.addAnswer('👋 ¡Hola soy Eribot! ¿En qué puedo ayudarte hoy?')
.addAnswer(
    ['Escribeme *Menu* para ver mas opciones', 
    "También puedes escribir *Terminar* para finalizar la conversación"], 
    null,
    null,
    [flujoMenu, flujoFin])



 //flujo Secundario
const flujoSecundario = addKeyword(['Gracias', 'Muchas gracias']).addAnswer('De nada! 👌 Espero haberte ayudado')



const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal, flujoSecundario])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
