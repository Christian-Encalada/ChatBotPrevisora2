### CHATBOT Whatsapp (Baileys Provider)

<p align="center">
  <img width="250" src="https://i.imgur.com/Oauef6t.png">
</p>


**Con esta librería, puedes construir flujos automatizados de conversación de manera agnóstica al proveedor de WhatsApp,** configurar respuestas automatizadas para preguntas frecuentes, recibir y responder mensajes de manera automatizada, y hacer un seguimiento de las interacciones con los clientes.  Además, puedes configurar fácilmente disparadores que te ayudaran a expandir las funcionalidades sin límites. **[Ver más informacion](https://bot-whatsapp.netlify.app/)**

```js
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal])

    const adapterProvider = createProvider(BaileysProvider, {
        accountSid: process.env.ACC_SID,
        authToken: process.env.ACC_TOKEN,
        vendorNumber: process.env.ACC_VENDOR,
    })

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })
}

Requisitos previos:
Tener instalado: 
Nodejs
git


```
Para empezar usar este codigo sigue los siguientes pasos:

clona el repositorio en tu maquina utilizando un IDE como Visual Studio.
<img width="651" alt="image" src="https://github.com/Christian-Encalada/ChatBotPrevisora2/assets/115563495/31825213-8440-4901-a595-8d91e803767b">

Instala las dependecias necesarias con el siguiente comando en la terminal:

npm install

![image](https://github.com/Christian-Encalada/ChatBotPrevisora2/assets/115563495/84738a00-eacc-41b8-965c-2e6d3ae40cd7)}

Inicia el bot con el siguiente comando:
npm start

![image](https://github.com/Christian-Encalada/ChatBotPrevisora2/assets/115563495/3f5ccd88-1e15-48cd-8169-45a82463c74b)

```

---
## Recursos
- [📄 Documentación](https://bot-whatsapp.netlify.app/)
