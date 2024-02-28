const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')

//flujo 
const flujoOlvideContrasena = addKeyword("1").addAnswer("¡No te preocupes! Aquí están los pasos para recuperar tu contraseña:")
.addAnswer("1. Ingresa a este link.")
.addAnswer("2. Ve a la página de inicio de sesión.")
.addAnswer("3. Haz clic en '¿Olvidaste tu contraseña?'")
.addAnswer("4. Ingresa tu dirección de correo electrónico y haz clic en 'Enviar'.")
.addAnswer("5. Revisa tu correo electrónico para el enlace de restablecimiento de contraseña.")
.addAnswer("6. Haz clic en el enlace y establece una nueva contraseña.")


const flujoCambiarContrasena = addKeyword("2").addAnswer("Aquí están los pasos para cambiar tu contraseña:")
.addAnswer("1. Ve a la página de configuración de tu cuenta.")
.addAnswer("2. Haz clic en 'Cambiar contraseña'.")
.addAnswer("3. Ingresa tu contraseña actual.")
.addAnswer("4. Ingresa tu nueva contraseña y confírmala.")
.addAnswer("5. Haz clic en 'Guardar' o 'Actualizar'.")
.addAnswer("¡Listo! Has cambiado tu contraseña exitosamente.")


//FLujo de problemas recurrentes con la contraseña
 const flujoContrasena = addKeyword("1").addAnswer("¿Cual de estos es tu problema? 🧐 ")
 .addAnswer("1. Olvide mi contraseña", null, [flujoOlvideContrasena])    
 .addAnswer("2. Cambiar contraseña", null, [flujoCambiarContrasena])    
 .addAnswer("Escribe el numero *1* o *2* segun tu necesidad en el chat 👆")  

 //flujo para las opciones del menu
 const flujoMenu = addKeyword('Menu').addAnswer('📋 Soy Eribot y puedo ayudarte con lo siguiente:')
     .addAnswer('1. 🎉 Problemas de Contraseñas ', [flujoContrasena])
     .addAnswer('2. 🎁 Problemas con el Internet')
     .addAnswer('3. 🚀 Problemas con el Computador')
     .addAnswer('Escribe el numero *1* *2* o *3* segun tu necesidad en el chat 👆')



//flujo main
const flujoPrincipal = addKeyword(['Hola','ola', 'oli','oa','buenas', 'buenos dias','buenas tardes','buenas noches'])
.addAnswer('👋 ¡Hola soy Eribot! ¿En qué puedo ayudarte hoy?')
.addAnswer('Escribeme *Menu* para ver mas opciones', {capture: true}, (ctx,{ fallBack })=> {
    if(!ctx.body.includes("Menu")) {
        return fallBack()
    }
    console.log("Mensaje entrante: ", ctx.body)
},

 )

 //flujo Secundario
const flujoSecundario = addKeyword(['Gracias', 'Muchas gracias']).addAnswer('De nada! 👌 Espero haberte ayudado')

const flujoPrueba = addKeyword(["amorxi", "amorci", "amor"]).addAnswer("Hola mi amor ti amo muack ando trabajanding. ❤️😊")
   

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal, flujoSecundario, flujoMenu, flujoPrueba])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
