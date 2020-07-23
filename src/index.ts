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
			case estados.ACRE.sigla:
				throw new Error("Não há suporte ao Acre");
			case estados.ALAGOAS.sigla:
				throw new Error("Não há suporte ao Alagoas");
			case estados.AMAPA.sigla:
				throw new Error("Não há suporte ao Amapa");
			case estados.AMAZONAS.sigla:
				throw new Error("Não há suporte ao Amazonas");
			case estados.BAHIA.sigla:
				throw new Error("Não há suporte ao Bahia");
			case estados.CEARA.sigla:
				throw new Error("Não há suporte ao Ceara");
			case estados.DISTRITO_FEDERAL.sigla:
				throw new Error("Não há suporte ao Distrito Federal");
			case estados.ESPIRITO_SANTO.sigla:
				throw new Error("Não há suporte ao Espirito Santo");
			case estados.GOIAS.sigla:
				throw new Error("Não há suporte ao Goias");
			case estados.MARANHAO.sigla:
				throw new Error("Não há suporte ao Maranhao");
			case estados.MATO_GROSSO.sigla:
				throw new Error("Não há suporte ao Mato Grosso");
			case estados.MATO_GROSSO_DO_SUL.sigla:
				throw new Error("Não há suporte ao Mato Grosso do Sul");
			case estados.MINAS_GERAIS.sigla:
				throw new Error("Não há suporte ao Minas Gerais");
			case estados.PARA.sigla:
				throw new Error("Não há suporte ao Para");
			case estados.PARAIBA.sigla:
				throw new Error("Não há suporte ao Paraiba");
			case estados.PARANA.sigla:
				throw new Error("Não há suporte ao Parana");
			case estados.PERNAMBUCO.sigla:
				throw new Error("Não há suporte ao Pernambuco");
			case estados.PIAUI.sigla:
				throw new Error("Não há suporte ao Piaui");
			case estados.RIO_DE_JANEIRO.sigla:
				throw new Error("Não há suporte ao Rio de Janeiro");
			case estados.RIO_GRANDE_DO_NORTE.sigla:
				throw new Error("Não há suporte ao Rio Grande do Norte");
			case estados.RIO_GRANDE_DO_SUL.sigla:
				throw new Error("Não há suporte ao Rio Grande do Sul");
			case estados.RONDONIA.sigla:
				throw new Error("Não há suporte ao Rondonia");
			case estados.RORAIMA.sigla:
				throw new Error("Não há suporte ao Roraima");
			case estados.SANTA_CATARINA.sigla:
				throw new Error("Não há suporte ao Santa Catarina");
			case estados.SERGIPE.sigla:
				throw new Error("Não há suporte ao Sergipe");
			case estados.TOCANTINS.sigla:
				throw new Error("Não há suporte ao Tocantins");
			default:
				return null;
		}
	} catch (err) {
		throw err;
	}
}
