import { fetchSintegra } from "../src";

describe("test sintegra ms", () => {
	test("valid ms cnpj", async () => {
		const result = await fetchSintegra("00025306000283", "MS");
		expect(result).toStrictEqual({
			ie: "283490888",
			dataDeInicioDeAtividade: "10/22/2008 12:00:00 AM",
			cnpj: "00025306000283",
			razaoSocial: "FERRAZ EQUIPAMENTOS CONTRA INCENDIO LTDA",
			descricaoDaAtividade: "EQUIPAMENTOS E MATERIAIS DE COMBATE A INCENDIO",
			logradouro: "AV PRESIDENTE VARGAS",
			numero: "3382",
			complemento: "",
			cep: "79570000",
			bairro: "VIL BARBOSA",
			municipio: "APARECIDA DO TABOADO",
			uf: "MS",
			situacaoCadastral: "NÃO HABILITADO",
			dataDaUltimaAtualizacao: "5/3/2013 12:00:00 AM",
			motivoDaSituacao: "BAIXADO",
		});
	});
	test("inexistent registry in ms", async () => {
		try {
			await fetchSintegra("15412257000128", "MS");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "Registro não existe");
		}
	});
	test("cnpj missing registry in ms", async () => {
		try {
			await fetchSintegra("02935843000105", "MS");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "Registro não existe");
		}
	});
});
