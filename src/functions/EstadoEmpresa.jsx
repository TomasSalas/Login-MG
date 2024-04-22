export const EstadoEmpresa = async (id) => {
	const { idEmpresa, estado } = id;
	let url;

	if (estado === 1) {
		url = `https://app-prod-eastus-login-api.azurewebsites.net/api/SuperUsuario/DesactivarEmpresa?id=${idEmpresa}`;
	} else {
		url = `https://app-prod-eastus-login-api.azurewebsites.net/api/SuperUsuario/ActivarEmpresa?id=${idEmpresa}`;
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
