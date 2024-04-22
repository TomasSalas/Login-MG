export const EnviarCorreo = async (data) => {
	const { correo, codigoGenerate } = data;

	const params = {
		emailDestino: correo,
		codigo: codigoGenerate,
	};

	try {
		const response = await fetch('https://app-prod-eastus-login-api.azurewebsites.net/api/Login/verificarCorreoElectronico', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(params),
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
