import pako from 'pako';

export const ComprimirToken = (tokenID) => {
	const tokenBuffer = new TextEncoder().encode(tokenID);

	const tokenComprimido = pako.deflate(tokenBuffer);

	const tokenComprimidoBase64 = btoa(String.fromCharCode.apply(null, tokenComprimido));
	return tokenComprimidoBase64;
};
