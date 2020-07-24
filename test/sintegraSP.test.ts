import { acessarSintegra } from "../src";

describe("test sintegra sp", () => {
	test("valid sp cnpj", async () => {
		const result = await acessarSintegra("26156450000161", "SP");
		expect(result).toStrictEqual({
			estabelecimento: {
				ie: "795.757.616.113",
				cnpj: "26.156.450/0001-61",
				nomeEmpresarial: "VISON PORTARIA ON-LINE CAMPINAS LTDA",
				nomeFantasia: "VISION CAMPINAS PORTARIA MONITORADA",
				naturezaJurdica: "Sociedade Empresária Limitada",
			},
			endereco: {
				logradouro: "RUA CAMARGO PIMENTEL",
				complemento: "FUNDOS",
				cep: "13.073-340",
				bairro: "JARDIM GUANABARA",
				numero: "180",
				municipio: "CAMPINAS",
				uf: "SP",
			},
			informacoesComplementares: {
				situacaoCadastral: "Ativo",
				dataDaSituacaoCadastral: "13/09/2016",
				ocorrenciaFiscal: "Ativa",
				regimeDeApuracao: "SIMPLES NACIONAL",
				atividadeEconomica:
					"Atividades de monitoramento de sistemas de segurança eletrônico",
				postoFiscal: "PF-10 - CAMPINAS",
			},
			informacoesNfe: {
				dataDeCredenciamentoComoEmissorDeNFe: undefined,
				indicadorDeObrigatoriedadeDeNFe: undefined,
				dataDeIncioDaObrigatoriedadeDeNFe: undefined,
			},
		});
	});
	test("inexistent registry in sp", async () => {
		try {
			await acessarSintegra("02626855000158", "SP");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "Registro não existe");
		}
	});
});
