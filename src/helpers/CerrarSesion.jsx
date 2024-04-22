export const CerrarSesion = (navigate, setIsOpen) => {
	localStorage.removeItem('token');
	localStorage.removeItem('idEmpresa');
	localStorage.removeItem('rol');
	localStorage.removeItem('usuario');
	localStorage.removeItem('nombreEmpresa');
	setIsOpen(true);
	navigate('/');
};
