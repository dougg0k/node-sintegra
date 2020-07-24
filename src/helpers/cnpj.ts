import { cnpj } from "cpf-cnpj-validator";

export function isCnpjValid(cnpjNumber: string): boolean {
	if (!cnpjNumber) {
		return false;
	}
	return cnpj.isValid(cnpjNumber);
}

export function formatCnpj(cnpjNumber: string): string {
	return cnpjNumber.replace(/\D+/g, "");
}
