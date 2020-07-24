import { Page } from "puppeteer";
import { formatObjKey } from "../helpers/formatting";
import { clearImage, getImageBuffer } from "../helpers/imageProcessing";
import { formatOCRResult, processOcr } from "../helpers/ocr";
import { extractText } from "../helpers/puppeteerHelper";
import { removeColorsFromImage as overwriteColorsInImage } from "../helpers/replaceColorsFromImage";
import { setupBrowser, setupPage } from "../helpers/setupPuppeteer";
import estados from "../utils/estados";
import { isObjectEmpty } from "../utils/utils";
import { SintegraSP } from "./Sintegra";

const NEXT_PAGE_CODE_SELECTOR =
	"span#ctl00_conteudoPaginaPlaceHolder_lblCodigoControleCertidao";
const SELECT_SELECTOR =
	"select#ctl00_conteudoPaginaPlaceHolder_filtroTabContainer_filtroEmitirCertidaoTabPanel_tipoFiltroDropDownList";
const INPUT_SELECTOR =
	"input#ctl00_conteudoPaginaPlaceHolder_filtroTabContainer_filtroEmitirCertidaoTabPanel_valorFiltroTextBox";
const CAPTCHA_IMG_SELECTOR =
	"img#ctl00_conteudoPaginaPlaceHolder_filtroTabContainer_filtroEmitirCertidaoTabPanel_imagemDinamica";
const ERROR_LABEL_SELECTOR =
	"span#ctl00_conteudoPaginaPlaceHolder_filtroTabContainer_filtroEmitirCertidaoTabPanel_MensagemErroFiltroLabel";
const CAPTCHA_INPUT_SELECTOR =
	"input#ctl00_conteudoPaginaPlaceHolder_filtroTabContainer_filtroEmitirCertidaoTabPanel_imagemDinamicaTextBox";
const FETCH_RESULT_BUTTON_SELECTOR =
	"input#ctl00_conteudoPaginaPlaceHolder_filtroTabContainer_filtroEmitirCertidaoTabPanel_consultaPublicaButton";

const getTableSelectorBy = (nthOfType: number) =>
	`table.consultaFiltrosTable table.consultaFiltrosTable table table table:nth-of-type(${nthOfType}) tr`;

const colorsToOverwrite = [
	{ targetColor: "#000000", newColor: "#FFFFFF" },
	{ targetColor: "#00FF00", newColor: "#FFFFFF" },
	{ targetColor: "#00FFFF", newColor: "#FFFFFF" },
	{ targetColor: "#FFFF00", newColor: "#FFFFFF" },
	{ targetColor: "#FF00FF", newColor: "#FFFFFF" },
	{ targetColor: "#0000FF", newColor: "#FFFFFF" },
	{ targetColor: "#FF9F9E", newColor: "#FF0303" },
	{ targetColor: "#FF6A6A", newColor: "#FF0303" },
	{ targetColor: "#FFC6C6", newColor: "#FF0303" },
	{ targetColor: "#FF0303", newColor: "#000000" },
];

export async function fetchSintegra(cnpj: string): Promise<SintegraSP> {
	const browser = await setupBrowser();
	try {
		const page = await setupPage(estados.SAO_PAULO.url, browser);

		await setupInitialPart(page, cnpj);
		let text = await getErrorLabelText(page);

		while (text === "O texto digitado não confere com a imagem de segurança.") {
			await processCaptcha(page);
			text = await getErrorLabelText(page);
		}
		if (
			text ===
			"Não existem registros que atendem ao critério de filtro definido."
		) {
			throw new Error("Registro não existe");
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
	await page.waitFor(SELECT_SELECTOR);
	await page.select(SELECT_SELECTOR, "1");
	await page.waitForNavigation({ waitUntil: "networkidle0" });
	await page.waitFor(INPUT_SELECTOR);
	await page.type(INPUT_SELECTOR, cnpj);
	await processCaptcha(page);
}

async function processCaptcha(page: Page) {
	const result = await processImage(page);
	await submitResult(page, result.data.text);
}

async function getErrorLabelText(page: Page) {
	return await extractText(page, ERROR_LABEL_SELECTOR);
}

function getSetOfText(selector: string, page: Page) {
	return page.$$eval(selector, (elements) =>
		elements.map((el) => {
			return [...el.children]
				.filter((el) => el.innerText.trim().length > 0)
				.map((el) => el.innerText);
		}),
	);
}

async function retrieveAndProcessValues(page: Page) {
	const firstSet = getSetOfText(getTableSelectorBy(2), page);
	const secondSet = getSetOfText(getTableSelectorBy(4), page);
	const thirdSet = getSetOfText(getTableSelectorBy(6), page);
	const values = await Promise.all([firstSet, secondSet, thirdSet]);
	return values.flat().reduce((acc, curr: any) => {
		if (curr.length > 0) {
			acc[formatObjKey(curr[0])] = curr[1].trim();
		}
		if (curr.length === 3) {
			const splitVal = curr[2].split(":");
			acc[formatObjKey(splitVal[0])] = splitVal[1].trim();
		}
		return acc;
	}, {});
}

async function processImage(page: Page) {
	await page.waitFor(CAPTCHA_IMG_SELECTOR);
	const imgUrl = await page.$eval(CAPTCHA_IMG_SELECTOR, (node) => node?.src);
	const jimp = await clearImage(imgUrl.toString());
	const clearedImg = await overwriteColorsInImage(
		await getImageBuffer(jimp),
		colorsToOverwrite,
	);
	return await processOcr(clearedImg);
}

async function submitResult(page: Page, text: string) {
	await page.$eval(CAPTCHA_INPUT_SELECTOR, (el) => (el.value = ""));
	await page.type(CAPTCHA_INPUT_SELECTOR, formatOCRResult(text));
	await page.click(FETCH_RESULT_BUTTON_SELECTOR);
}

function buildData(data) {
	if (isObjectEmpty(data)) {
		throw new Error("Sem dados");
	}
	return {
		estabelecimento: {
			ie: data.ie,
			cnpj: data.cnpj,
			nomeEmpresarial: data.nomeEmpresarial,
			nomeFantasia: data.nomeFantasia,
			naturezaJurdica: data.naturezaJurdica,
		},
		endereco: {
			logradouro: data.logradouro,
			complemento: data.complemento,
			cep: data.cep,
			bairro: data.bairro,
			numero: data.n,
			municipio: data.municpio,
			uf: data.uf,
		},
		informacoesComplementares: {
			situacaoCadastral: data.situaoCadastral,
			dataDaSituacaoCadastral: data.dataDaSituaoCadastral,
			ocorrenciaFiscal: data.ocorrnciaFiscal,
			regimeDeApuracao: data.regimeDeApurao,
			atividadeEconomica: data.atividadeEconmica,
			postoFiscal: data.postoFiscal,
		},
		informacoesNfe: {
			dataDeCredenciamentoComoEmissorDeNFe:
				data.dataDeCredenciamentoComoEmissorDeNFe,
			indicadorDeObrigatoriedadeDeNFe: data.indicadorDeObrigatoriedadeDeNFe,
			dataDeIncioDaObrigatoriedadeDeNFe: data.dataDeIncioDaObrigatoriedadeDeNFe,
		},
	};
}
