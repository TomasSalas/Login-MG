export const EstadoUsuario = async (id) => {
	const { run, estado } = id;
	let url;

	if (estado == 1) {
		url = `https://app-prod-eastus-login-api.azurewebsites.net/api/SuperUsuario/desactivarusuario?run=${run}`;
	} else {
		url = `https://app-prod-eastus-login-api.azurewebsites.net/api/SuperUsuario/ActivarUsuario?run=${run}`;
	}

	const token = localStorage.getItem('token');
	const auth = `Bearer ${token}`;

	try {
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: auth,
			},
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
