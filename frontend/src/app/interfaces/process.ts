export interface Process {
    number: string,
    partiesInvolved: string,
    distribution: string,
    nextHearing: string,
    status: string,
    location: string,
    lastMovement: string,
    lastChecked: string,
    description: string,
    kind: string,
    lawyersInvolved: string,
    everyoneInvolved: string,
}

export interface ProcessoRes {
    count?: number;
    next: any;
    previous: any;
    results: {
        processo: Processo
    }[]
}

export interface FonteRes {
    count?: number;
    next: any;
    previous: any;
    results: {
        fonte: Fonte
    }[]
}

export interface TribunalRes {
    count?: number;
    next: any;
    previous: any;
    results: {
        tribunal: Tribunal
    }[]
}



export interface CapaRes {
    count?: number;
    next: any;
    previous: any;
    results: {
        capa: Capa
    }[]
}

export interface ValorCausaRes {
    count: number;
    next: any;
    previous: any;
    results: {
        valor_causa: ValorCausa
    }[]
}

export interface AssuntoNormalizadoRes {
    count: number;
    next: any;
    previous: any;
    results: {
        assunto_principal_normalizado: AssuntoNormalizado
    }[]
}

export interface EnvolvidoRes {
    count: number;
    next: any;
    previous: any;
    results: {
        envolvido: Envolvido
    }[]
}

export interface EstadoOrigemRes {
    count: number;
    next: number;
    previous: any;
    results: {
        estado_origem: EstadoOrigem
    }[]
}

export interface EstadoOrigem {
    id?: number;
    nome: string;
    sigla: string;
}



export interface Processo {
    numero_cnj: string;
    id?: number | undefined;
    titulo_polo_ativo: string;
    titulo_polo_passivo: string;
    estado_origem?: EstadoOrigem;
    ano_inicio: number;
    data_inicio: string;
    data_ultima_movimentacao: string;
    quantidade_movimentacoes: number;
    fontes_tribunais_estao_arquivadas: boolean;
    data_ultima_verificacao: string;
    tempo_desde_ultima_verificacao: string;
    fontes?: Fonte[];
}

export interface Fonte {
    id?: number
    id_escavador: number;
    processo_fonte_id: number;
    descricao: string;
    nome: string;
    sigla: string;
    tipo: string;
    data_inicio: string;
    data_ultima_movimentacao: string;
    segredo_justica: any
    arquivado: any;
    grau: number;
    grau_formatado: string;
    fisico: boolean;
    sistema: string;
    capa?: Capa;
    url: string;
    tribunal?: Tribunal;
    quantidade_movimentacoes: number;
    data_ultima_verificacao: string;
    envolvidos?: Envolvido[];
}

export interface Capa {
    id?: number
    classe: string;
    assunto: string;
    assuntos_normalizados?: AssuntoNormalizado[];
    assunto_principal_normalizado?: AssuntoNormalizado;
    area: string;
    orgao_julgador: string;
    valor_causa?: ValorCausa;
    data_distribuicao: string;
    data_arquivamento: any
    informacoes_complementares: any
}

export interface ValorCausa {
    id?: number
    valor: number;
    moeda: string;
    valor_formatado: string;
}

export interface AssuntoNormalizado {
    id?: number
    id_escavador: number;
    nome: string;
    nome_com_pai: string;
    path_completo: string;
    bloqueado: boolean;
}

export interface Tribunal {
    id?: number
    id_escavador: number;
    nome: string;
    sigla: string;
    categoria: any
}

export interface Envolvido {
    id?: number,
    nome: string;
    quantidade_processos: number;
    tipo_pessoa: string;
    advogados?: Advogado[];
    prefixo: string | null;
    sufixo: string | null;
    tipo: string;
    tipo_normalizado: string;
    polo: string;
    cpf: string;
    nome_normalizado: string;
}

export interface Advogado {
    id?: number,
    nome: string;
    quantidade_processos: string;
    tipo_pessoa: string;
    prefixo: any;
    sufixo: any;
    tipo: string;
    tipo_normalizado: string;
    polo: string;
    cpf: string;
    cnpj?: string,
    nome_normalizado: string;
    oabs: Oab[]
}

export interface Oab {
    id?: number,
    uf: string;
    tipo: string;
    numero: number;
}