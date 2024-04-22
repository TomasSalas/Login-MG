export const ActualizarDatosEmpresa = async (data, id) => {
	const url = `https://app-prod-eastus-login-api.azurewebsites.net/api/SuperUsuario/actualizarEmpresa?id=${id}`;
	const token = localStorage.getItem('token');
	const auth = `Bearer ${token}`;
	const { nombre, rut, telefono, email, direccion } = data;

	const item = {
		rut: rut.replace('-', '').replace(/\./g, ''),
		nombre,
		telefono,
		email,
		direccion,
	};

	try {
		const response = await fetch(url, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: auth,
			},
			body: JSON.stringify(item),
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
