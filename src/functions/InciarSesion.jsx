import { decodeToken } from 'react-jwt';
import { ComprimirToken } from '../helpers/ComprimirToken';
export const IniciarSesion = async (data, navigate) => {
	const { rut, contrasena } = data;

	const params = {
		run: rut.replace('-', '').replace(/\./g, ''),
		contrasena,
	};

	try {
		const response = await fetch('https://app-prod-eastus-login-api.azurewebsites.net/api/Login/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(params),
		});

		const resultado = await response.json();

		if (resultado.isExitoso) {
			const { token } = resultado.resultado;
			const tokenDecode = decodeToken(token);
			localStorage.setItem('token', token);
			localStorage.setItem('rol', tokenDecode.role);
			localStorage.setItem('idEmpresa', tokenDecode.IdEmpresa);
			localStorage.setItem('nombreEmpresa', tokenDecode.NombreEmpresa);
			localStorage.setItem('usuario', tokenDecode.Nombre + ' ' + tokenDecode.Apellido + ' ' + tokenDecode.Email + ' ' + tokenDecode.IdUsuario);

			if (tokenDecode.role == '1') {
				return navigate('/dashboard');
			} else if (tokenDecode.role == '2') {
				return navigate('/gestion-usuario');
			} else if (tokenDecode.role == '6' || tokenDecode.role == '8' || tokenDecode.role == '9') {
				const token = localStorage.getItem('token');
				// document.cookie = `token=${token}; path=/; SameSite=None; Secure`;
				document.cookie = `token=${token};`;
				const tokenComprimido = ComprimirToken(token);
				console.log(tokenComprimido);
				return (window.location.href = `https://portal-evaluador.vercel.app/`);
				// return (window.location.href = 'http://localhost:5174/');
			}

			return {
				error: false,
				result: resultado,
			};
		} else {
			return {
				error: true,
				result: resultado.errorMessages,
			};
		}
	} catch (err) {
		return {
			error: true,
			data: 'Error fetching',
		};
	}
};
