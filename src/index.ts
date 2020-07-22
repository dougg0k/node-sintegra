import { Sintegra } from "./sintegra/Sintegra";
import estados from "./utils/estados";
import { validateCnpj, validateEstado } from "./utils/requestValidation";

export async function acessarSintegra(
	cnpj: string,
	estado: string,
): Promise<Sintegra | null> {
	validateEstado(estado);
	validateCnpj(cnpj);
	try {
		estado = estado.toUpperCase();
		switch (estado) {
			case estados.SAO_PAULO.sigla:
				const sintegraSP = await import("./sintegra/sintegraSP");
				return sintegraSP.accessSintegra(cnpj);
			default:
				return null;
		}
	} catch (err) {
		throw err;
	}
}
