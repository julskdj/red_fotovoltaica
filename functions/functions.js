

module.exports = function cadenaAleatoria() {
	let longitud = 16;
	let caracteres = "0123456789abcdefghijklmnopqrstuvwxyz";

	let cadena = "";
	let max = caracteres.length - 1;
	for (let i = 0; i < longitud; i++) {
		cadena += caracteres[Math.floor(Math.random() * (max + 1))];
	}
	return cadena;
}
