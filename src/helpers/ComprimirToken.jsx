import pako from 'pako';

export const ComprimirToken = (tokenID) => {
	const tokenBuffer = new TextEncoder().encode(tokenID);
	const tokenComprimido = pako.deflate(tokenBuffer, { to: 'string' });
	return tokenComprimido;
};
