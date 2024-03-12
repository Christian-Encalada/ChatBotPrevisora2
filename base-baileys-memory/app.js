const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter  = require('@bot-whatsapp/database/postgres')

// Función para consultar la base de datos en busca de la cédula del usuario
async function consultarBaseDeDatos(cedula, adapterDB) {
    try {
        // Realiza la consulta a la base de datos
        const query = `SELECT * FROM tabla_usuarios WHERE cedula = $1`;
        const result = await adapterDB.query(query, [cedula]);

        // Verifica si se encontró algún usuario con la cédula proporcionada
        if (result.rows.length > 0) {
            // Devuelve el primer usuario encontrado (asumiendo que no hay duplicados en la base de datos)
            return result.rows[0];
        } else {
            // Si no se encontró ningún usuario, devuelve null
            return null;
        }
    } catch (error) {
        console.error('Error al consultar la base de datos:', error);
        throw error; // Reenvía el error para que sea manejado en otro lugar si es necesario
    }
}


//flujo fin
const flujoFin = addKeyword("terminar").addAnswer("¡Hasta luego! Gracias por usar Eribot. 🤖")

const flujoTicket = addKeyword("ticket").addAnswer("Buenas pronto un asesor personalizado se pondra en contacto contigo... 🫡")
.addAnswer("Funcion aun no disponible... 🤖")

const flujo6Computador = addKeyword("6").addAnswer("Posible solucion de: Olvidé mi contraseña de inicio de sesión. 👨‍💻")
.addAnswer("Si olvidaste la contraseña de tu computadora, lastimosamente la unica solucion es pedir un *Ticket* para que profesional pueda crearte un nuevo usuario. 👤")
.addAnswer("Escribe *Ticket* para notificar a un asesor profesional de tu problema ✅",
null,
null,
[flujoFin, flujoTicket])

const flujo5Computador = addKeyword("5").addAnswer("Posible solucion de: Mi pantalla está en negro. ⬛ ")
.addAnswer("1. Si es una pc de escritorio asegúrate de que el cable de video (generalmente HDMI o VGA) esté conectado correctamente tanto a la pc como al monitor.")
.addAnswer("2. Mantén presionado el botón de encendido durante varios segundos hasta que la laptop se apague por completo. Luego, enciéndela nuevamente para ver si se resuelve el problema..")
.addAnswer("3. Si tienes una laptop con batería extraíble, apaga la laptop, retira la batería y mantenla fuera durante al menos un minuto. Vuelve a colocar la batería y enciende la laptop para ver si se soluciona el problema.")
.addAnswer(["4. Conecta la laptop a un monitor externo utilizando un cable VGA, HDMI o DisplayPort (según las conexiones disponibles).",
            "Si el monitor muestra la imagen correctamente, es probable que haya un problema con la pantalla de la laptop"])
.addAnswer(" Si nada de esto funciona, o verificaste que el problema es la pantalla escribe *Ticket* para que un asesor profesional te ayude. ✅ ",
null,
null,
[flujoFin, flujoTicket])

const flujo4Computador = addKeyword("4").addAnswer("Posible solucion de: No puedo imprimir. 🖨️")
.addAnswer("1. Verifica que la impresora esté encendida y conectada correctamente a la computadora.")
.addAnswer("2. Asegúrate de que haya papel y tinta o tóner suficiente en la impresora.")
.addAnswer("3. Reinicia la impresora y la computadora.")
.addAnswer("4. Intenta imprimir un documento diferente para descartar problemas con el archivo específico.")
.addAnswer("Si nada de esto funciona, escribe *Ticket* para que un asesor profesional te ayude. ✅",
null,
null,
[flujoFin, flujoTicket])

const flujo3Computador = addKeyword("3").addAnswer("Posible solucion de: Pantalla congelada o sin respuesta. 🥶")
.addAnswer(["1. Intenta presionar las teclas Ctrl + Alt + Supr con las que se te abriran unas opciones a las cuales puedes darle a BLOQUEAR, para volver a iniciar sesion y probablemente se descongelara la pantalla.",
            "Tambien puedes darle a la opcion de 'Adminstrador de tareas' para cerrar algun programa que este casuando el congelamiento."])
.addAnswer("2. Si eso no funciona, intenta reiniciar la computadora manteniendo presionado el botón de encendido durante unos segundos.")
.addAnswer("Si nada de esto funciona, escribe *Ticket* para que un asesor profesional te ayude. ✅",
null,
null,
[flujoFin, flujoTicket])

const flujo2Computador = addKeyword("2").addAnswer("Posible solucion de: La computadora/laptop está demasiado lenta. 🐌")
.addAnswer("1. Reinicia la computadora.")
.addAnswer("2. Cierra todos los programas y pestañas que no estés utilizando.")
.addAnswer("Si sigue siendo demasiado lenta, escribe *Ticket* para que un asesor profesional te asista. ✅",
null,
null,
[flujoFin, flujoTicket])


const flujo1Computador = addKeyword("1").addAnswer("Posible solucion de: La computadora/laptop no enciende 💻")
.addAnswer("1. Asegúrate de que esté conectada a una fuente de energía.")
.addAnswer("2. Verifica que el cable de alimentación esté enchufado correctamente tanto en la computadora como en el enchufe.")
.addAnswer("3. Verifica si hay una luz indicadora en el dispositivo que muestre que está recibiendo energía.")
.addAnswer("4. Intenta presionar el botón de encendido durante al menos 10 segundos para reiniciarla.", {
    media: 'https://i.imgur.com/Xi8FfQA.png'
})
.addAnswer("5. Si nada de esto funciona, escribe *Ticket* para que un asesor profesional te ayude. ✅",
null,
null,
[flujoFin, flujoTicket])

//flujo problemas computador
const flujoComputador = addKeyword("3").addAnswer("¿Cual es tu problema? ")
.addAnswer (["1. La computadora/laptop no enciende 💻",
             "",   
             "2. La computadora/laptop está demasiado lenta. 🐌",
             "",
             "3. Pantalla congelada o sin respuesta. 🥶",
             "",
             "4. No puedo imprimir. 🖨️",
             "",
             "5. Mi pantalla está en negro. ⬛",
             "",
             "6. Olvidé mi contraseña de inicio de sesión. 👨‍💻 "   
])
.addAnswer(["Escribe el número *1*, *2*, *3*, *4*, *5* o *6* según tu necesidad en el chat 👆",
            "También puedes escribir *Terminar* para finalizar la conversación 🤖"
            
        ], {capture:true},(ctx, {fallBack})=>
        {
            const textoEntrante = ctx.body.trim().toLowerCase(); // Convertir a minúsculas 
            if (textoEntrante !== '1' && textoEntrante !== '2' && textoEntrante !== '3'  && textoEntrante !== '4' && textoEntrante !== '5' && textoEntrante !== '6' && textoEntrante !== 'terminar') {
                console.log("Mensaje entrante: ", ctx.body);
                return fallBack();
            }},[flujoFin, flujo1Computador, flujo2Computador, flujo3Computador, flujo4Computador, flujo5Computador, flujo6Computador])
        

const flujoCableado = addKeyword("cableado").addAnswer("Si tienes cableado intenta esto: ")
.addAnswer("1. Verifica si el cable LAN esta correctamente conectado al computador y al punto de red.",{
    media: 'https://i.imgur.com/9T2vVXo.png'
})
.addAnswer(["👆",
            "2. Si no están conectados correctamente, sigue las imágenes que estás viendo para ver cómo deberían estar conectados tanto el pc como el punto de red: "],{
                media: 'https://i.imgur.com/y9PCV19.png'
            })
    

.addAnswer("3. En caso de que todo este correctamente conectado, intente reinciando la maquina")
.addAnswer("SI esto resolvio tu problema, me alegro a ver sido de ayuda 🫡 escribe *Terminar* para finalizar el chat.")
.addAnswer("Pero en el caso de que esto no alla solucionado tu problema  de conexion 😓 escribe *Ticket* para que un asesor profesional pueda ayudarte ✅",
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
.addAnswer("Pero en el caso de que esto no alla solucionado tu problema  de wifi 😓 escribe *Ticket* para que un asesor profesional pueda ayudarte. ✅",
    null,
    null,
    [flujoFin, flujoTicket]
)

const flujoAllPaginas = addKeyword("2").addAnswer("Para poder ayudarte con tu problema de mejor manera primero necesito que respondas una pregunta:")
.addAnswer("Tienes internet por ¿ *Wifi* o *Cableado* ?")
.addAnswer("Escribe en el chat *Wifi* o *Cableado* para respoder. 🫡", {capture:true},(ctx, {fallBack})=>{
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
.addAnswer("En caso de que la pagina si te cargue desde tu celular con datos moviles escribe *Ticket* para que un asesor profesional te ayude a resolver tu problema. ✅")
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
const flujoOlvideContrasena = addKeyword("1").addAnswer("¡No te preocupes! 🫡 Aquí están los pasos para recuperar tu contraseña:", {
    media:'https://i.imgur.com/LQI8cPY.png'
    })
.addAnswer("👇",{
    media: 'https://i.imgur.com/0w0zIs0.png'
})
.addAnswer(["1. Ve a nuestro sitio web: https://bpm.manabi.gob.ec/ ",
            "2. haz clic en 'Olvidé mi contraseña' ",
            "3. Sigue las instrucciones de la pagina para restablecer tu contraseña",
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
 .addAnswer(["1. Olvide mi contraseña 🪪",
             "",
             "2. Cambiar contraseña 🔑"])
.addAnswer(["Escribe el numero *1* o *2* segun tu necesidad en el chat 👆",
              "También puedes escribir *Terminar* para finalizar la conversación 🤖"], { capture: true },
              (ctx, { fallBack }) => {
                  const textoEntrante = ctx.body.trim().toLowerCase(); // Convertir a minúsculas 
                  if (textoEntrante !== '1' && textoEntrante !== '2' && textoEntrante !== 'terminar') {
                      console.log("Mensaje entrante: ", ctx.body);
                      return fallBack();
                  } 
              },
              [flujoOlvideContrasena, flujoCambiarContrasena, flujoFin]
)    


// Flujo para las opciones del menú
const flujoMenu = addKeyword(['menu']).addAnswer('📋 Soy Eribot y puedo ayudarte con lo siguiente:')
    .addAnswer(
        [
            '1. 🪪 Problemas de Contraseñas',
            '2. 🛜 Problemas con el Internet',
            '3. 💻 Problemas con el Computador'])
.addAnswer(['Escribe el número *1*, *2* o *3* según tu necesidad en el chat 👆',
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


    const flujoPrincipal = addKeyword(['hola', 'ola', 'oli', 'oa', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches'])
    .addAnswer('👋 ¡Hola soy Eribot! ¿Cuál es tu cédula?')
    .addAnswer(
        [
            'Escribeme *Menu* para ver más opciones',
            "También puedes escribir *Terminar* para finalizar la conversación 🤖"
        ],
        { capture: true },
        async (ctx, { fallBack }) => {
            const cedula = ctx.body.trim(); // Obtener la cédula ingresada por el usuario
            // Verificar si la cédula está en la base de datos
            const user = await consultarBaseDeDatos(cedula);
            if (!user) {
                ctx.sendText('Lo siento, no pude encontrar tu cédula en nuestra base de datos. Por favor, verifica e inténtalo nuevamente.');
                return fallBack();
            } else {
                // Continuar con el flujo principal
                return null;
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