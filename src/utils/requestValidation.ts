import { isCnpjValid } from "../helpers/cnpj";

export function validateEstado(estado: string): void {
	if (!estado) {
		throw new Error("Sigla estado não pode ser null ou undefined");
	}
	if (typeof estado !== "string") {
		throw new Error("Utilize o tipo string em estado");
	}
	if (estado.length !== 2) {
		throw new Error("Utilize a sigla do estado");
	}
	if (!/^[a-zA-Z]+$/.test(estado)) {
		throw new Error("A sigla deve ser letras");
	}
}

export function validateCnpj(cnpj: string): void {
	if (!cnpj) {
		throw new Error("CNPJ não pode ser null ou undefined");
	}
	if (!isCnpjValid(cnpj)) {
		throw new Error("CNPJ Inválido");
	}
}
