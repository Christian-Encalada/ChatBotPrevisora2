const { POSTGRES_DB_HOST2, POSTGRES_DB_USER2, POSTGRES_DB_PASSWORD2, POSTGRES_DB_NAME2, POSTGRES_DB_PORT2 } = process.env;
const { Client } = require('pg')

async function enviar_calificacion(ctx, calificacion, cedulasPorTelefono) {
    const cedulaUsuario = cedulasPorTelefono[ctx.sender];
    
    if (cedulaUsuario) {
        const nombreUsuario = cedulaUsuario;
        const client = new Client({ user: POSTGRES_DB_USER2, password: POSTGRES_DB_PASSWORD2, database: POSTGRES_DB_NAME2 });
        await client.connect();
        try {
            await client.query('INSERT INTO calificacion (nombre_usuario, puntaje) VALUES ($1, $2)', [nombreUsuario, calificacion]);
            console.log('Calificación registrada en la base de datos');
            return true; // Indicar que la inserción fue exitosa
        } catch (error) {
            console.error('Error al insertar la calificación en la base de datos:', error);
            return false; // Indicar que ocurrió un error en la inserción
        } finally {
            await client.end();
        }
    } else {
        console.error('No se encontró la cédula del usuario.');
        return false; // Indicar que no se encontró la cédula del usuario
    }
}

module.exports = enviar_calificacion;
