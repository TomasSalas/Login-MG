export const GetEmpresas = async () => {
	const url = 'https://app-prod-eastus-login-api.azurewebsites.net/api/SuperUsuario/ListarEmpresas';
	const token = localStorage.getItem('token');
	const auth = `Bearer ${token}`;

	try {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: auth,
			},
		});
		const resul = await response.json();
		if (!resul.isExitoso) {
			return {
				error: false,
				data: resul.resultado,
			};
		} else {
			return {
				error: true,
				data: resul.errorMessages,
			};
		}
	} catch (e) {
		return {
			error: true,
			data: 'Error fetching',
		};
	}
};
