import { fetchSintegra } from "../src";

describe("test sintegra", () => {
	test("invalid estado sigla", async () => {
		try {
			await fetchSintegra("26156450005161", "P");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "Utilize a sigla do estado");
		}
	});

	test("invalid estado sigla type", async () => {
		try {
			await fetchSintegra("26156450005161", "12");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "A sigla deve ser letras");
		}
	});

	test("unknown estado sigla", async () => {
		try {
			await fetchSintegra("26156450000161", "SQ");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "Essa sigla não existe");
		}
	});

	test("invalid registry", async () => {
		try {
			await fetchSintegra("1234", "SP");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "CNPJ Inválido");
		}
	});

	test("not supported", async () => {
		try {
			await fetchSintegra("26156450000161", "AM");
		} catch (err) {
			expect(err).toBeInstanceOf(Error);
			expect(err).toHaveProperty("message", "Não há suporte ao Amazonas");
		}
	});
});
