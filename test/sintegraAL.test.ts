import { acessarSintegra } from "../src";

describe("test sintegra al", () => {
	test("valid al cnpj", async () => {
		const result = await acessarSintegra("12294708000181", "AL");
		expect(result).toStrictEqual({
			numeroPessoa: 2835,
			cnpj: "12294708000181",
			caceal: 24008146,
			digitoCaceal: 3,
			descricaoSituacaoCadastral: "BAIXA",
			descricaoMotivoSituacaoCadastral: "BAIXA DE OFICIO",
			indicadorOpcaoSimples: "N",
			razaoSocial: "COMPANHIA DE SANEAMENTO DE ALAGOAS - CASAL",
			nomeFantasia: "CASAL",
			tipoLogradouro: "R  ",
			logradouro: "BARAO DE ATALAIA",
			numeroImovel: "200",
			bairro: "POCO",
			municipio: "MACEIO",
			uf: "AL",
			cep: "57020510",
			dataInicioAtividade: "1963-07-11T03:00:00.000+0000",
			complemento: null,
			indicadorSituacao: "N",
			enderecoEletronico: null,
			atividadesContribuinte: [
				{
					atividadeContribuinteId: {
						caceal: 24008146,
						numeroPessoa: "2835",
						sequencial: 18587,
					},
					cnpj: "12294708000181",
					codigoCnae: "3600601",
					descricao: "Captação, tratamento e distribuição de água",
					indicadorPrincipal: "S",
				},
			],
			telefone: null,
			contribuinteObrigado: {
				numeroCaceal: 240081463,
				dataInicioObrigatoriedade: 20140101,
				dataFinalObrigatoriedade: null,
				cnpj: "12294708000181",
				observacao: "SINCRONIZADO COM RFB EM 24/08/2014 (QUALITOR N. 37474)",
			},
			dataObrigatoriedade: "2014-01-01T03:00:00.000+0000",
			contribuinteRestricao: true,
			indicadorMei: null,
			regimesContribuinte: [],
		});
	});

	test("inexistent registry in al", async () => {
		try {
			await acessarSintegra("12200275000158", "AL");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "Registro não existe");
		}
	});
});
