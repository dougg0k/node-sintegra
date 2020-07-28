import { fetchSintegra } from "../src";

describe("test sintegra go", () => {
	test("valid go cnpj", async () => {
		const result = await fetchSintegra("01829371000143", "GO");
		expect(result).toStrictEqual({
			identificacaoContribuinte: {
				cnpj: "01.829.371/0001-43",
				ie: "10.494.204-5",
				nomeEmpresarial: "PLANET HOUSE INFOMÁTICA LTDA",
				contribuinte: "Sim",
				nomeFantasia: "PLANET HOUSE INFORMÁTICA",
			},
			enderecoEstabelecimento: {
				logradouro: "AVENIDA IDELFONSO CARNEIRO",
				numero: "780",
				quadra: undefined,
				lote: null,
				complemento: null,
				bairro: "SETOR CENTRAL",
				municipio: "CACU",
				uf: "GO",
				cep: "75813000",
			},
			informacoesComplementares: {
				atividadeEconomica: {
					atividadePrincipal: "8599603 - Treinamento em informática",
					atividadeSecundaria:
						"4753900 - Comércio varejista especializado de eletrodomésticos e equipamentos de áudio e vídeo",
				},
				unidadeAuxiliar: "---",
				condicaoDeUso: "---",
				dataFinalDeContrato: "---",
				regimeDeApuracao: "Micro EPP/Simples Nacional",
				situacaoCadastralVigente: "Ativo - HABILITADO",
				dataDestaSituacaoCadastral: "24/02/2011",
				dataDeCadastramento: "24/02/2011",
				operacoesComNfe: "Habilitado",
			},
		});
	});
	test("inexistent registry in go", async () => {
		try {
			await fetchSintegra("01409580000138", "GO");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "Registro não existe");
		}
	});
});
