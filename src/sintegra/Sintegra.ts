export type Sintegra = SintegraSP;

export interface SintegraSP {
	estabelecimento: {
		ie: string;
		cnpj: string;
		nomeEmpresarial: string;
		nomeFantasia: string;
		naturezaJurdica: string;
	};
	endereco: {
		logradouro: string;
		complemento: string;
		cep: string;
		bairro: string;
		numero: string;
		municipio: string;
		uf: string;
	};
	informacoesComplementares: {
		situacaoCadastral: string;
		dataDaSituacaoCadastral: string;
		ocorrenciaFiscal: string;
		regimeDeApuracao: string;
		atividadeEconomica: string;
		postoFiscal: string;
	};
	informacoesNfe: {
		dataDeCredenciamentoComoEmissorDeNFe: string;
		indicadorDeObrigatoriedadeDeNFe: string;
		dataDeIncioDaObrigatoriedadeDeNFe: string;
	};
}
