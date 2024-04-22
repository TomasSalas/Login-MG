import { decodeToken, isExpired } from 'react-jwt';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { CerrarSesion } from '../helpers/CerrarSesion';

export const VerificarToken = (setIsOpen) => {
	const navigate = useNavigate();
	return useCallback(() => {
		const token = localStorage.getItem('token');
		if (token == null) {
			CerrarSesion(navigate, setIsOpen);
			return;
		}
		const expired = isExpired(token);
		if (expired) {
			CerrarSesion(navigate, setIsOpen);
		} else {
			const decode = decodeToken(token);
			localStorage.setItem('rol', decode.role);
			localStorage.setItem('idEmpresa', decode.IdEmpresa);
			localStorage.setItem('idEmpresa', decode.IdEmpresa);
			localStorage.setItem('nombreEmpresa', decode.NombreEmpresa);
			localStorage.setItem('usuario', decode.Nombre + ' ' + decode.Apellido + ' ' + decode.Email + ' ' + decode.IdUsuario);
		}
	}, [navigate]);
};
