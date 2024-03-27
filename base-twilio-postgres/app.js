require('dotenv').config(); // Cargar las variables de entorno desde el archivo .env
const { createBot, createProvider, createFlow, addKeyword } = require('@bot-whatsapp/bot')
const { POSTGRES_DB_HOST, POSTGRES_DB_USER, POSTGRES_DB_PASSWORD, POSTGRES_DB_NAME, POSTGRES_DB_PORT } = process.env;

const TwilioProvider = require('@bot-whatsapp/provider/twilio')
const MockAdapter = require('@bot-whatsapp/database/mock')

const validarCedula = require('./config_bot/funciones/validarCedula')
const flujoPrincipal = require('./config_bot/flujos/flujoPrincipal')
const flujoSecundario = require('./config_bot/flujos/flujoSecundario')

const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flujoPrincipal, flujoSecundario])

    const adapterProvider = createProvider(TwilioProvider, {
        accountSid: 'YOUR_ACCOUNT_SID',
        authToken: 'YOUR_ACCOUNT_TOKEN',
        vendorNumber: '+14155238886',
    })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
}

main()
