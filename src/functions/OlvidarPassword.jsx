export const OlvidarPassword = async (data) => {
	const { contrasena, correo } = data;

	const param = {
		nuevaContrasena: contrasena,
		email: correo,
	};

	try {
		const response = await fetch('https://app-prod-eastus-login-api.azurewebsites.net/api/Login/recuperarContrasena', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(param),
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
