export const FormatRut = (rut) => {
	if (typeof rut !== 'string') {
		console.error('FormatRut: rut debe ser una cadena');
		return rut;
	}

	const runAux = rut.replace(/\./g, '').replace(/-/g, '');
	if (runAux.length <= 2) {
		return rut;
	}

	let cuerpo = runAux.slice(0, -1);
	const dv = runAux.slice(-1).toUpperCase();

	if (isNaN(cuerpo)) {
		console.error('FormatRut: cuerpo no es un número');
		return rut;
	}

	cuerpo = new Intl.NumberFormat('es-CL').format(cuerpo);
	return cuerpo + '-' + dv;
};
