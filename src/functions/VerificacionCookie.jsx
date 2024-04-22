export const VerificacionCookie = (nombreCookie) => {
	const cookies = document.cookie.split(';');

	for (let cookie of cookies) {
		cookie = cookie.trim();
		const [nombre, valor] = cookie.split('=');

		if (nombre === nombreCookie) {
			return valor === 'error';
		}
	}
	return false;
};
