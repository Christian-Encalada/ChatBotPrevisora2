require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env
const { POSTGRES_DB_HOST, POSTGRES_DB_USER, POSTGRES_DB_PASSWORD, POSTGRES_DB_NAME, POSTGRES_DB_PORT } = process.env;
const { createBot, createProvider, createFlow, addKeyword, addAnswer } = require('@bot-whatsapp/bot')
const validarCedula = require('./start_bot/validacion/validarCedula')
const flujoPrincipal = require('./start_bot/flujos/flujoPrincipal')
const flujoSecundario = require('./start_bot/flujos/flujoSecundario')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const PostgreSQLAdapter  = require('@bot-whatsapp/database/postgres')



const main = async () => {
    console.log("antes de crear la conexion");
    const adapterDB = new PostgreSQLAdapter({
        host: POSTGRES_DB_HOST,
        user: POSTGRES_DB_USER,
        database: POSTGRES_DB_NAME,
        password: POSTGRES_DB_PASSWORD,
        port: POSTGRES_DB_PORT,
    })

console.log("despues de crear la conexion");
    const adapterFlow = createFlow([flujoPrincipal])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()