import { acessarSintegra } from "../src";

describe("test sintegra", () => {
	test("valid sp cnpj", async () => {
		const result = await acessarSintegra("26156450000161", "SP");
		expect(result).toStrictEqual({
			ie: "795.757.616.113",
			cnpj: "26.156.450/0001-61",
			nomeEmpresarial: "VISON PORTARIA ON-LINE CAMPINAS LTDA",
			nomeFantasia: "VISION CAMPINAS PORTARIA MONITORADA",
			naturezaJurdica: "Sociedade Empresária Limitada",
			dataDeCredenciamentoComoEmissorDeNFe: "14/09/2016",
			indicadorDeObrigatoriedadeDeNFe: "Obrigatoriedade Total",
			dataDeIncioDaObrigatoriedadeDeNFe: "01/10/2018",
			logradouro: "RUA CAMARGO PIMENTEL",
			complemento: "FUNDOS",
			cep: "13.073-340",
			bairro: "JARDIM GUANABARA",
			uf: "SP",
			postoFiscal: "PF-10 - CAMPINAS",
			numero: "180",
			municipio: "CAMPINAS",
			situacaoCadastral: "Ativo",
			ocorrenciaFiscal: "Ativa",
			regimeDeApuracao: "SIMPLES NACIONAL",
			atividadeEconomica:
				"Atividades de monitoramento de sistemas de segurança eletrônico",
			dataDaSituacaoCadastral: "13/09/2016",
		});
	});

	test("invalid estado sigla", async () => {
		try {
			await acessarSintegra("26156450005161", "P");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "Utilize a sigla do estado");
		}
	});

	test("invalid estado sigla type", async () => {
		try {
			await acessarSintegra("26156450005161", "12");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "A sigla deve ser letras");
		}
	});

	test("invalid unknown estado sigla", async () => {
		const result = await acessarSintegra("26156450000161", "SQ");
		expect(result).toBeNull();
	});

	test("inexistent registry", async () => {
		try {
			await acessarSintegra("02626855000158", "SP");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "Registro não existe");
		}
	});

	test("invalid registry", async () => {
		try {
			await acessarSintegra("1234", "SP");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "CNPJ Inválido");
		}
	});
	test("not supported", async () => {
		try {
			await acessarSintegra("26156450000161", "AM");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "Não há suporte ao Amazonas");
		}
	});
});
