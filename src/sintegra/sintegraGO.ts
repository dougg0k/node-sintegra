import { Page } from "puppeteer";
import { formatText } from "../helpers/formatting";
import { extractText } from "../helpers/puppeteerHelper";
import { setupBrowser, setupPage } from "../helpers/setupPuppeteer";
import estados from "../utils/estados";
import { isObjectEmpty } from "../utils/utils";
import { SintegraGO } from "./Sintegra";

const NEXT_PAGE_CODE_SELECTOR =
	"table tbody tr:nth-of-type(2) td div:nth-of-type(2) center table tbody tr td.block_title";
const INPUT_SELECTOR = "input#tCNPJ";
const ERROR_LABEL_SELECTOR = "table tbody tr:nth-of-type(2) td div div";
const FETCH_RESULT_BUTTON_SELECTOR = "input[name='btCGC']";
const RADIO_SELECTOR = "input#rTipoDocCNPJ";

const getTextSelectorBy = (divNthOfType: number) =>
	`table tbody tr:nth-of-type(2) td div:nth-of-type(${divNthOfType}) span.label_text`;

export async function fetchSintegra(cnpj: string): Promise<SintegraGO> {
	const browser = await setupBrowser();
	try {
		const page = await setupPage(estados.GOIAS.url, browser);
		await setupInitialPart(page, cnpj);

		const newPage = await new Promise((resolve: (value: Page) => void) =>
			browser.once("targetcreated", async (target) =>
				resolve(await target.page()),
			),
		);
		await page.close();

		const text = await getErrorLabelText(newPage);
		if (
			text?.trim() ===
			"Não foi encontrado nenhum contribuinte para o parâmetro informado!"
		) {
			throw new Error("Registro não existe");
		}

		await newPage.waitFor(NEXT_PAGE_CODE_SELECTOR);
		const sintegra = await retrieveAndProcessValues(newPage);
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

async function getErrorLabelText(page: Page) {
	return await extractText(page, ERROR_LABEL_SELECTOR);
}

function getSetOfText(selector: string, page: Page) {
	return page.$$eval(selector, (elements) =>
		elements.map((el) => el.textContent),
	);
}

async function retrieveAndProcessValues(page: Page) {
	const firstSet = await getSetOfText(getTextSelectorBy(2), page);
	const secondSet = await getSetOfText(getTextSelectorBy(3), page);
	const thirdSet = await getSetOfText(getTextSelectorBy(4), page);
	const forthSet = await getSetOfText(getTextSelectorBy(5), page);
	const result = {
		cnpj: firstSet[0],
		ie: firstSet[1],
		nomeEmpresarial: firstSet[2],
		contribuinte: firstSet[3],
		nomeFantasia: firstSet[4],
		logradouro: secondSet[0],
		numero: secondSet[1],
		quadra: secondSet[2],
		lote: secondSet[3],
		complemento: secondSet[4],
		bairro: secondSet[5],
		municipio: thirdSet[0],
		uf: thirdSet[1],
		cep: thirdSet[2],
		atividadePrincipal: forthSet[1],
		atividadeSecundaria: forthSet[4],
		unidadeAuxiliar: forthSet[5],
		condicaoDeUso: forthSet[6],
		dataFinalDeContrato: forthSet[7],
		regimeDeApuracao: forthSet[8],
		situacaoCadastralVigente: forthSet[9],
		dataDestaSituacaoCadastral: forthSet[10],
		dataDeCadastramento: forthSet[11],
		operacoesComNfe: forthSet[12],
	};
	for (const [key, value] of Object.entries(result)) {
		result[key] = formatText(value);
	}
	return result;
}

function buildData(data) {
	if (isObjectEmpty(data)) {
		throw new Error("Sem dados");
	}
	return {
		identificacaoContribuinte: {
			cnpj: data.cnpj,
			ie: data.ie,
			nomeEmpresarial: data.nomeEmpresarial,
			contribuinte: data.contribuinte,
			nomeFantasia: data.nomeFantasia,
		},
		enderecoEstabelecimento: {
			logradouro: data.logradouro,
			numero: data.numero,
			quadra: data.qudra,
			lote: data.lote,
			complemento: data.complemento,
			bairro: data.bairro,
			municipio: data.municipio,
			uf: data.uf,
			cep: data.cep,
		},
		informacoesComplementares: {
			atividadeEconomica: {
				atividadePrincipal: data.atividadePrincipal,
				atividadeSecundaria: data.atividadeSecundaria,
			},
			unidadeAuxiliar: data.unidadeAuxiliar,
			condicaoDeUso: data.condicaoDeUso,
			dataFinalDeContrato: data.dataFinalDeContrato,
			regimeDeApuracao: data.regimeDeApuracao,
			situacaoCadastralVigente: data.situacaoCadastralVigente,
			dataDestaSituacaoCadastral: data.dataDestaSituacaoCadastral,
			dataDeCadastramento: data.dataDeCadastramento,
			operacoesComNfe: data.operacoesComNfe,
		},
	};
}
