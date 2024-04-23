export const EnviarToken = async (token, id) => {
	try {
		const url = 'https://app-prod-eastus-portalevaluador-api.azurewebsites.net/api/Candidato/RegistrarVerifToken';

		const parametros = {
			randomid: id,
			accessToken: token,
		};

		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(parametros),
		});

		const { isExitoso, resultado, errorMessages } = await res.json();

		if (isExitoso) {
			return {
				error: false,
				data: resultado,
			};
		} else {
			return {
				error: true,
				data: errorMessages,
			};
		}
	} catch (e) {
		console.error(e);
	}
};
