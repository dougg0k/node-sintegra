import { acessarSintegra } from "../src";

describe("test sintegra", () => {
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
