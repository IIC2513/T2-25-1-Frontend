import axios from 'axios';

/**
 * Obtiene el nombre del usuario a partir de su ID.
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<string>} - Una promesa que resuelve con el nombre del usuario.
 */
export async function getUserName(userId) {
    try {
        const response = await axios.get(`http://localhost:3000/users/${userId}`);
        return response.data.username; // Asegúrate de que el backend retorne el nombre del usuario en la propiedad "name".
    } catch (error) {
        console.error('Error fetching user name:', error);
        throw error;
    }
}