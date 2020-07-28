import { Page } from "puppeteer";
import {
	applyFilters,
	clearImage,
	getImageBuffer,
	replaceColorsFromImage,
} from "../helpers/imageManipulation";
import { formatOCRResult, processOcr } from "../helpers/ocr";
import { extractText, extractValue } from "../helpers/puppeteerHelper";
import { setupBrowser, setupPage } from "../helpers/setupPuppeteer";
import estados from "../utils/estados";
import { isObjectEmpty } from "../utils/utils";
import { SintegraMS } from "./Sintegra";

const NEXT_PAGE_CODE_SELECTOR = "input[name='_dataPesquisa']";
const INPUT_SELECTOR = "input#cnpj";
const CAPTCHA_IMG_SELECTOR = "img#captchaImagem";
const ERROR_LABEL_SELECTOR = "div.alert-error";
const CAPTCHA_INPUT_SELECTOR = "input#captcha";
const FETCH_RESULT_BUTTON_SELECTOR = "button#envia";

const colorsToOverwrite = [
	{ targetColor: "#00FFFF", newColor: "#ffffff" },
	{ targetColor: "#00FF00", newColor: "#ffffff" },
];

export async function fetchSintegra(cnpj: string): Promise<SintegraMS> {
	const browser = await setupBrowser();
	try {
		const page = await setupPage(estados.MATO_GROSSO_DO_SUL.url, browser);

		await setupInitialPart(page, cnpj);
		await processCaptcha(page);

		let text = await getErrorLabelText(page);
		while (
			text?.trim().includes("O Texto digitado não confere com a Imagem") ||
			text?.trim().includes("Atenção: CNPJ inválido")
		) {
			await page.reload({ waitUntil: "networkidle0" });
			await setupInitialPart(page, cnpj);
			await processCaptcha(page);
			text = await getErrorLabelText(page);
		}
		if (
			text?.trim() === "Atenção: CNPJ informado não contém IEs CCI" ||
			text?.trim() === "Atenção: Nenhum resultado encontrado"
		) {
			throw new Error("Registro não existe");
		}

		await page.waitFor(NEXT_PAGE_CODE_SELECTOR, { hidden: true });
		const sintegra = await retrieveAndProcessValues(page);
		return buildData(sintegra);
	} catch (err) {
		throw err;
	} finally {
		await browser.close();
	}
}

async function setupInitialPart(page: Page, cnpj: string) {
	const input = await page.waitFor(INPUT_SELECTOR, { visible: true });
	await input.type(cnpj.charAt(0));
	await input.type(cnpj);
}

async function getErrorLabelText(page: Page) {
	return await extractText(page, ERROR_LABEL_SELECTOR, { timeout: 15000 });
}

async function processCaptcha(page: Page) {
	const text = await processImage(page);
	await submitResult(page, text);
}

async function processImage(page: Page) {
	await page.waitFor(CAPTCHA_IMG_SELECTOR);
	const imgUrl = await page.$eval(
		CAPTCHA_IMG_SELECTOR,
		(node: any) => node?.src,
	);
	const jimp = await clearImage(imgUrl.toString());
	const clearedImg = await replaceColorsFromImage(
		await getImageBuffer(jimp),
		colorsToOverwrite,
	);
	const img = await applyFilters(await getImageBuffer(clearedImg));
	return await processOcr(img, "0123456789");
}

async function submitResult(page: Page, text: string) {
	await page.type(CAPTCHA_INPUT_SELECTOR, formatOCRResult(text));
	await page.click(FETCH_RESULT_BUTTON_SELECTOR);
}

async function retrieveAndProcessValues(page: Page) {
	const ie = await extractValue(page, "input#inscricaoEstadual");
	const dataDeInicioDeAtividade = await extractValue(
		page,
		"input#dataInicioAtividade",
	);
	const cnpj = await extractValue(page, "input#pessoa_cnpjcpf");
	const razaoSocial = await extractValue(page, "input#pessoa_nome");
	const descricaoDaAtividade = await extractValue(page, "input#caeDescricao");
	const logradouro = await extractValue(
		page,
		"input#pessoa_pessoaEndereco_logradouro",
	);
	const numero = await extractValue(page, "input#pessoa_pessoaEndereco_numero");
	const complemento = await extractValue(
		page,
		"input#pessoa_pessoaEndereco_complemento",
	);
	const cep = await extractValue(page, "input#pessoa_pessoaEndereco_cep");
	const bairro = await extractValue(page, "input#pessoa_pessoaEndereco_bairro");
	const municipio = await extractValue(
		page,
		"input#pessoa_pessoaEndereco_municipio",
	);
	const uf = await extractValue(page, "input#pessoa_pessoaEndereco_uf");
	const situacaoCadastral = await extractValue(page, "input#situacaoCadastral");
	const dataDaUltimaAtualizacao = await extractValue(
		page,
		"input#dataAtualizacao",
	);
	const motivoDaSituacao = await extractValue(page, "input#descricaoSituacao");

	return {
		ie,
		dataDeInicioDeAtividade,
		cnpj,
		razaoSocial,
		descricaoDaAtividade,
		logradouro,
		numero,
		complemento,
		cep,
		bairro,
		municipio,
		uf,
		situacaoCadastral,
		dataDaUltimaAtualizacao,
		motivoDaSituacao,
	};
}

function buildData(data) {
	if (isObjectEmpty(data)) {
		throw new Error("Sem dados");
	}
	return {
		ie: data.ie,
		dataDeInicioDeAtividade: data.dataDeInicioDeAtividade,
		cnpj: data.cnpj,
		razaoSocial: data.razaoSocial,
		descricaoDaAtividade: data.descricaoDaAtividade,
		logradouro: data.logradouro,
		numero: data.numero,
		complemento: data.complemento,
		cep: data.cep,
		bairro: data.bairro,
		municipio: data.municipio,
		uf: data.uf,
		situacaoCadastral: data.situacaoCadastral,
		dataDaUltimaAtualizacao: data.dataDaUltimaAtualizacao,
		motivoDaSituacao: data.motivoDaSituacao,
	};
}
