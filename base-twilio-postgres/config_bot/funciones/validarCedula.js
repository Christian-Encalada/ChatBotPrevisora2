const { POSTGRES_DB_HOST2, POSTGRES_DB_USER2, POSTGRES_DB_PASSWORD2, POSTGRES_DB_NAME2, POSTGRES_DB_PORT2 } = process.env;
const { Client } = require('pg')

// Función para validar la cédula en la base de datos
async function validarCedula(cedula) {
    console.log("🆗 Conexion a BD Usuarios ");
    const client = new Client({ user: POSTGRES_DB_USER2, password:POSTGRES_DB_PASSWORD2, database: POSTGRES_DB_NAME2 }) 
    await client.connect()
    
    try {
        // Ejecutar la consulta para verificar si la cédula existe en la base de datos
        console.log("🆗 Usuario Valido ");
        const resultado = await client.query('SELECT * FROM usuarios WHERE cedula = $1', [cedula]);
        
        // Si la consulta devuelve algún resultado, la cédula es válida
        if (resultado && resultado.rows.length > 0) {
            nombreUsuario = resultado.rows[0].nombre; // Almacenar el nombre en la variable global
            return { valid: true, nombre: nombreUsuario };
        } else {
            return { valid: false };
        }
    } catch (error) {
        console.error('Error al validar la cédula en la base de datos:', error);
        return { valid: false };
    }
}

module.exports = validarCedula;