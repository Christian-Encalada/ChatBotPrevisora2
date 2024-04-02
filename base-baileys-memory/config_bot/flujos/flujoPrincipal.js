require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env
const { Client } = require('pg');
const { POSTGRES_DB_HOST, POSTGRES_DB_USER, POSTGRES_DB_PASSWORD, POSTGRES_DB_NAME, POSTGRES_DB_PORT, POSTGRES_DB_HOST2, POSTGRES_DB_USER2, POSTGRES_DB_PASSWORD2, POSTGRES_DB_NAME2, POSTGRES_DB_PORT2 } = process.env;
const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot')
const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter  = require('@bot-whatsapp/database/postgres')

const validarCedula = require('../validacion/validarCedula');
// Objeto para mapear números de teléfono a cédulas de usuario
const cedulasPorTelefono = {};


//flujo prueba
const flujoPrueba = addKeyword(["1", "2", "3", "4", "5"]).addAnswer("Hasta la proxima. 👋")


const flujoFin = addKeyword("terminar").addAnswer("Gracias por usar Eribot. 🤖")
.addAnswer('Por favor califica nuestro servicio del: *1 al 5* ⭐⭐⭐⭐⭐', { capture: true },
    async (ctx, { capture, fallBack }) => {
        const calificacion = ctx.body.trim(); // Obtener la calificación ingresada por el usuario
        // Obtener la cédula del usuario del objeto cedulasPorTelefono
        const cedulaUsuario = cedulasPorTelefono[ctx.sender];
        
        // Verificar si se encontró la cédula del usuario
        if (cedulaUsuario) {
            const nombreUsuario = cedulaUsuario; // Cambiar cedulaUsuario a nombreUsuario
            // Insertar la calificación junto con el nombre del usuario en la base de datos
            const client = new Client({ user: POSTGRES_DB_USER2, password: POSTGRES_DB_PASSWORD2, database: POSTGRES_DB_NAME2 });
            await client.connect();
            try {
                await client.query('INSERT INTO calificacion (nombre_usuario, puntaje) VALUES ($1, $2)', [nombreUsuario, calificacion]); // Cambiar cedula_usuario a nombre_usuario
                console.log('Calificación registrada en la base de datos');
                // Resto del flujo
            } catch (error) {
                console.error('Error al insertar la calificación en la base de datos:', error);
                // En caso de error, enviar un mensaje de error y volver a pedir la calificación
                addAnswer("Ocurrió un error al registrar la calificación. Por favor intenta nuevamente.");
                return fallBack();
            } finally {
                await client.end();
            }
        } else {
            // En caso de que no se haya encontrado la cédula del usuario, mostrar un mensaje de error
            console.error('No se encontró la cédula del usuario.');
            addAnswer("Ocurrió un error al registrar la calificación. Por favor intenta nuevamente.");
            return fallBack();
        }
    },[flujoPrueba]
);






//flujo ticket
const flujoTicket = addKeyword("ticket").addAnswer("Buenas pronto un asesor personalizado se pondra en contacto contigo... 🫡")
.addAnswer("Funcion aun no disponible... 🤖")

//flujo 6 problema computador
const flujo6Computador = addKeyword("6").addAnswer("Posible solucion de: Olvidé mi contraseña de inicio de sesión. 👨‍💻")
.addAnswer("Si olvidaste la contraseña de tu computadora, lastimosamente la unica solucion es pedir un *Ticket* para que profesional pueda crearte un nuevo usuario. 👤")
.addAnswer("Escribe *Ticket* para notificar a un asesor profesional de tu problema ✅",
null,
null,
[flujoFin, flujoTicket])

//flujo 5 problema computador
const flujo5Computador = addKeyword("5").addAnswer("Posible solucion de: Mi pantalla está en negro. ⬛ ", {
    media: 'https://i.imgur.com/VhTPPu7.png'
})
.addAnswer("1. Si es una pc de escritorio asegúrate de que el cable de video (generalmente HDMI o VGA) esté conectado correctamente tanto a la pc como al monitor.")
.addAnswer("2. Mantén presionado el botón de encendido durante varios segundos hasta que la laptop se apague por completo. Luego, enciéndela nuevamente para ver si se resuelve el problema..")
.addAnswer("3. Si tienes una laptop con batería extraíble, apaga la laptop, retira la batería y mantenla fuera durante al menos un minuto. Vuelve a colocar la batería y enciende la laptop para ver si se soluciona el problema.")
.addAnswer(["4. Conecta la laptop a un monitor externo utilizando un cable VGA, HDMI o DisplayPort (según las conexiones disponibles).",
            "Si el monitor muestra la imagen correctamente, es probable que haya un problema con la pantalla de la laptop"])
.addAnswer(" Si nada de esto funciona, o verificaste que el problema es la pantalla escribe *Ticket* para que un asesor profesional te ayude. ✅ ",
null,
null,
[flujoFin, flujoTicket])

//flujo 4 problema computador
const flujo4Computador = addKeyword("4").addAnswer("Posible solucion de: No puedo imprimir. 🖨️")
.addAnswer("1. Verifica que la impresora esté encendida y conectada correctamente a la computadora.")
.addAnswer("2. Asegúrate de que haya papel y tinta o tóner suficiente en la impresora.", {
    media: 'https://i.imgur.com/dberEF6.jpeg'
})
.addAnswer("3. Reinicia la impresora y la computadora.")
.addAnswer("4. Intenta imprimir un documento diferente para descartar problemas con el archivo específico.")
.addAnswer("Si nada de esto funciona, escribe *Ticket* para que un asesor profesional te ayude. ✅",
null,
null,
[flujoFin, flujoTicket])

//flujo 3 problema computador
const flujo3Computador = addKeyword("3").addAnswer("Posible solucion de: Pantalla congelada o sin respuesta. 🥶")
.addAnswer(["1. Intenta presionar las teclas Ctrl + Alt + Supr con las que se te abriran unas opciones a las cuales puedes darle a BLOQUEAR, para volver a iniciar sesion y probablemente se descongelara la pantalla.",
            "Tambien puedes darle a la opcion de 'Adminstrador de tareas' para cerrar algun programa que este casuando el congelamiento."], {
                media: 'https://i.imgur.com/DXBoN2t.png'
            })
.addAnswer("2. Si eso no funciona, intenta reiniciar la computadora manteniendo presionado el botón de encendido durante unos segundos.")
.addAnswer("Si nada de esto funciona, escribe *Ticket* para que un asesor profesional te ayude. ✅",
null,
null,
[flujoFin, flujoTicket])

//flujo 2 problema computador
const flujo2Computador = addKeyword("2").addAnswer("Posible solucion de: La computadora/laptop está demasiado lenta. 🐌")
.addAnswer("1. Reinicia la computadora.", {
    media: 'https://i.imgur.com/OBHBlo2.png'
})
.addAnswer("2. Cierra todos los programas y pestañas que no estés utilizando.")
.addAnswer("Si sigue siendo demasiado lenta, escribe *Ticket* para que un asesor profesional te asista. ✅",
null,
null,
[flujoFin, flujoTicket])

//flujo 1 problema computador
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
        

//flujo si esta cableado            
const flujoCableado = addKeyword("cableado").addAnswer("Si tienes cableado intenta esto: ")
.addAnswer("1. Verifica si el cable LAN esta correctamente conectado al computador y al punto de red.",{
    media: 'https://i.imgur.com/9T2vVXo.png'
})
.addAnswer(["2. Si no están conectados correctamente, sigue las imágenes que estás viendo para ver cómo deberían estar conectados tanto el pc como el punto de red: "],{
                media: 'https://i.imgur.com/y9PCV19.png'
            })
    

.addAnswer("3. En caso de que todo este correctamente conectado, intente reinciando la maquina")
.addAnswer("SI esto resolvio tu problema, me alegro a ver sido de ayuda 🫡 escribe *Terminar* para finalizar el chat.")
.addAnswer("Pero en el caso de que esto no alla solucionado tu problema  de conexion 😓 escribe *Ticket* para que un asesor profesional pueda ayudarte ✅",
null,
null,
[flujoFin, flujoTicket]
)


//Flujo si tiene wifi
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


//flujo si no le carga ninguna pagina
const flujoAllPaginas = addKeyword("2").addAnswer("Para poder ayudarte con tu problema de mejor manera primero necesito que respondas una pregunta:")
.addAnswer("Tienes internet por ¿ *Wifi* o *Cableado* ?")
.addAnswer("Escribe en el chat *Wifi* o *Cableado* para respoder. 🫡", {capture:true},(ctx, {fallBack})=>{
    const textoEntrante = ctx.body.trim().toLowerCase(); // Convertir a minúsculas 
    if (textoEntrante !== 'wifi' && textoEntrante !== 'cableado' && textoEntrante !== 'terminar') {
        console.log("Mensaje entrante: ", ctx.body);
        return fallBack();
    }},
    [flujoWifi, flujoCableado, flujoFin])

    
//flujo si no le carga 1 pagina en especifico     
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

//flujo  si  olvide contraseña
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


//flujo para saber como cambiar contraseña
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



// Flujo principal
const flujoPrincipal = addKeyword(['hola', 'ola', 'oli', 'oa', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches'])
    .addAnswer('👋 ¡Hola soy Eribot! Antes de continuar por favor escribe tu numero de cedula. 🪪', { capture: true }, 
        async (ctx, { fallBack, flowDynamic }) => {
            const cedula = ctx.body.trim(); // Obtener la cédula ingresada
            // Validar la cédula en la base de datos
            const cedulaValida = await validarCedula(cedula);
            console.log("🆗 Cedula validada");
            console.log(cedulaValida);
            
            // Si la cédula es válida, almacenarla en el objeto y enviar el mensaje de bienvenida
            if (cedulaValida.valid) {
                cedulasPorTelefono[ctx.sender] = cedulaValida.nombre; // Almacenar la cédula en el objeto
                return await flowDynamic(`¡Bienvenido ${cedulaValida.nombre}! 👋`);
            } else {
                addAnswer("La cédula ingresada no es válida. Por favor intenta nuevamente.");
                return fallBack(); 
            }
        })
    .addAnswer(`Soy Eribot y puedo ayudarte con lo siguiente 📋:`, {
        delay: 1000
    })
    .addAnswer(
        [
            '1. 🪪 Problemas de Contraseñas',
            '2. 🛜 Problemas con el Internet',
            '3. 💻 Problemas con el Computador'
        ])    
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

// Exportar el flujo principal
module.exports = flujoPrincipal;