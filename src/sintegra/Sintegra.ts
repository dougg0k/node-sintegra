export type Sintegra = SintegraSP | SintegraAL | SintegraBA | SintegraDF;

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

export interface SintegraBA {
	identificacao: {
		cnpj: string;
		ie: string;
		razaoSocial: string;
	};
	endereco: {
		logradouro: string;
		numero: string;
		complemento: string;
		bairro: string;
		uf: string;
		municipio: string;
		cep: string;
		enderecoEletronico: string;
		telefone: string;
	};
	informacoesComplementares: {
		atividadeEconomica: string;
		dataDaInscricaoEstadual: string;
		usuarioSEPD: string;
		situacaoCadastralAtual: string;
		dataDestaSituacaoCadastral: string;
		condicao: string;
		observacoes: string;
		regimeDeApuracaoDeICMS: string;
	};
}

export interface SintegraDF {
	identificacao: {
		cnpj: string;
		cfDf: string;
		razaoSocial: string;
		nomeFantasia: string;
	};
	endereco: {
		logradouro: string;
		numero: string;
		complemento: string;
		bairro: string;
		municipio: string;
		uf: string;
		cep: string;
		telefone: string;
	};
	informacoesComplementares: {
		atividadePrincipal: string;
		atividadeSecundaria: string;
		regimeDeApuracao: string;
		situacaoCadastral: string;
		dataDessaSituacaoCadastral: string;
		situacaoSintegra: string;
	};
}
