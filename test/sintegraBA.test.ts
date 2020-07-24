import { acessarSintegra } from "../src";

describe("test sintegra ba", () => {
	test("valid ba cnpj", async () => {
		const result = await acessarSintegra("96835632000306", "BA");
		expect(result).toStrictEqual({
			identificacao: {
				cnpj: "96.835.632/0003-06",
				ie: "051.232.395",
				razaoSocial: "A FELIZ COMERCIO DE MEDICAMENTOS LTDA",
			},
			endereco: {
				logradouro: "AVENIDASANTOS DUMONT",
				numero: "793-A",
				complemento: "TERREO",
				bairro: "CENTRO",
				uf: "BA",
				municipio: "EUNAPOLIS",
				cep: "45820081",
				enderecoEletronico: "FINANCEIROGH@HOTMAIL.COM",
				telefone: "(73) 32815347",
			},
			informacoesComplementares: {
				atividadeEconomica: "Comrcio varejista de produtos farmacuticos, sem",
				dataDaInscricaoEstadual: "03/08/1999",
				usuarioSEPD: "------",
				situacaoCadastralAtual: "N~ao Habilitado",
				dataDestaSituacaoCadastral: "20/02/2013",
				condicao: "NORMAL",
				observacoes: "",
				regimeDeApuracaoDeICMS: "C/CORRENTE FISCAL",
			},
		});
	});
	test("inexistent registry in ba", async () => {
		try {
			await acessarSintegra("63186456000108", "BA");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "Registro não existe");
		}
	});
	test("not registered in ba", async () => {
		try {
			await acessarSintegra("13937032000160", "BA");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty(
				"message",
				"Não foi cadastrado como contribuinte de ICMS",
			);
		}
	});
});
