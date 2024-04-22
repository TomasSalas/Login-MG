export const AgregarUsuarioF = async (data) => {
	const url = `https://app-prod-eastus-login-api.azurewebsites.net/api/superusuario/registrarusuario`;
	const token = localStorage.getItem('token');
	const auth = `Bearer ${token}`;
	const { nombre, apellido, run, email, contrasena, rol, idEmpresa } = data;
	const today = new Date();
	const fechaRegistro = today.toISOString().split('T')[0];

	const item = {
		run: run.replace('-', '').replace(/\./g, ''),
		nombre,
		apellido,
		email,
		contrasena,
		rol: parseInt(rol),
		fechaRegistro,
		idEmpresa: parseInt(idEmpresa),
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
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
