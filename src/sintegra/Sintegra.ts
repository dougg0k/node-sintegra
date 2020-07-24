export type Sintegra = SintegraSP | SintegraAL;

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

export interface SintegraAL {
	numeroPessoa: number;
	cnpj: string;
	caceal: number;
	digitoCaceal: number;
	descricaoSituacaoCadastral: string;
	descricaoMotivoSituacaoCadastral: string;
	indicadorOpcaoSimples: string;
	razaoSocial: string;
	nomeFantasia: string;
	tipoLogradouro: string;
	logradouro: string;
	numeroImovel: string;
	bairro: string;
	municipio: string;
	uf: string;
	cep: string;
	dataInicioAtividade: string;
	complemento: string;
	indicadorSituacao: string;
	enderecoEletronico: string;
	atividadesContribuinte: Array<{
		atividadeContribuinteId: {
			caceal: number;
			numeroPessoa: string;
			sequencial: number;
		};
		cnpj: string;
		codigoCnae: string;
		descricao: string;
		indicadorPrincipal: string;
	}>;
	telefone: string;
	contribuinteObrigado: {
		numeroCaceal: number;
		dataInicioObrigatoriedade: number;
		dataFinalObrigatoriedade: string;
		cnpj: string;
		observacao: string;
	};
	dataObrigatoriedade: string;
	contribuinteRestricao: boolean;
	indicadorMei: string;
	regimesContribuinte: Array<any>;
}
