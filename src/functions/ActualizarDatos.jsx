export const ActualizarDatos = async (data) => {
	const url = 'https://app-prod-eastus-login-api.azurewebsites.net/api/Administrador/ActualizarInfo';
	const token = localStorage.getItem('token');
	const auth = `Bearer ${token}`;

	try {
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: auth,
			},
			body: JSON.stringify(data),
		});

		const resultado = await response.json();

		if (resultado.isExitoso) {
			return {
				error: false,
				data: resultado,
			};
		} else {
			return {
				error: true,
				data: resultado.errorMessages,
			};
		}
	} catch (err) {
		return {
			error: true,
			data: 'Error fetching',
		};
	}
};
