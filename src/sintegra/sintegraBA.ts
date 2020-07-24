import { Page } from "puppeteer";
import { formatTextWithAsciiValues } from "../helpers/formatting";
import { extractText } from "../helpers/puppeteerHelper";
import { setupBrowser, setupPage } from "../helpers/setupPuppeteer";
import estados from "../utils/estados";
import { isObjectEmpty } from "../utils/utils";
import { SintegraBA } from "./Sintegra";

const NEXT_PAGE_CODE_SELECTOR = "form[name='frm_EmpresaSocios']";
const INPUT_SELECTOR = "input[name='txt_CNPJ']";
const ERROR_LABEL_SELECTOR = "font[color='#ff0000']";
const FETCH_RESULT_BUTTON_SELECTOR = "input[name='Submit']";

const getValueSelectorBy = (tableNthOfType: number, tdNthOfType: number) =>
	`form[name='frm_EmpresaSocios'] table:nth-of-type(${tableNthOfType}) tbody tr td:nth-of-type(${tdNthOfType}) font`;

export async function fetchSintegra(cnpj: string): Promise<SintegraBA> {
	const browser = await setupBrowser();
	try {
		const page = await setupPage(estados.BAHIA.url, browser);
		await setupInitialPart(page, cnpj);

		const text = await getErrorLabelText(page);
		if (
			text?.includes(
				"NÃ£o foi encontrado contribuinte cadastrado no Estado da Bahia",
			)
		) {
			throw new Error("Registro não existe");
		}
		if (
			text?.includes(
				"pertence a uma empresa nÃ£o inscrita no Cadastro do ICMS do Estado da Bahia",
			)
		) {
			throw new Error("Não foi cadastrado como contribuinte de ICMS");
		}

		await page.waitFor(NEXT_PAGE_CODE_SELECTOR);
		const sintegra = await retrieveAndProcessValues(page);
		return buildData(sintegra);
	} catch (err) {
		throw err;
	} finally {
		await browser.close();
	}
}

async function setupInitialPart(page: Page, cnpj: string) {
	const input = await page.waitFor(INPUT_SELECTOR);
	await input.type(cnpj);
	await page.click(FETCH_RESULT_BUTTON_SELECTOR);
}

async function getErrorLabelText(page: Page) {
	return await extractText(page, ERROR_LABEL_SELECTOR);
}

async function retrieveAndProcessValues(page: Page) {
	const cnpj = await extractText(page, getValueSelectorBy(2, 2));
	const ie = await extractText(page, getValueSelectorBy(2, 4));
	const razaoSocial = await extractText(page, getValueSelectorBy(3, 2));
	const logradouro = await extractText(page, getValueSelectorBy(5, 2));
	const numero = await extractText(page, getValueSelectorBy(6, 2));
	const complemento = await extractText(page, getValueSelectorBy(6, 4));
	const bairro = await extractText(page, getValueSelectorBy(6, 6));
	const uf = await extractText(page, getValueSelectorBy(7, 2));
	const municipio = await extractText(page, getValueSelectorBy(7, 4));
	const cep = await extractText(page, getValueSelectorBy(7, 6));
	const enderecoEletronico = await extractText(page, getValueSelectorBy(8, 2));
	const telefone = await extractText(page, getValueSelectorBy(8, 4));
	const atividadeEconomica = await extractText(page, getValueSelectorBy(10, 2));
	const dataDaInscricaoEstadual = await extractText(
		page,
		getValueSelectorBy(11, 2),
	);
	const usuarioSEPD = await extractText(page, getValueSelectorBy(11, 4));
	const situacaoCadastralAtual = await extractText(
		page,
		getValueSelectorBy(12, 2),
	);
	const dataDestaSituacaoCadastral = await extractText(
		page,
		getValueSelectorBy(12, 4),
	);
	const condicao = await extractText(page, getValueSelectorBy(13, 2));
	const observacoes = await extractText(page, getValueSelectorBy(14, 2));
	const regimeDeApuracaoDeICMS = await extractText(
		page,
		getValueSelectorBy(15, 2),
	);
	const result = {
		cnpj,
		ie,
		uf,
		razaoSocial,
		logradouro,
		numero,
		complemento,
		bairro,
		municipio,
		cep,
		enderecoEletronico,
		telefone,
		atividadeEconomica,
		dataDaInscricaoEstadual,
		usuarioSEPD,
		situacaoCadastralAtual,
		dataDestaSituacaoCadastral,
		condicao,
		observacoes,
		regimeDeApuracaoDeICMS,
	};
	for (const [key, value] of Object.entries(result)) {
		result[key] = formatTextWithAsciiValues(value);
	}
	return result;
}

function buildData(data) {
	if (isObjectEmpty(data)) {
		throw new Error("Sem dados");
	}
	return {
		identificacao: {
			cnpj: data.cnpj,
			ie: data.ie,
			razaoSocial: data.razaoSocial,
		},
		endereco: {
			logradouro: data.logradouro,
			numero: data.numero,
			complemento: data.complemento,
			bairro: data.bairro,
			uf: data.uf,
			municipio: data.municipio,
			cep: data.cep,
			enderecoEletronico: data.enderecoEletronico,
			telefone: data.telefone,
		},
		informacoesComplementares: {
			atividadeEconomica: data.atividadeEconomica,
			dataDaInscricaoEstadual: data.dataDaInscricaoEstadual,
			usuarioSEPD: data.usuarioSEPD,
			situacaoCadastralAtual: data.situacaoCadastralAtual,
			dataDestaSituacaoCadastral: data.dataDestaSituacaoCadastral,
			condicao: data.condicao,
			observacoes: data.observacoes,
			regimeDeApuracaoDeICMS: data.regimeDeApuracaoDeICMS,
		},
	};
}
