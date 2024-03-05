const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter  = require('@bot-whatsapp/database/postgres')

/**
 * Declaramos las conexiones de PostgreSQL
 */

const POSTGRES_DB_HOST = 'localhost'
const POSTGRES_DB_USER = 'postgres'
const POSTGRES_DB_PASSWORD = '12345'
const POSTGRES_DB_NAME = 'chatBot'
const POSTGRES_DB_PORT = '5432'

//flujo fin
const flujoFin = addKeyword("terminar").addAnswer("¡Hasta luego! Gracias por usar Eribot. 🤖")

//flujo problemas computador
const flujoComputador = addKeyword("3").addAnswer("PROBANDO... PROBANDO *FUNCION AUN NO DISPONIBLE 🎠*")


const flujo1Pagina = addKeyword("1").addAnswer("Posible Solucion: ")
.addAnswer(["1. Usa los datos moviles tuyos o de algun compañero",
            "2. Ingresa a la pagina desde tu celular",
            "3. Si la pagina te carga"

])


//flujo problemaws internet
const flujoInternet = addKeyword("2").addAnswer("¿Cual es tu problema 🧐?") 
.addAnswer(["1. NO tienes acceso a una pagina especifica: ",
            "2. NO tienes acceso a ninguna pagina: ",
            "También puedes escribir *Terminar* para finalizar la conversación"
            ],
       { capture: true },
            (ctx, { fallBack }) => {
                const textoEntrante = ctx.body.trim().toLowerCase(); // Convertir a minúsculas
                if (textoEntrante !== '1' && textoEntrante !== '2' && textoEntrante !== 'terminar') {
                    console.log("Mensaje entrante: ", ctx.body);
                    return fallBack();
                } 
        },[flujo1Pagina, flujoFin])

//flujo olvide contraseña
const flujoOlvideContrasena = addKeyword("1").addAnswer("¡No te preocupes! Aquí están los pasos para recuperar tu contraseña:", {
    media:'C:/Users/DYNABOOK/ChatBotPrevisora2/base-baileys-memory/images/pruebas.png'
    })
.addAnswer("👇",{
    media: 'C:/Users/DYNABOOK/ChatBotPrevisora2/base-baileys-memory/images/prueba 2.png'
})
.addAnswer(["1. Ve a nuestro sitio web ",
            "2. haz clic en 'Olvidé mi contraseña' ",
            "3. Sigue las instrucciones para restablecer tu contraseña",
            "¡Listo! podras recuperar tu contraseña exitosamente.",
            "Puedes escribir *Terminar* para finalizar la conversación 🫡" ],
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


// Flujo para las opciones del menú
const flujoMenu = addKeyword(['menu']).addAnswer('📋 Soy Eribot y puedo ayudarte con lo siguiente:')
    .addAnswer(
        [
            '1. 🎉 Problemas de Contraseñas',
            '2. 🎁 Problemas con el Internet',
            '3. 🚀 Problemas con el Computador',
            'Escribe el número *1*, *2* o *3* según tu necesidad en el chat 👆',
            "También puedes escribir *Terminar* para finalizar la conversación"
        ],
        { capture: true },
        (ctx, { fallBack }) => {
            const textoEntrante = ctx.body.trim().toLowerCase(); // Convertir a minúsculas
            if (textoEntrante !== '1' && textoEntrante !== '2' && textoEntrante !== '3' && textoEntrante !== 'terminar') {
                console.log("Mensaje entrante: ", ctx.body);
                return fallBack();
            } 
        },
        [flujoContrasena, flujoInternet, flujoComputador, flujoFin]
    );


// Flujo principal
const flujoPrincipal = addKeyword(['hola', 'ola', 'oli', 'oa', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches'])
    .addAnswer('👋 ¡Hola soy Eribot! ¿En qué puedo ayudarte hoy?')
    .addAnswer(
        [
            'Escribeme *Menu* para ver más opciones',
            "También puedes escribir *Terminar* para finalizar la conversación"
        ],
        { capture: true },
        (ctx, { fallBack }) => {
            const textoEntrante = ctx.body.trim().toLowerCase(); // Convertir a minúsculas
            if (textoEntrante !== 'menu' && textoEntrante !== 'terminar') {
                console.log("Mensaje entrante: ", ctx.body);
                return fallBack();
            } 
        },
        [flujoMenu, flujoFin]
    );


 //flujo Secundario
const flujoSecundario = addKeyword(['Gracias', 'Muchas gracias']).addAnswer('De nada! 👌 Espero haberte ayudado')

const flujoBotones = addKeyword(["botones", "boton"]).addAnswer('Mira estas opciones: ', {
    buttons: [
        {
          body: 'imagen'  
        }
    ]
   
})

const main = async () => {
    const adapterDB = new PostgreSQLAdapter({
        host: POSTGRES_DB_HOST,
        user: POSTGRES_DB_USER,
        database: POSTGRES_DB_NAME,
        password: POSTGRES_DB_PASSWORD,
        port: POSTGRES_DB_PORT,
    })
    const adapterFlow = createFlow([flujoPrincipal, flujoSecundario, flujoBotones])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()