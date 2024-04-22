export const ActualizarUsuario = async (data) => {
	const url = `https://app-prod-eastus-login-api.azurewebsites.net/api/superusuario/actualizarusuario`;

	const token = localStorage.getItem('token');
	const auth = `Bearer ${token}`;
	const { nombre, apellido, run, email, rol, idEmpresa, contrasena } = data;

	const item = {
		run: run.replace('-', '').replace(/\./g, ''),
		nombre,
		apellido,
		email,
		rol,
		idEmpresa,
		contrasena,
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
