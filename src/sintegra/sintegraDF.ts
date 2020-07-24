import { Page } from "puppeteer";
import { removeUnwantedCharacterFromText } from "../helpers/formatting";
import { extractText } from "../helpers/puppeteerHelper";
import { setupBrowser, setupPage } from "../helpers/setupPuppeteer";
import estados from "../utils/estados";
import { isObjectEmpty } from "../utils/utils";
import { SintegraDF } from "./Sintegra";

const NEXT_PAGE_CODE_SELECTOR =
	"table.conteudoarea tbody tr:nth-of-type(3) td table tbody tr td b";
const RADIO_SELECTOR = "input[value='2']";
const INPUT_SELECTOR = "input#argumento";
const ERROR_TYPE1_SELECTOR =
	"table.conteudoarea tbody tr:nth-of-type(3) td table tbody tr:nth-of-type(2) td:nth-of-type(2)";
const ERROR_TYPE2_SELECTOR =
	"table.conteudoarea tbody tr:nth-of-type(3) td table tbody tr:nth-of-type(2) td b";
const FETCH_RESULT_BUTTON_SELECTOR = "input#btnConsultar";
const DETAIL_RESULT_BUTTON = "a.btnCFDF";

const getValueSelectorBy = (trNthOfType: number, tdNthOfType: number) =>
	`div.conteudo div.alpha table.conteudoarea tbody tr:nth-of-type(${trNthOfType}) td:nth-of-type(${tdNthOfType})`;

export async function fetchSintegra(cnpj: string): Promise<SintegraDF> {
	const browser = await setupBrowser();
	try {
		const page = await setupPage(estados.DISTRITO_FEDERAL.url, browser);
		await setupInitialPart(page, cnpj);

		await page.waitFor(NEXT_PAGE_CODE_SELECTOR);

		const firstErr = await extractText(page, ERROR_TYPE1_SELECTOR);
		if (
			firstErr?.split(".")[0].trim() === "NÃO CADASTRADO COMO CONTRIBUINTE ICMS"
		) {
			throw new Error("Não foi cadastrado como contribuinte de ICMS");
		}
		const secondErr = await extractText(page, ERROR_TYPE2_SELECTOR);
		if (
			secondErr === "CONTRIBUINTE NÃO CADASTRADO COMO CONTRIBUINTE DE ICMS."
		) {
			throw new Error("Não foi cadastrado como contribuinte de ICMS");
		}

		const situation = await extractText(page, DETAIL_RESULT_BUTTON);
		if (situation === "ATIVO") {
			const detailButton = await page.waitFor(DETAIL_RESULT_BUTTON);
			await detailButton.click();
		} else {
			throw new Error("Cadastro desativado");
		}

		await page.waitForNavigation();
		const sintegra = await retrieveAndProcessValues(page);
		return buildData(sintegra);
	} catch (err) {
		throw err;
	} finally {
		await browser.close();
	}
}

async function setupInitialPart(page: Page, cnpj: string) {
	const radioButton = await page.waitFor(RADIO_SELECTOR);
	await radioButton.click();
	const input = await page.waitFor(INPUT_SELECTOR);
	await input.type(cnpj);
	await page.click(FETCH_RESULT_BUTTON_SELECTOR);
}

async function retrieveAndProcessValues(page: Page) {
	const cnpj = await extractText(page, getValueSelectorBy(3, 2));
	const cfDf = await extractText(page, getValueSelectorBy(3, 4));
	const razaoSocial = await extractText(page, getValueSelectorBy(4, 2));
	const nomeFantasia = await extractText(page, getValueSelectorBy(5, 2));
	const logradouro = await extractText(page, getValueSelectorBy(7, 2));
	const numero = await extractText(page, getValueSelectorBy(8, 2));
	const complemento = await extractText(page, getValueSelectorBy(8, 4));
	const bairro = await extractText(page, getValueSelectorBy(9, 2));
	const municipio = await extractText(page, getValueSelectorBy(10, 2));
	const uf = await extractText(page, getValueSelectorBy(10, 4));
	const cep = await extractText(page, getValueSelectorBy(11, 2));
	const telefone = await extractText(page, getValueSelectorBy(11, 4));
	const atividadePrincipal = await extractText(
		page,
		`${getValueSelectorBy(13, 2)} div`,
	);
	const atividadeSecundaria = await extractText(
		page,
		`${getValueSelectorBy(14, 2)} div`,
	);
	const regimeDeApuracao = await extractText(page, getValueSelectorBy(15, 2));
	const situacaoCadastral = await extractText(page, getValueSelectorBy(16, 2));
	const dataDessaSituacaoCadastral = await extractText(
		page,
		getValueSelectorBy(17, 2),
	);
	const situacaoSintegra = await extractText(page, getValueSelectorBy(18, 2));
	const result = {
		cnpj,
		cfDf,
		uf,
		razaoSocial,
		nomeFantasia,
		logradouro,
		numero,
		complemento,
		bairro,
		municipio,
		cep,
		telefone,
		atividadePrincipal: removeUnwantedCharacterFromText(atividadePrincipal),
		atividadeSecundaria: removeUnwantedCharacterFromText(atividadeSecundaria),
		regimeDeApuracao,
		situacaoCadastral,
		dataDessaSituacaoCadastral,
		situacaoSintegra,
	};
	return result;
}

function buildData(data) {
	if (isObjectEmpty(data)) {
		throw new Error("Sem dados");
	}
	return {
		identificacao: {
			cnpj: data.cnpj,
			cfDf: data.cfDf,
			razaoSocial: data.razaoSocial,
			nomeFantasia: data.nomeFantasia,
		},
		endereco: {
			logradouro: data.logradouro,
			numero: data.numero,
			complemento: data.complemento,
			bairro: data.bairro,
			municipio: data.municipio,
			uf: data.uf,
			cep: data.cep,
			telefone: data.telefone,
		},
		informacoesComplementares: {
			atividadePrincipal: data.atividadePrincipal,
			atividadeSecundaria: data.atividadeSecundaria,
			regimeDeApuracao: data.regimeDeApuracao,
			situacaoCadastral: data.situacaoCadastral,
			dataDessaSituacaoCadastral: data.dataDessaSituacaoCadastral,
			situacaoSintegra: data.situacaoSintegra,
		},
	};
}
