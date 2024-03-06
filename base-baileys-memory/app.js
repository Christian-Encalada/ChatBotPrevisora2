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

const flujoTicket = addKeyword("ticket").addAnswer("Buenas pronto un asesor personalizado se pondra en contacto contigo... 🫡")
.addAnswer("Funcion aun no disponible... 🤖")


//flujo problemas computador
const flujoComputador = addKeyword("3").addAnswer("PROBANDO... PROBANDO *FUNCION AUN NO DISPONIBLE 🎠*")



const flujoCableado = addKeyword("cableado").addAnswer("Si tienes cableado intenta esto: ")
.addAnswer(["1. Verifica si el cable LAN esta correctamente conectado al computador y al punto de red.",
            "2. Si no están conectados correctamente, sigue las imágenes que estás viendo para ver cómo deberían estar conectados tanto el pc como el punto de red: "
],{
    media: 'https://i.imgur.com/9T2vVXo.png'
})
.addAnswer("👆", {
    media: 'https://i.imgur.com/y9PCV19.png'
})
.addAnswer(["3. En caso de que todo este correctamente conectado, intente reinciando la maquina",
            "SI esto resolvio tu problema, me alegro a ver sido de ayuda 🫡 escribe *Terminar* para finalizar el chat.",
            "Pero en el caso de que esto no alla solucionado tu problema  de conexion 😓 escribe *Ticket* para que un asesor profesional pueda ayudarte 🫡"
],
null,
null,
[flujoFin, flujoTicket]
)

const flujoWifi = addKeyword("wifi").addAnswer("Si tienes wifi intenta esto: ")
.addAnswer("1. Verificar en el icono de wifi si esta conectado a la red: ",{
    media: 'https://i.imgur.com/P9PDNj0.png'
})
.addAnswer("2. Si esta conectado a la red deberas desconectar y conectar el wifi para posteriormente reiniciar la pc. ")
.addAnswer("En caso de que esto alla solucionado tu problema puedes escribir *Terminar* para finalizar el chat 🫡")
.addAnswer("Pero en el caso de que esto no alla solucionado tu problema  de wifi 😓 escribe *Ticket* para que un asesor profesional pueda ayudarte 🫡",
    null,
    null,
    [flujoFin, flujoTicket]
)

const flujoAllPaginas = addKeyword("2").addAnswer("Para poder ayudarte con tu problema de mejor manera primero necesito que respondas una pregunta:")
.addAnswer("Tienes internet por ¿*Wifi* o *Cableado*?")
.addAnswer("Escribe en el chat *Wifi* o *Cableado* para respoder.", {capture:true},(ctx)=>{
    const textoEntrante = ctx.body.trim().toLowerCase(); // Convertir a minúsculas 
    if (textoEntrante !== 'wifi' && textoEntrante !== 'cableado' && textoEntrante !== 'terminar') {
        console.log("Mensaje entrante: ", ctx.body);
        return fallBack();
    }},
    [flujoWifi, flujoCableado, flujoFin])


const flujo1Pagina = addKeyword("1").addAnswer("Posible Solucion: ")
.addAnswer(["1. Usa los datos moviles tuyos o de algun compañero",
            "",   
            "2. Ingresa a la pagina desde el celular *con los datos moviles*",
            "",
            "3. Si la pagina no te carga, lo mas probable es que sea un problema en especifico de esa pagina que no depende de nuestro proveedor de internet. 😓"])
.addAnswer("En caso de que la pagina si te cargue desde tu celular con datos moviles escribe *Ticket* para que un asesor profesional te ayude a resolver tu problema 🫡")
.addAnswer("Puedes escribir *Terminar* para finalizar la conversación 🤖", 
null,
null,
[flujoTicket, flujoFin])



//flujo problemaws internet
const flujoInternet = addKeyword("2").addAnswer("¿Cual es tu problema 🧐?") 
.addAnswer(["1. NO tienes acceso a UNA pagina en especifico: ",
            "2. NO tienes acceso a NINGUNA pagina: ",
            "",
            "Escribe el numero *1* o *2* segun tu necesidad en el chat 👆",
            "También puedes escribir *Terminar* para finalizar la conversación 🤖"
            ],
       { capture: true },
            (ctx, { fallBack }) => {
                const textoEntrante = ctx.body.trim().toLowerCase(); // Convertir a minúsculas
                if (textoEntrante !== '1' && textoEntrante !== '2' && textoEntrante !== 'terminar') {
                    console.log("Mensaje entrante: ", ctx.body);
                    return fallBack();
                } 
        },[flujo1Pagina,flujoAllPaginas ,flujoFin])

//flujo olvide contraseña
const flujoOlvideContrasena = addKeyword("1").addAnswer("¡No te preocupes! Aquí están los pasos para recuperar tu contraseña:", {
    media:'https://i.imgur.com/LQI8cPY.png'
    })
.addAnswer("👇",{
    media: 'https://i.imgur.com/0w0zIs0.png'
})
.addAnswer(["1. Ve a nuestro sitio web ",
            "2. haz clic en 'Olvidé mi contraseña' ",
            "3. Sigue las instrucciones para restablecer tu contraseña",
            "¡Listo! podras recuperar tu contraseña exitosamente.",
            "Puedes escribir *Terminar* para finalizar la conversación 🤖" ],
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
            "Puedes escribir *Terminar* para finalizar la conversación 🤖"], 
            null, 
            null, [flujoFin])


//FLujo de problemas recurrentes con la contraseña
 const flujoContrasena = addKeyword("1").addAnswer("¿Cual de estos es tu problema? 🧐 ")
 .addAnswer(["1. Olvide mi contraseña",
              "2. Cambiar contraseña",
              "Escribe el numero *1* o *2* segun tu necesidad en el chat 👆",
              "También puedes escribir *Terminar* para finalizar la conversación 🤖"],
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
            "También puedes escribir *Terminar* para finalizar la conversación 🤖"
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
            "También puedes escribir *Terminar* para finalizar la conversación 🤖"
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