import { formatCnpj } from "./helpers/cnpj";
import { Sintegra } from "./sintegra/Sintegra";
import estados from "./utils/estados";
import { validateCnpj, validateEstado } from "./utils/requestValidation";

export async function acessarSintegra(
	cnpj: string,
	estadoSigla: string,
): Promise<Sintegra | null> {
	validateEstado(estadoSigla);
	validateCnpj(cnpj);
	try {
		cnpj = formatCnpj(cnpj);
		estadoSigla = estadoSigla.toUpperCase();
		switch (estadoSigla) {
			case estados.ACRE.sigla:
				throw new Error("Não há suporte ao Acre");
			case estados.ALAGOAS.sigla:
				const sintegraAL = await import("./sintegra/sintegraAL");
				return sintegraAL.fetchSintegra(cnpj);
			case estados.AMAPA.sigla:
				throw new Error("Não há suporte ao Amapa");
			case estados.AMAZONAS.sigla:
				throw new Error("Não há suporte ao Amazonas");
			case estados.BAHIA.sigla:
				const sintegraBA = await import("./sintegra/sintegraBA");
				return sintegraBA.fetchSintegra(cnpj);
			case estados.CEARA.sigla:
				throw new Error("Não há suporte ao Ceara");
			case estados.DISTRITO_FEDERAL.sigla:
				const sintegraDF = await import("./sintegra/sintegraDF");
				return sintegraDF.fetchSintegra(cnpj);
			case estados.ESPIRITO_SANTO.sigla:
				throw new Error("Não há suporte ao Espirito Santo");
			case estados.GOIAS.sigla:
				throw new Error("Não há suporte a Goias");
			case estados.MARANHAO.sigla:
				throw new Error("Não há suporte ao Maranhao");
			case estados.MATO_GROSSO.sigla:
				throw new Error("Não há suporte ao Mato Grosso");
			case estados.MATO_GROSSO_DO_SUL.sigla:
				throw new Error("Não há suporte ao Mato Grosso do Sul");
			case estados.MINAS_GERAIS.sigla:
				throw new Error("Não há suporte a Minas Gerais");
			case estados.PARA.sigla:
				throw new Error("Não há suporte ao Para");
			case estados.PARAIBA.sigla:
				throw new Error("Não há suporte a Paraiba");
			case estados.PARANA.sigla:
				throw new Error("Não há suporte ao Parana");
			case estados.PERNAMBUCO.sigla:
				throw new Error("Não há suporte a Pernambuco");
			case estados.PIAUI.sigla:
				throw new Error("Não há suporte ao Piaui");
			case estados.RIO_DE_JANEIRO.sigla:
				throw new Error("Não há suporte ao Rio de Janeiro");
			case estados.RIO_GRANDE_DO_NORTE.sigla:
				throw new Error("Não há suporte ao Rio Grande do Norte");
			case estados.RIO_GRANDE_DO_SUL.sigla:
				throw new Error("Não há suporte ao Rio Grande do Sul");
			case estados.RONDONIA.sigla:
				throw new Error("Não há suporte a Rondonia");
			case estados.RORAIMA.sigla:
				throw new Error("Não há suporte a Roraima");
			case estados.SANTA_CATARINA.sigla:
				throw new Error("Não há suporte a Santa Catarina");
			case estados.SAO_PAULO.sigla:
				const sintegraSP = await import("./sintegra/sintegraSP");
				return sintegraSP.fetchSintegra(cnpj);
			case estados.SERGIPE.sigla:
				throw new Error("Não há suporte a Sergipe");
			case estados.TOCANTINS.sigla:
				throw new Error("Não há suporte a Tocantins");
			default:
				return null;
		}
	} catch (err) {
		throw err;
	}
}
