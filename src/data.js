// =====================================================================
// Conteúdo do site Bear Finance. Edite aqui e rode `npm run build`.
// Regras deste arquivo (marketing B2B contábil):
//   • nenhum número de clientes, anos de mercado, NPS, prêmios, depoimentos
//     ou economia percentual sem fonte — o que a Bear ainda precisa validar
//     leva o comentário `[A CONFIRMAR]` logo acima e um texto neutro no valor;
//   • fotos e vídeos continuam provisórios (vídeos: informe o ID do YouTube,
//     ex.: "dQw4w9WgXcQ", ou deixe "" para manter o espaço reservado);
//   • campos `icon` usam os nomes do sprite em src/icons.js.
// =====================================================================

export const site = {
  name: "Bear Finance",
  tagline: "Contabilidade consultiva, BPO financeiro e inteligência tributária para a sua empresa crescer",
  description: "A Bear Finance une contabilidade consultiva, BPO financeiro e de folha, auditoria, consultoria tributária e estruturações corporativas a uma plataforma própria com IA, com sede em São Paulo e atendimento digital em todo o Brasil.",
  url: "https://www.bearfinance.com.br",
  email: "contato@bearfinance.com.br",
  phone: "(11) 98314-8774",
  phoneHref: "tel:+5511983148774",
  whatsappNumber: "5511983148774",            // só dígitos; o build gera wa.me/<n>?text=
  whatsapp: "https://wa.me/5511983148774",
  // [A CONFIRMAR] perfis oficiais nas redes sociais
  instagram: "https://instagram.com/bearfinance",
  linkedin: "https://www.linkedin.com/company/bearfinance",
  youtube: "https://www.youtube.com/@bearfinance",
  address: "Rua Riachuelo, 231 – 4º andar, Sé, 01007-000",
  city: "São Paulo – SP",
  // [A CONFIRMAR] razão social e CNPJ para o rodapé e a política de privacidade
  razaoSocial: "",
  cnpj: "",
  dmcName: "Complexo DMC",
  // [A CONFIRMAR] URL oficial do Complexo DMC (rodapé: "Integra o ecossistema Complexo DMC")
  dmcUrl: "",
  // [A CONFIRMAR] URL de acesso da Plataforma Bear para clientes
  platformUrl: "https://www.bearfinance.com.br",
  heroVideo: "",                 // URL de um .mp4 para o fundo do topo (vazio = usa a imagem)
  heroImage: "hero.svg",
  headlineFx: true,              // ondas animadas também no topo das páginas internas
  placeholderLabels: true,       // false = esconde as etiquetas "FOTO · substituir"
};

// IDs de vídeo do YouTube por página ("" = espaço reservado)
export const videos = {
  home: { id: "", title: "Conheça a Bear Finance", sub: "Como trabalhamos, em poucos minutos" },
  sobre: { id: "", title: "Quem somos", sub: "Origem, método e o que entregamos" },
  carreira: { id: "", title: "Um dia na Bear", sub: "Como é trabalhar no nosso time" },
  cases: { id: "", title: "Como atuamos por setor", sub: "Cenários típicos e a nossa abordagem" },
  contato: { id: "", title: "O que acontece após o seu contato", sub: "Diagnóstico, proposta e onboarding" },
  plataforma: { id: "", title: "Tour pela Plataforma Bear", sub: "Dashboards, conciliação e IA" },
  esg: { id: "", title: "Nossas práticas ESG", sub: "O que fazemos dentro de casa" },
  conteudo: { id: "", title: "Webinars e podcasts", sub: "Último episódio" },
};

// ---------------------------------------------------------------------
// Hero (home)
// ---------------------------------------------------------------------
export const hero = {
  eyebrow: "Contabilidade consultiva · BPO financeiro · Inteligência tributária",
  typedWords: ["contábeis", "financeiras", "tributárias", "tecnológicas"],
  title: `Sua empresa precisa de mais do que contabilidade. Precisa de <strong>inteligência para crescer</strong>.`,
  sub: "Contabilidade consultiva, BPO financeiro e visão tributária em uma plataforma própria com IA. Você decide com números confiáveis, cumpre prazos sem sustos e paga o imposto certo — nem mais, nem menos.",
  cta: "Solicitar diagnóstico",
  ctaHref: "/contato/#diagnostico",
  cta2: "Conhecer soluções",
  cta2Href: "#servicos",
  badges: [
    { icon: "sparkles", text: "Plataforma própria com IA" },
    { icon: "users", text: "Especialistas por setor" },
    { icon: "shield", text: "LGPD e segurança da informação" },
    { icon: "globe", text: "Atendimento digital em todo o Brasil" },
  ],
};

// [A CONFIRMAR] logos de clientes com autorização de uso — até lá a faixa fica vazia
export const clients = [];

// ---------------------------------------------------------------------
// Proposta de valor (home): por que a Bear é mais do que obrigações em dia
// ---------------------------------------------------------------------
export const valueProp = {
  eyebrow: "Por que a Bear",
  h2: "Cumprir obrigações é o mínimo.<br>Sua empresa precisa de <strong>números para decidir</strong>.",
  p: "Guia paga e balancete entregue todo escritório promete. O que muda o jogo é transformar essa rotina em informação: margem real, caixa projetado, carga tributária sob controle e uma estrutura societária que acompanha o crescimento. É isso que a Bear entrega todo mês.",
  pillars: [
    { icon: "chart-bar", title: "Números que servem para decidir", text: "Fechamento mensal revisado, DRE e indicadores que a liderança entende e usa — não só arquivos para o Fisco." },
    { icon: "sparkles", title: "Tecnologia própria, conferência humana", text: "Nossa plataforma com IA concilia, classifica e alerta. Especialistas revisam as exceções e respondem pelo resultado." },
    { icon: "target", title: "Visão tributária e societária integrada", text: "Regime, créditos, holding e sucessão analisados em conjunto, já considerando a Reforma Tributária." },
  ],
};

// ---------------------------------------------------------------------
// Diferenciais (home) — substitui a antiga seção `why`; sem números
// ---------------------------------------------------------------------
export const differentials = {
  eyebrow: "Diferenciais",
  h2: "O que muda quando a contabilidade<br><strong>trabalha a favor do negócio</strong>",
  p: "Sem promessa de milagre tributário. O que entregamos todo mês é método, tecnologia própria e gente que conhece o seu setor.",
  items: [
    { icon: "users", title: "Atendimento por setor", text: "Quem cuida da sua conta conhece os tributos, as obrigações e os indicadores do seu segmento. Menos tempo explicando, mais tempo decidindo." },
    { icon: "search-chart", title: "Revisão em duas camadas", text: "Todo fechamento passa pelo analista e por um revisor antes de chegar a você. Diferenças são tratadas antes da entrega, não depois da autuação." },
    { icon: "cpu", title: "Tecnologia própria", text: "Plataforma desenvolvida pela Bear, com IA para conciliar, classificar e alertar, integrada a bancos e ERPs. Você acompanha tudo em um só lugar." },
    { icon: "lock", title: "Segurança e LGPD", text: "Controle de acesso por perfil, dados protegidos e acordos de confidencialidade com todo o time. Seus números ficam onde devem ficar." },
    { icon: "percent", title: "Visão tributária", text: "Regime, créditos, incentivos e Reforma Tributária analisados de forma contínua, não só quando a Receita bate à porta." },
    { icon: "handshake", title: "Proximidade", text: "Canal direto com o contador responsável e reuniões de resultado. Você fala com quem conhece a sua empresa, não com uma fila de chamados." },
  ],
};

// ---------------------------------------------------------------------
// Método (home): jornada do cliente
// ---------------------------------------------------------------------
export const method = {
  eyebrow: "Como funciona",
  h2: "Da primeira conversa à operação:<br><strong>um caminho claro</strong>",
  p: "Você sabe o que acontece em cada etapa, quem é o responsável e o que recebe ao final. Sem surpresa de escopo e sem transição traumática.",
  steps: [
    { title: "Diagnóstico", text: "Entendemos regime, sistemas, volume, equipe e o que incomoda hoje. Você recebe uma leitura objetiva de riscos e oportunidades." },
    { title: "Proposta sob medida", text: "Escopo, entregas, prazos e investimento definidos pelo porte e pela complexidade da operação, não por pacote fechado." },
    { title: "Onboarding e integrações", text: "Migração dos dados, conexão com bancos e ERP, calendário de entregas e regras de aprovação acordados com a sua equipe." },
    { title: "Operação mensal", text: "Fechamento revisado, tributos apurados, obrigações entregues e dashboards atualizados na plataforma." },
    { title: "Acompanhamento e revisões", text: "Reuniões de resultado, revisão de regime e de estrutura quando o negócio muda, e alertas antes dos prazos." },
  ],
};

// ---------------------------------------------------------------------
// Chamada de conversão (home e páginas internas)
// ---------------------------------------------------------------------
export const conversion = {
  eyebrow: "Próximo passo",
  h2: "Comece por um <strong>diagnóstico</strong> da sua operação",
  p: "Conte como a sua empresa funciona hoje: regime, sistemas, volume e o que mais incomoda. A partir daí, mostramos onde estão os riscos e as oportunidades — e o que mudaria com a Bear.",
  bullets: [
    "Um especialista do seu setor analisa o cenário e entra em contato para entender os detalhes",
    "Você recebe uma leitura objetiva: riscos, oportunidades e próximos passos",
    "Proposta sob medida, com escopo e investimento claros, sem compromisso",
  ],
  primary: { label: "Solicitar diagnóstico", href: "/contato/#diagnostico" },
  whatsappText: "Olá! Quero solicitar um diagnóstico da Bear Finance para a minha empresa.",
};

// Introdução da seção Verticais (home)
export const segmentsIntro = {
  eyebrow: "Verticais",
  h2: "Contabilidade que fala a língua <strong>do seu setor</strong>",
  p: "Cada segmento tem tributos, obrigações e indicadores próprios. Por isso organizamos o atendimento por vertical: quem cuida da sua empresa conhece as regras, os riscos e as oportunidades do seu mercado.",
};

// Bloco de plataforma nas páginas de serviço
export const platformTeaser = {
  eyebrow: "Plataforma Bear",
  h2: "Tecnologia própria por trás<br><strong>de cada entrega</strong>",
  p: "Toda rotina da Bear roda sobre uma plataforma desenvolvida internamente. Ela integra bancos e ERPs, usa IA para o trabalho repetitivo e deixa a conferência final com especialistas. Você acompanha o que importa em um só lugar.",
  bullets: [
    "Conciliação bancária e classificação de lançamentos com IA",
    "Dashboards de caixa, resultado e indicadores atualizados",
    "Alertas de prazos, inconsistências e compliance",
    "Integração com bancos e com os principais ERPs do mercado",
  ],
};

// ---------------------------------------------------------------------
// SEO por página (title ≤ 60 caracteres; description 140–160)
// ---------------------------------------------------------------------
export const seo = {
  home: { title: "Contabilidade consultiva e BPO financeiro | Bear Finance", description: "Contabilidade consultiva, BPO financeiro e de folha, auditoria e consultoria tributária com plataforma própria com IA. Sede em SP, atendimento em todo o Brasil." },
  atuacao: { title: "Áreas de atuação: contabilidade e BPO | Bear Finance", description: "Conheça os serviços da Bear Finance: contabilidade, BPO financeiro, BPO de folha, auditoria e consultoria tributária e estruturações corporativas para empresas." },
  verticais: { title: "Contabilidade por setor de atuação | Bear Finance", description: "Contabilidade por setor: indústria, agro, saúde, construção, logística, varejo, energia, serviços e tecnologia. Fale com quem conhece o seu mercado." },
  sobre: { title: "Sobre a Bear Finance | Contabilidade consultiva", description: "Conheça a Bear Finance: contabilidade consultiva com plataforma própria com IA, sede em São Paulo, atendimento em todo o Brasil e parte do Complexo DMC." },
  esg: { title: "ESG e governança na Bear Finance", description: "Como a Bear Finance aplica práticas ambientais, sociais e de governança na própria operação e apoia a governança financeira e fiscal das empresas que atende." },
  carreira: { title: "Carreira na Bear Finance | Trabalhe conosco", description: "Banco de talentos da Bear Finance para contabilidade, BPO financeiro, departamento pessoal, tecnologia, marketing e comercial. Cadastre-se e fale conosco." },
  cases: { title: "Cenários de atuação por setor | Bear Finance", description: "Situações típicas que a Bear Finance atende: indústria, saúde, varejo, tecnologia, agro e construção. Veja o desafio, a abordagem e as entregas em cada cenário." },
  plataforma: { title: "Plataforma Bear: gestão financeira com IA | Bear Finance", description: "Plataforma própria da Bear Finance: conciliação bancária, classificação de lançamentos com IA, dashboards e alertas de compliance integrados a bancos e ERPs." },
  parcerias: { title: "Programas de parceria para contadores | Bear Finance", description: "Business Partner Outsourcing para escritórios contábeis e Business Partner para quem indica empresas. Conheça os programas de parceria da Bear Finance." },
  contato: { title: "Contato e diagnóstico | Bear Finance", description: "Fale com a Bear Finance pelo WhatsApp, e-mail ou formulário e solicite um diagnóstico contábil, financeiro e tributário para a sua empresa. Sede em São Paulo." },
  conteudo: { title: "Conteúdo: Reforma Tributária e gestão | Bear Finance", description: "Artigos da Bear Finance sobre Reforma Tributária, BPO financeiro, holding, contabilidade por setor e tecnologia para empresas que querem decidir com números." },
  privacidade: { title: "Política de privacidade | Bear Finance", description: "Saiba como a Bear Finance coleta, usa e protege os dados pessoais de clientes, parceiros e visitantes do site, conforme a LGPD, e quais são os seus direitos." },
};

// Opções dos formulários de diagnóstico (o backend valida por enum — não altere sem avisar)
export const formOptions = {
  segmentos: ["Indústria", "Agronegócio", "Saúde", "Mercado Imobiliário e Construção Civil", "Transportes e Logística", "Varejo e Distribuição", "Energia", "Serviços e Tecnologia", "Outro"],
  servicos: ["Contabilidade", "BPO Financeiro", "BPO de Folha de Pagamento", "Auditoria e Consultoria Tributária", "Estruturações Corporativas", "Ainda não sei"],
};

// ---------------------------------------------------------------------
// Áreas de atuação (5)
// ---------------------------------------------------------------------
export const services = [
  {
    slug: "contabilidade",
    icon: "calculator",
    name: "Contabilidade",
    excerpt: "Escrituração, apuração de tributos e fechamento mensal revisado, com um contador que conhece o seu setor e responde pelo resultado.",
    waText: "Olá! Quero saber mais sobre a Contabilidade consultiva da Bear Finance para a minha empresa.",
    metaTitle: "Contabilidade consultiva para empresas | Bear Finance",
    metaDescription: "Contabilidade consultiva para empresas: escrituração, apuração de tributos e fechamento mensal revisado, integrados ao seu ERP. Solicite um diagnóstico à Bear.",
    outcomes: ["Fechamento mensal com balancete e DRE revisados", "Tributos apurados e guias entregues dentro do prazo", "Obrigações acessórias (SPED, ECD, ECF, DCTFWeb) monitoradas", "Relatório mensal com a leitura consultiva do contador responsável"],
    headline: { h2: "Contabilidade que<br><strong>orienta decisões</strong>", p: "Escrituração contábil e fiscal, apuração de tributos e demonstrações mensais revisadas, integradas ao seu ERP e acompanhadas por um contador responsável pela sua conta." },
    intro: {
      h2: "Mais do que obrigações<br><strong>em dia</strong>",
      p: "Quando a contabilidade só olha para o Fisco, a empresa decide no escuro: margem estimada, caixa que surpreende, imposto pago a mais ou a menos. Na Bear, o fechamento mensal vira base para decidir.",
      arrows: ["Escrituração contábil e fiscal em todos os regimes (Simples, Presumido e Real)", "Obrigações acessórias federais, estaduais e municipais monitoradas por prazo", "Fechamento mensal com balancete, DRE e indicadores revisados", "Contador responsável que conhece o seu setor e o seu ERP"],
      close: "O resultado é uma contabilidade que você entende, confia e usa: para precificar, negociar com bancos e planejar o próximo ano.",
    },
    method: {
      h2: "Como garantimos<br><strong>um fechamento confiável</strong>",
      items: [["Captura integrada", "Notas, extratos e folha entram pela plataforma e pelas integrações com bancos e ERP, sem redigitação."], ["Classificação com IA", "Lançamentos classificados automaticamente; as exceções vão para o analista."], ["Revisão em duas camadas", "O analista fecha; um revisor confere balancete, apurações e conciliações antes da entrega."], ["Calendário de obrigações", "Prazos federais, estaduais e municipais monitorados com alertas na plataforma."], ["Leitura consultiva", "O contador responsável comenta variações, riscos e oportunidades do mês com você."]],
    },
    quote: "Contabilidade boa é a que você entende: <strong>números revisados, no prazo e explicados por quem conhece o seu negócio.</strong>",
    img: "ph-01.svg", img2: "ph-02.svg",
    video: { id: "", title: "Como funciona a contabilidade Bear", sub: "Do onboarding ao fechamento mensal" },
    faq: [["O que está incluso na contabilidade da Bear?", "Escrituração contábil e fiscal, apuração de tributos, obrigações acessórias (SPED, ECD, ECF, DCTFWeb), demonstrações mensais revisadas e atendimento consultivo com um contador responsável pela sua conta. Folha, BPO financeiro e consultoria tributária entram no escopo conforme a sua necessidade."], ["Como funciona a troca de contador?", "Cuidamos do processo: solicitamos a documentação ao escritório anterior, revisamos a escrituração, apontamos pendências e assumimos as rotinas sem interromper as suas obrigações. Você acompanha cada etapa na plataforma."], ["Vocês atendem empresas no Lucro Real?", "Sim. Atendemos Simples Nacional, Lucro Presumido e Lucro Real, inclusive grupos com várias empresas e operações em mais de um estado. O escopo e o investimento acompanham a complexidade."]],
  },
  {
    slug: "bpo-financeiro",
    icon: "chart-line",
    name: "BPO Financeiro",
    excerpt: "Contas a pagar, contas a receber, conciliação e fluxo de caixa operados pela Bear, com aprovação sua e visibilidade na plataforma.",
    waText: "Olá! Quero saber mais sobre o BPO Financeiro da Bear Finance para a minha empresa.",
    metaTitle: "BPO financeiro para empresas | Bear Finance",
    metaDescription: "BPO financeiro para empresas: contas a pagar e a receber, conciliação bancária e fluxo de caixa com aprovação por alçada e visibilidade na plataforma da Bear.",
    outcomes: ["Contas a pagar e a receber executadas com aprovação por alçada", "Conciliação bancária diária na plataforma", "Fluxo de caixa realizado e projetado atualizado", "DRE gerencial e indicadores mensais"],
    headline: { h2: "Seu financeiro<br><strong>operado com método</strong>", p: "Contas a pagar, contas a receber, conciliação bancária e fluxo de caixa executados pela Bear, com regras de aprovação definidas por você e acompanhamento em tempo real na plataforma." },
    intro: {
      h2: "Tire a rotina financeira<br><strong>da mesa do sócio</strong>",
      p: "Pagamento aprovado por mensagem, conciliação feita no fim de semana, saldo projetado que ninguém sabe ao certo. Essa rotina consome quem deveria estar pensando no negócio e abre espaço para erro e fraude.",
      arrows: ["Contas a pagar e a receber com fluxo de aprovação por alçada", "Conciliação bancária integrada aos bancos", "Fluxo de caixa realizado e projetado", "Faturamento, boletos e régua de cobrança"],
      close: "Tudo acompanhado na Plataforma Bear: saldo, entradas, saídas e previsões acessíveis a qualquer momento, com trilha de quem aprovou o quê.",
    },
    method: {
      h2: "Processo desenhado<br><strong>para dar controle</strong>",
      items: [["Alçadas e aprovações", "Cada pagamento passa pela aprovação definida com você, com registro de quem autorizou."], ["Conciliação diária", "Movimentações importadas dos bancos e comparadas aos lançamentos previstos."], ["Fluxo de caixa", "Projeção atualizada a partir de contratos, títulos e sazonalidade do seu negócio."], ["Cobrança organizada", "Régua de cobrança e acompanhamento de inadimplência por cliente."], ["Time dedicado", "Analistas que conhecem a sua operação, com um ponto de contato definido."]],
    },
    quote: "Menos tempo operacional, mais visibilidade: <strong>o repetitivo sai da sua equipe e passa a rodar com automação e conferência humana.</strong>",
    img: "ph-03.svg", img2: "ph-04.svg",
    video: { id: "", title: "BPO Financeiro na prática", sub: "Um mês de operação em poucos minutos" },
    faq: [["Perco o controle do meu financeiro ao terceirizar?", "Não. Você define as alçadas, aprova os pagamentos, acompanha tudo na plataforma e recebe os relatórios. O que sai da sua mesa é a execução repetitiva, não a decisão."], ["Quais bancos e ERPs são integrados?", "Os principais bancos, por integração direta ou Open Finance, e os ERPs mais usados no mercado. Confirmamos a sua combinação de banco e sistema no diagnóstico."], ["Em quanto tempo a operação começa?", "Depende do volume e das integrações. Na proposta definimos um cronograma de onboarding com etapas e responsáveis; a operação começa após a migração dos dados e a validação dos processos com a sua equipe."]],
  },
  {
    slug: "bpo-de-folha-de-pagamento",
    icon: "users",
    name: "BPO de Folha de Pagamento",
    excerpt: "Folha, férias, rescisões, encargos e eSocial processados com automação e conferência humana, para reduzir retrabalho e passivo trabalhista.",
    waText: "Olá! Quero saber mais sobre o BPO de Folha de Pagamento da Bear Finance para a minha empresa.",
    metaTitle: "BPO de folha de pagamento para empresas | Bear Finance",
    metaDescription: "BPO de folha de pagamento: folha, férias, rescisões, encargos, eSocial e FGTS Digital processados com automação e conferência humana. Fale com a Bear Finance.",
    outcomes: ["Folha mensal processada e conferida antes da liberação", "eSocial, FGTS Digital, DCTFWeb e EFD-Reinf no prazo", "Admissões, férias, afastamentos e rescisões conduzidos", "Relatório de encargos e provisões para o planejamento"],
    headline: { h2: "Departamento pessoal<br><strong>sem retrabalho</strong>", p: "Folha de pagamento, encargos e obrigações trabalhistas e previdenciárias processados com validações automáticas, conferência de analista e portal do colaborador." },
    intro: {
      h2: "Folha certa, no prazo,<br><strong>sem surpresas</strong>",
      p: "Erro na folha custa caro duas vezes: na correção e no passivo trabalhista que fica. Processamos a folha com validações antes do envio e cobrimos toda a jornada do colaborador.",
      arrows: ["Folha de pagamento, pró-labore e benefícios", "Admissões, férias, rescisões e afastamentos", "eSocial, FGTS Digital, DCTFWeb e EFD-Reinf", "Portal do colaborador com holerites digitais"],
      close: "Dados dos colaboradores tratados conforme a LGPD, com rotinas revisadas de acordo com a CLT e as convenções coletivas de cada categoria.",
    },
    method: {
      h2: "Rotina mensal<br><strong>com conferência dupla</strong>",
      items: [["Calendário acordado", "Datas de envio de apontamentos e de fechamento definidas com o seu RH."], ["Validações automáticas", "Inconsistências de cadastro, jornada e eventos apontadas antes do processamento."], ["Conferência humana", "Um analista revisa cada folha antes da liberação."], ["Obrigações no prazo", "eSocial e demais entregas monitoradas na plataforma."], ["Provisões e custos", "Relatórios de encargos e provisões para o seu planejamento."]],
    },
    quote: "Menos passivo trabalhista, mais previsibilidade: <strong>folha processada com automação e validada por especialistas.</strong>",
    img: "ph-05.svg", img2: "ph-06.svg",
    video: { id: "", title: "Como processamos a folha", sub: "Do apontamento ao holerite" },
    faq: [["Vocês cuidam de admissões e rescisões?", "Sim, toda a jornada do colaborador: admissão, férias, afastamentos, rescisão e homologações, com os documentos e prazos de cada etapa."], ["Como os colaboradores acessam os holerites?", "Pelo portal do colaborador, com acesso individual, histórico de holerites e informes."], ["Atendem convenções coletivas específicas?", "Sim. Mapeamos a convenção de cada categoria e aplicamos reajustes, pisos e benefícios previstos."]],
  },
  {
    slug: "auditoria-consultoria-tributaria",
    icon: "search-chart",
    name: "Auditoria e Consultoria Tributária",
    excerpt: "Um olhar independente sobre números, controles e tributos: riscos e oportunidades apontados com plano de ação e prazos.",
    waText: "Olá! Quero saber mais sobre Auditoria e Consultoria Tributária da Bear Finance para a minha empresa.",
    metaTitle: "Auditoria e consultoria tributária | Bear Finance",
    metaDescription: "Auditoria contábil, revisão tributária e consultoria para empresas: validação de demonstrações, créditos e riscos com plano de ação. Solicite um diagnóstico.",
    outcomes: ["Relatório de achados classificados por risco e impacto", "Revisão tributária do período não prescrito com créditos e contingências", "Plano de ação com responsáveis e prazos", "Demonstrações e controles preparados para bancos e investidores"],
    headline: { h2: "Segurança para<br><strong>decidir e crescer</strong>", p: "Auditoria contábil, revisão tributária e consultoria para validar números, fortalecer controles e preparar a empresa para bancos, investidores e órgãos reguladores." },
    intro: {
      h2: "Olhar independente<br><strong>sobre o seu negócio</strong>",
      p: "Números sem validação viram risco na hora de captar, vender ou responder a uma fiscalização. Validamos demonstrações, revisamos tributos e apontamos riscos e oportunidades com um plano de ação priorizado.",
      arrows: ["Auditoria contábil e de controles internos", "Revisão tributária e previdenciária do período não prescrito", "Due diligence para M&A, captação e sucessão", "Consultoria em custos, precificação e governança"],
      close: "Entregamos um diagnóstico objetivo, recomendações com responsáveis e prazos, e acompanhamento da implantação.",
    },
    method: {
      h2: "Da análise<br><strong>ao plano de ação</strong>",
      items: [["Planejamento", "Definimos escopo, materialidade e cronograma com você."], ["Execução", "Testes, cruzamentos de bases e entrevistas com as áreas."], ["Relatório", "Achados classificados por risco e impacto, em linguagem que a diretoria entende."], ["Plano de ação", "Recomendações com responsáveis e prazos."], ["Acompanhamento", "Monitoramos a implantação das melhorias e revisamos o que ficou pendente."]],
    },
    quote: "Demonstrações e controles no padrão que o mercado exige: <strong>prontos para bancos, investidores e auditorias externas.</strong>",
    img: "ph-07.svg", img2: "ph-08.svg",
    video: { id: "", title: "Auditoria e consultoria", sub: "O que esperar de um diagnóstico" },
    // [A CONFIRMAR] registro dos auditores (CNAI/CVM) para emissão de parecer formal de auditoria independente
    faq: [["Qual a diferença entre auditoria e revisão tributária?", "A auditoria valida demonstrações e controles; a revisão tributária analisa apurações passadas em busca de créditos não aproveitados e de riscos de autuação."], ["Vocês emitem parecer de auditoria independente?", "Depende do objetivo. Para exigências formais de bancos, investidores ou órgãos reguladores, definimos no diagnóstico o tipo de relatório adequado e quem o emite. Para gestão, entregamos relatórios de revisão com achados e plano de ação."], ["Quanto tempo leva uma due diligence?", "Depende do porte da empresa e da qualidade da informação disponível. No planejamento apresentamos o cronograma por frente (contábil, fiscal, trabalhista e societária)."]],
  },
  {
    slug: "estruturacoes-corporativas",
    icon: "sitemap",
    name: "Estruturações Corporativas",
    excerpt: "Holdings, reorganizações, sucessão e escolha de regime tributário com visão contábil, tributária e societária integrada.",
    waText: "Olá! Quero saber mais sobre Estruturações Corporativas (holding, reorganização, sucessão) da Bear Finance.",
    metaTitle: "Holding e estruturações corporativas | Bear Finance",
    metaDescription: "Holding patrimonial, reorganização societária, sucessão e escolha do regime tributário com análise integrada. Fale com a Bear Finance e simule cenários.",
    outcomes: ["Comparativo de cenários com impacto tributário e sucessório", "Desenho da estrutura societária com governança definida", "Implantação acompanhada: atos, integralizações e registros", "Revisão periódica da estrutura e das obrigações"],
    headline: { h2: "Estrutura certa<br><strong>para proteger e crescer</strong>", p: "Holdings patrimoniais e operacionais, reorganizações societárias, planejamento sucessório e escolha do regime tributário, com os impactos simulados antes de qualquer alteração." },
    intro: {
      h2: "Decisões societárias<br><strong>com segurança</strong>",
      p: "Uma estrutura mal desenhada custa imposto a mais, expõe o patrimônio pessoal ao risco da operação e transforma a sucessão em disputa. Estruturamos a empresa e o patrimônio com visão contábil, tributária e societária integrada, já considerando a Reforma Tributária.",
      arrows: ["Holding patrimonial e familiar", "Cisões, fusões e incorporações", "Planejamento sucessório", "Comparativo Simples × Presumido × Real e simulações de IBS/CBS"],
      close: "Toda tese documentada e fundamentada, com os impactos tributários e os riscos estimados antes de qualquer alteração.",
    },
    method: {
      h2: "Como conduzimos<br><strong>uma reestruturação</strong>",
      items: [["Diagnóstico", "Mapeamos bens, sociedades, regimes e objetivos da família ou do grupo."], ["Cenários", "Simulamos alternativas com impacto tributário, sucessório e de governança."], ["Desenho", "Definimos a estrutura, os acordos entre sócios e as regras de decisão."], ["Implantação", "Alterações contratuais, integralizações e registros, em conjunto com o seu advogado."], ["Manutenção", "Acompanhamos obrigações e revisamos a estrutura quando o negócio ou a legislação muda."]],
    },
    quote: "Patrimônio protegido e sucessão organizada: <strong>separação clara entre bens pessoais e risco operacional.</strong>",
    img: "ph-09.svg", img2: "ph-10.svg",
    video: { id: "", title: "Holding vale a pena?", sub: "Custos, benefícios e pontos de atenção" },
    // [A CONFIRMAR] escritórios de advocacia parceiros para redação dos atos societários
    faq: [["Holding familiar vale a pena para mim?", "Em geral, para famílias com imóveis geradores de renda, participações em empresas ou planos claros de sucessão. Cada caso exige simulação de ITBI, ITCMD e tributação de aluguéis antes de decidir."], ["Vocês fazem a parte jurídica?", "A redação dos atos societários é feita em conjunto com o seu advogado. Nós cuidamos da análise contábil e tributária, das simulações e da implantação da estrutura."], ["Quanto tempo leva?", "Depende da quantidade de bens e sociedades envolvidas e dos registros necessários (Junta Comercial, cartórios e Receita Federal). No diagnóstico apresentamos um cronograma por etapa."]],
  },
];

// ---------------------------------------------------------------------
// Verticais de negócio
// ---------------------------------------------------------------------
const tabsPadrao = [
  ["Assessoria Contábil", ["Escrituração e fechamento mensal", "Demonstrações financeiras e relatórios gerenciais", "Obrigações acessórias federais, estaduais e municipais", "Integração com o ERP da empresa"]],
  ["Assessoria Societária", ["Constituição, alterações e baixas", "Holdings e reorganizações", "Acordos de sócios e governança", "Planejamento sucessório"]],
  ["Consultoria Tributária", ["Diagnóstico de regime e enquadramento", "Recuperação de créditos", "Incentivos e regimes especiais do setor", "Simulações da Reforma Tributária"]],
  ["Auditoria Independente", ["Auditoria de demonstrações", "Revisão de controles internos", "Due diligence", "Relatórios para conselhos e investidores"]],
];

// `partner.p` descreve acompanhamento de entidades e legislação do setor — não há
// parcerias ou homologações formais a divulgar. [A CONFIRMAR] se houver associações.
export const verticals = [
  {
    slug: "contabilidade-industria", icon: "factory", name: "Indústria", short: "Manufatura, transformação e beneficiamento.", img: "ph-01.svg",
    waText: "Olá! Tenho uma indústria e quero saber mais sobre a contabilidade da Bear Finance para o meu setor.",
    metaTitle: "Contabilidade para indústria | Bear Finance",
    metaDescription: "Contabilidade para indústria: créditos de IPI, PIS/COFINS e ICMS, custeio integrado ao ERP, bloco K e incentivos regionais. Solicite um diagnóstico à Bear.",
    headline: "A indústria opera com margens pressionadas e uma das cargas tributárias mais complexas do país. Se custos, créditos e produção não conversam com a contabilidade, a margem real fica invisível.",
    g: ["<strong>Créditos de IPI, PIS/COFINS e ICMS</strong> dependem de controle rigoroso de entradas e saídas.", "Custeio industrial e bloco K exigem integração entre produção, estoque e contabilidade.", "Incentivos regionais e regimes especiais só valem se forem apurados e documentados corretamente."],
    block1: { eyebrow: "No chão de fábrica", h2: "Contabilidade que entende<br><strong>a linha de produção</strong>", p: ["Insumo, estoque em processo, produto acabado: cada etapa tem reflexo fiscal e contábil. Quando isso é tratado só no fim do mês, sobram diferenças de inventário, créditos perdidos e risco de autuação.", "Na Bear, o time que atende indústria conhece créditos, incentivos regionais, drawback e as obrigações do setor, e integra o ERP industrial à rotina contábil."] },
    block2: { eyebrow: "Margem real por produto", h2: "Custo sob controle<br><strong>e crédito aproveitado</strong>", p: ["Competir passa por saber a margem de cada linha considerando tributos, créditos e custos indiretos.", "Entregamos custo e resultado por produto e por planta, com os créditos apurados e documentados, para sustentar decisões de preço e mix."] },
    atuacao: { eyebrow: "Presença em cada etapa", h2: "Atendemos<br><strong>toda a cadeia produtiva</strong>", p: "Empresas de transformação de diferentes portes e cadeias, do fornecedor de insumos ao distribuidor.", items: ["Metalurgia", "Alimentos e bebidas", "Química e plásticos", "Têxtil e confecção", "Móveis", "Embalagens", "Máquinas e equipamentos", "Cosméticos"] },
    partner: { h3: "Atualização<br><strong>setorial constante</strong>", p: "Acompanhamos entidades e a legislação do setor industrial para antecipar mudanças em créditos, incentivos e obrigações que afetam a sua planta." },
    tabs: tabsPadrao,
    faq: [["O que é contabilidade para indústria?", "É a contabilidade que integra custos de produção, estoques, créditos tributários e obrigações específicas (como o bloco K) para dar à indústria margem real por produto e conformidade fiscal."], ["Quais créditos a indústria costuma deixar de aproveitar?", "Créditos de IPI, de PIS/COFINS sobre insumos e de ICMS sobre energia e ativo imobilizado são os mais comuns. Cada um exige documentação e critério de rateio defensáveis."], ["Vocês atendem incentivos regionais?", "Sim. Mapeamos incentivos estaduais e regionais (como SUDAM e SUDENE) aplicáveis à sua planta e cuidamos da apuração e da documentação de suporte."]],
  },
  {
    slug: "contabilidade-agronegocio", icon: "wheat", name: "Agronegócio", short: "Produtores rurais, cooperativas e agroindústrias.", img: "ph-02.svg",
    waText: "Olá! Atuo no agronegócio e quero saber mais sobre a contabilidade da Bear Finance para o meu negócio.",
    metaTitle: "Contabilidade para agronegócio | Bear Finance",
    metaDescription: "Contabilidade rural para produtores, cooperativas e agroindústrias: LCDPR, Funrural, pessoa física ou jurídica, holding rural e sucessão. Fale com a Bear.",
    headline: "No agro, a contabilidade precisa entender safra, LCDPR, Funrural e a decisão entre pessoa física e jurídica. Sem isso, o produtor paga imposto errado e deixa a sucessão para depois.",
    g: ["A escolha entre <strong>pessoa física e jurídica</strong> muda a carga tributária e as obrigações do produtor.", "LCDPR, Funrural e créditos presumidos exigem apuração correta e documentada.", "Sucessão familiar e holding rural pedem planejamento antes da urgência."],
    block1: { eyebrow: "No dia a dia do campo", h2: "Contabilidade que fala<br><strong>a língua do produtor</strong>", p: ["Entre LCDPR, Funrural, notas de produtor e créditos presumidos, o produtor precisa de quem conheça as regras do campo, não só as da cidade.", "Na Bear, o atendimento ao agro cobre produtor pessoa física, pessoa jurídica rural, cooperativas e agroindústrias, com as obrigações de cada um."] },
    block2: { eyebrow: "Da porteira para dentro e para fora", h2: "Estrutura para crescer<br><strong>entre gerações</strong>", p: ["Rentabilidade no agro também passa por questões societárias: sucessão, proteção patrimonial e governança entre os membros da família.", "Simulamos os cenários (pessoa física, pessoa jurídica e holding rural) e estruturamos a propriedade e o negócio para crescer com segurança."] },
    atuacao: { eyebrow: "Presença em cada solo", h2: "Atendemos<br><strong>toda a cadeia produtiva</strong> do agronegócio", p: "Do produtor rural ao distribuidor de insumos, com as particularidades de cada elo.", items: ["Produtor rural", "Revenda de insumos", "Concessionárias de máquinas", "Sementeiras", "Beneficiamento de grãos", "Fertilizantes", "Cooperativas", "Transporte da produção"] },
    partner: { h3: "Atualização<br><strong>setorial constante</strong>", p: "Acompanhamos entidades e a legislação do agronegócio para manter a apuração do produtor e das agroindústrias em dia com as regras do setor." },
    tabs: tabsPadrao,
    faq: [["O que é contabilidade para o agronegócio?", "É o atendimento contábil, fiscal e societário voltado a produtores, revendas, cooperativas e agroindústrias, com as obrigações e os benefícios próprios do setor."], ["Qual a importância do LCDPR?", "O Livro Caixa Digital do Produtor Rural é obrigatório acima de determinada receita e é a base da apuração do IRPF do produtor. Erros nele viram malha fina."], ["Produtor rural deve virar PJ?", "Depende do faturamento, das fontes de receita, das perdas compensáveis e dos planos de sucessão. Simulamos os cenários antes de recomendar."]],
  },
  {
    slug: "contabilidade-saude", icon: "stethoscope", name: "Saúde", short: "Clínicas, consultórios, laboratórios e médicos.", img: "ph-03.svg",
    waText: "Olá! Atuo na área da saúde e quero saber mais sobre a contabilidade da Bear Finance para clínicas e médicos.",
    metaTitle: "Contabilidade para clínicas e médicos | Bear Finance",
    metaDescription: "Contabilidade para clínicas, laboratórios e médicos PJ: regime tributário, equiparação hospitalar, repasses entre sócios e convênios. Fale com a Bear Finance.",
    headline: "Clínicas e profissionais da saúde precisam de regime tributário bem escolhido, repasses organizados e convênios conciliados para cuidar do paciente sem surpresas no caixa.",
    g: ["<strong>Equiparação hospitalar</strong> e a escolha do regime mudam a carga tributária da clínica.", "Repasses entre sócios médicos exigem regras claras e controle transparente.", "Convênios e glosas pedem conciliação detalhada dos recebíveis."],
    block1: { eyebrow: "Dentro da clínica", h2: "Contabilidade que entende<br><strong>a rotina da saúde</strong>", p: ["Do consultório individual ao hospital-dia, cada estrutura tem um enquadramento mais adequado — e requisitos para mantê-lo.", "Acompanhamos a legislação e as decisões sobre equiparação hospitalar e sociedades uniprofissionais para orientar a escolha com segurança."] },
    block2: { eyebrow: "Mais tempo para o paciente", h2: "Organização fiscal<br><strong>e previsibilidade</strong>", p: ["Relatórios por profissional, por procedimento e por convênio, com glosas e recursos acompanhados.", "Planejamento de retiradas e pró-labore com a carga tributária calculada."] },
    atuacao: { eyebrow: "Presença em cada especialidade", h2: "Atendemos<br><strong>toda a cadeia da saúde</strong>", p: "Do profissional pessoa física ao hospital, com as particularidades de cada modelo.", items: ["Médicos PJ", "Clínicas", "Laboratórios", "Odontologia", "Fisioterapia", "Psicologia", "Hospitais-dia", "Home care"] },
    partner: { h3: "Atualização<br><strong>setorial constante</strong>", p: "Acompanhamos entidades e a legislação do setor de saúde para manter o enquadramento e as obrigações da sua clínica atualizados." },
    tabs: tabsPadrao,
    faq: [["Médico deve atender como PJ ou PF?", "Depende do faturamento, das fontes pagadoras e dos planos de expansão. Comparamos a carga tributária e as obrigações de cada modelo antes de recomendar."], ["O que é equiparação hospitalar?", "Benefício que reduz a base de cálculo de IRPJ e CSLL no Lucro Presumido para serviços de natureza hospitalar, mediante requisitos de estrutura e de registro."], ["Vocês conciliam convênios?", "Sim. Conciliamos repasses, glosas e recursos de glosa por convênio e integramos o resultado à contabilidade."]],
  },
  {
    slug: "contabilidade-mercado-imobiliario-e-construcao-civil", icon: "hard-hat", name: "Mercado Imobiliário e Construção Civil", short: "Construtoras, incorporadoras e loteadoras.", img: "ph-04.svg",
    waText: "Olá! Tenho uma incorporadora/construtora e quero saber mais sobre a contabilidade da Bear Finance para o setor.",
    metaTitle: "Contabilidade para incorporadoras e obras | Bear Finance",
    metaDescription: "Contabilidade para incorporadoras, construtoras e loteadoras: RET, SPE por empreendimento, patrimônio de afetação, POC e INSS de obra. Fale com a Bear Finance.",
    headline: "RET, SPE, patrimônio de afetação e controle por obra: incorporadoras e construtoras precisam de transparência em cada empreendimento para sócios, bancos e compradores.",
    g: ["O <strong>Regime Especial de Tributação</strong> pode reduzir a carga da incorporação, desde que os requisitos sejam cumpridos.", "Contabilidade por SPE e por obra dá visibilidade a cada empreendimento.", "Reconhecimento de receita por POC exige controle de custo orçado e incorrido."],
    block1: { eyebrow: "No canteiro e no escritório", h2: "Contabilidade para<br><strong>incorporação e construção</strong>", p: ["Cada empreendimento é um negócio: SPE, RET, CNO, INSS de obra, retenções e distratos. Tratar tudo como uma empresa só esconde o resultado de cada obra.", "Acompanhamos o empreendimento do lançamento à entrega das chaves, com a contabilidade segregada por SPE."] },
    block2: { eyebrow: "Resultado por empreendimento", h2: "Visibilidade<br><strong>obra a obra</strong>", p: ["Custo orçado × incorrido, margem projetada e fluxo de caixa por SPE.", "Relatórios para sócios, investidores e bancos financiadores no formato que eles pedem."] },
    atuacao: { eyebrow: "Presença em cada etapa", h2: "Atendemos<br><strong>toda a cadeia imobiliária</strong>", p: "Da loteadora à administradora de condomínios.", items: ["Incorporadoras", "Construtoras", "Loteadoras", "Imobiliárias", "Administradoras", "Fundos imobiliários", "Empreiteiras", "Arquitetura e engenharia"] },
    partner: { h3: "Atualização<br><strong>setorial constante</strong>", p: "Acompanhamos entidades e a legislação da construção e do mercado imobiliário para antecipar mudanças no RET, nas retenções e nas obrigações de obra." },
    tabs: tabsPadrao,
    faq: [["O que é o RET?", "Regime Especial de Tributação aplicável a incorporações com patrimônio de afetação, com alíquota unificada sobre a receita. Exige opção formal e cumprimento de requisitos por empreendimento."], ["Por que criar uma SPE por obra?", "Para segregar riscos, resultados e financiamentos de cada empreendimento e dar transparência a sócios, bancos e compradores."], ["Como vocês tratam o INSS de obra?", "Cadastramos a obra no CNO, calculamos e acompanhamos as retenções e a regularidade até a averbação."]],
  },
  {
    slug: "contabilidade-transportes-e-logistica", icon: "truck", name: "Transportes e Logística", short: "Transportadoras, operadores logísticos e frotas.", img: "ph-05.svg",
    waText: "Olá! Tenho uma transportadora e quero saber mais sobre a contabilidade da Bear Finance para logística.",
    metaTitle: "Contabilidade para transportadoras | Bear Finance",
    metaDescription: "Contabilidade para transportadoras e operadores logísticos: ICMS interestadual, créditos de combustível, CT-e e custo por rota. Fale com a Bear Finance.",
    headline: "Transportadoras e operadores logísticos lidam com ICMS interestadual, créditos de combustível e custos de frota. Sem contabilidade organizada por rota e por veículo, o frete pode sair no prejuízo.",
    g: ["<strong>ICMS</strong> por estado e regimes especiais pedem apuração cuidadosa.", "Créditos sobre combustível, pneus e manutenção impactam diretamente o resultado.", "Custo por quilômetro e por rota orienta a precificação do frete."],
    block1: { eyebrow: "Na estrada", h2: "Contabilidade que acompanha<br><strong>cada rota</strong>", p: ["CT-e, MDF-e e obrigações diferentes em cada estado exigem rotina organizada e integrada.", "Integramos o TMS à contabilidade para enxergar o custo real de cada operação, não só o total do mês."] },
    block2: { eyebrow: "Frete que dá lucro", h2: "Custo por quilômetro<br><strong>e margem por cliente</strong>", p: ["Relatórios por veículo, rota e cliente, para renegociar tabela com base em números.", "Planejamento de renovação de frota com o impacto tributário calculado."] },
    atuacao: { eyebrow: "Presença em cada modal", h2: "Atendemos<br><strong>toda a cadeia logística</strong>", p: "Do transportador com poucos veículos ao operador logístico com armazéns.", items: ["Transporte rodoviário", "Operadores logísticos", "Armazéns", "Distribuidoras", "Transporte de cargas especiais", "Locação de frota", "Courier", "Agenciamento de cargas"] },
    partner: { h3: "Atualização<br><strong>setorial constante</strong>", p: "Acompanhamos entidades e a legislação do transporte para manter créditos, regimes especiais e obrigações por estado atualizados." },
    tabs: tabsPadrao,
    faq: [["Transportadora pode ficar no Simples?", "Sim, dentro dos limites de faturamento. Em muitos casos, porém, o Lucro Presumido ou o Lucro Real é mais vantajoso por causa dos créditos. Simulamos antes de recomendar."], ["Quais créditos de ICMS a transportadora tem?", "Combustível, lubrificantes, pneus e peças, conforme a legislação de cada estado e o regime adotado."], ["Vocês integram o TMS?", "Sim. Integramos os principais sistemas de gestão de transporte à rotina contábil e financeira."]],
  },
  {
    slug: "contabilidade-varejo-e-distribuicao", icon: "store", name: "Varejo e Distribuição", short: "Lojas físicas, distribuidores e e-commerce.", img: "ph-06.svg",
    waText: "Olá! Atuo no varejo/distribuição e quero saber mais sobre a contabilidade da Bear Finance para o meu negócio.",
    metaTitle: "Contabilidade para varejo e distribuição | Bear Finance",
    metaDescription: "Contabilidade para varejo, distribuidores e e-commerce: ICMS-ST, DIFAL, conciliação de marketplaces, estoque e margem por canal. Fale com a Bear Finance.",
    headline: "Estoque, substituição tributária e margem por canal: varejistas e distribuidores precisam vender mais sem perder dinheiro em imposto, taxa e devolução.",
    g: ["<strong>ICMS-ST e DIFAL</strong> em vendas interestaduais exigem apuração precisa por produto e por estado.", "Marketplaces e meios de pagamento pedem conciliação detalhada de repasses, taxas e devoluções.", "Inventário e custo médio sustentam a precificação e evitam diferenças no fechamento."],
    block1: { eyebrow: "Na loja e no e-commerce", h2: "Contabilidade para<br><strong>vender com margem</strong>", p: ["Cada canal tem taxa, prazo de repasse e tributação diferentes. Sem conciliação, a margem que aparece na planilha não é a que chega ao caixa.", "Conciliamos marketplaces, adquirentes e estoque na plataforma para mostrar a margem real por canal."] },
    block2: { eyebrow: "Preço certo", h2: "Precificação<br><strong>com carga tributária real</strong>", p: ["Simulações de preço considerando ST, DIFAL, comissões e frete.", "Relatórios por categoria, loja e canal para decidir mix e promoções."] },
    atuacao: { eyebrow: "Presença em cada canal", h2: "Atendemos<br><strong>todo o varejo</strong>", p: "Do atacado ao e-commerce.", items: ["Lojas físicas", "E-commerce", "Marketplaces", "Atacado e distribuição", "Franquias", "Farmácias", "Supermercados", "Moda e calçados"] },
    partner: { h3: "Atualização<br><strong>setorial constante</strong>", p: "Acompanhamos entidades e a legislação do comércio e as regras das plataformas de venda para manter a apuração por canal e por estado em dia." },
    tabs: tabsPadrao,
    faq: [["O que é ICMS-ST?", "Substituição tributária: o ICMS de toda a cadeia é recolhido antecipadamente por um contribuinte, geralmente o fabricante ou o distribuidor. Errar o cálculo gera pagamento a mais ou autuação."], ["Vocês conciliam marketplaces?", "Sim. Conciliamos repasses, comissões, fretes e devoluções dos principais marketplaces e adquirentes."], ["Como controlar o estoque para a contabilidade?", "Integramos o ERP ou o PDV à contabilidade e organizamos inventários periódicos com custo médio."]],
  },
  {
    slug: "contabilidade-energia", icon: "bolt", name: "Energia", short: "Geração, distribuição e comercialização.", img: "ph-07.svg",
    waText: "Olá! Atuo no setor de energia e quero saber mais sobre a contabilidade da Bear Finance para o meu negócio.",
    metaTitle: "Contabilidade para o setor de energia | Bear Finance",
    metaDescription: "Contabilidade para geradoras, comercializadoras e usinas solares: incentivos fiscais, contratos de longo prazo e relatórios para investidores. Fale com a Bear.",
    headline: "Geradoras, comercializadoras e usinas solares operam em um ambiente regulado, com incentivos específicos, contratos de longo prazo e obrigações de reporte próprias.",
    g: ["<strong>Incentivos fiscais</strong> para geração renovável exigem apuração e documentação dedicadas.", "Contratos de longo prazo pedem reconhecimento de receita cuidadoso e conciliado.", "A regulação setorial impõe reportes específicos que precisam bater com a contabilidade."],
    block1: { eyebrow: "No setor elétrico", h2: "Contabilidade para<br><strong>um mercado regulado</strong>", p: ["Geração distribuída, autoprodução e mercado livre têm regras tributárias e contábeis próprias.", "Acompanhamos a regulação e os incentivos do setor para manter a apuração e os reportes consistentes."] },
    block2: { eyebrow: "Energia que rende", h2: "Projetos com<br><strong>retorno previsível</strong>", p: ["Modelagem financeira e tributária de usinas e parques, da implantação à operação.", "Relatórios para investidores e financiadores com a abertura que eles exigem."] },
    atuacao: { eyebrow: "Presença em cada fonte", h2: "Atendemos<br><strong>toda a cadeia de energia</strong>", p: "Da usina ao consumidor livre.", items: ["Solar", "Eólica", "Hidrelétrica", "Biomassa", "Comercializadoras", "Geração distribuída", "Eficiência energética", "Consumidores livres"] },
    partner: { h3: "Atualização<br><strong>setorial constante</strong>", p: "Acompanhamos entidades e a legislação do setor de energia para manter incentivos, obrigações regulatórias e apuração atualizados." },
    tabs: tabsPadrao,
    faq: [["Usina solar tem incentivo fiscal?", "Há incentivos federais e estaduais, como tratamento diferenciado de ICMS na energia compensada e regimes especiais. Avaliamos cada caso conforme o modelo de geração."], ["Como reconhecer a receita de contratos de longo prazo?", "Conforme as normas contábeis, com atenção a ajustes, garantias e cláusulas de reajuste. Conciliamos o reconhecimento com o faturamento e os recebimentos."], ["Vocês atendem comercializadoras?", "Sim, incluindo as obrigações junto à CCEE e a conciliação das liquidações."]],
  },
  {
    slug: "contabilidade-servicos", icon: "code", name: "Serviços e Tecnologia", short: "Startups, SaaS, agências e consultorias.", img: "ph-08.svg",
    waText: "Olá! Tenho uma empresa de serviços/tecnologia e quero saber mais sobre a contabilidade da Bear Finance.",
    metaTitle: "Contabilidade para serviços e tecnologia | Bear Finance",
    metaDescription: "Contabilidade para SaaS, startups, agências e consultorias: Fator R, receita recorrente, rodadas de investimento e due diligence. Fale com a Bear Finance.",
    headline: "Empresas de serviços e tecnologia precisam de uma estrutura preparada para escalar: receita recorrente reconhecida corretamente, regime bem escolhido e números prontos para investidores.",
    g: ["<strong>Fator R</strong> e a escolha do regime mudam a carga tributária de empresas de serviços.", "Receita recorrente (SaaS) exige reconhecimento adequado e conciliado com as métricas do negócio.", "Rodadas e due diligence pedem números organizados e auditáveis."],
    block1: { eyebrow: "No digital", h2: "Contabilidade pronta<br><strong>para escalar</strong>", p: ["Da agência à startup em rodada de investimento, cada fase tem necessidades diferentes — e erros de estrutura ficam caros na hora da due diligence.", "Tratamos stock options, vesting, Lei do Bem e exportação de serviços com a documentação que investidores e auditores pedem."] },
    block2: { eyebrow: "Crescimento com base", h2: "Métricas e números<br><strong>que fecham entre si</strong>", p: ["MRR, churn e CAC conciliados com a contabilidade, não calculados à parte.", "Relatórios mensais no padrão que fundos e bancos exigem."] },
    atuacao: { eyebrow: "Presença em cada modelo", h2: "Atendemos<br><strong>toda a economia de serviços</strong>", p: "De consultorias a plataformas SaaS.", items: ["SaaS", "Agências", "Consultorias", "Software house", "Educação", "Marketing", "Engenharia", "Startups"] },
    partner: { h3: "Atualização<br><strong>setorial constante</strong>", p: "Acompanhamos entidades e a legislação de serviços e tecnologia para manter incentivos, regime e obrigações da sua empresa atualizados." },
    tabs: tabsPadrao,
    faq: [["O que é Fator R?", "Regra do Simples Nacional que define a tabela de tributação de serviços conforme a proporção entre folha de pagamento e receita bruta. Pequenas mudanças na folha podem alterar a alíquota."], ["Vocês ajudam em rodadas de investimento?", "Sim. Organizamos a contabilidade e o data room para a due diligence e apoiamos a estruturação societária com o seu advogado."], ["Exportação de serviços é isenta?", "Há isenções de PIS/COFINS e de ISS em muitos casos, com requisitos de contrato e de ingresso de divisas. Avaliamos a operação antes de aplicar."]],
  },
];

// [A CONFIRMAR] lista de ERPs efetivamente integrados à Plataforma Bear
export const erps = ["TOTVS Protheus", "SAP Business One", "Omie", "Conta Azul", "Bling", "Sankhya", "Senior", "Oracle NetSuite", "Tiny", "Domínio", "TOTVS Winthor", "Plataforma Bear"];

// Presença nacional — `facts` só com capacidades verificáveis (sem números de clientes)
export const presence = {
  eyebrow: "Presença nacional",
  h2: "Sede em São Paulo,<br><strong>operação em todo o Brasil</strong>",
  p: "Com sede em <strong>São Paulo</strong> e operação digital, atendemos empresas em <strong><span class='text-lilas'>todos os estados brasileiros</span></strong> com a mesma rotina: plataforma, integrações e um time que conhece o seu setor.",
  facts: [
    { value: "SP", label: "sede em São Paulo" },
    { value: "27", label: "estados e DF com atendimento digital" },
    { value: "100%", label: "operação digital e integrada" },
    { value: "1", label: "time dedicado por cliente" },
  ],
  offices: [["São Paulo – SP", "Rua Riachuelo, 231 – 4º andar, Sé, 01007-000", "(11) 98314-8774"], ["Atendimento digital", "Clientes em todo o Brasil pela Plataforma Bear", ""]],
};

// FAQ da home: perguntas que empresários pesquisam antes de contratar
export const faq = [
  ["Quanto custa a contabilidade da Bear Finance?", "O investimento depende do regime tributário, do volume de notas e lançamentos, do número de colaboradores, da quantidade de empresas do grupo e dos serviços contratados (contabilidade, BPO financeiro, folha, consultoria). Após o diagnóstico, você recebe uma proposta com escopo e valor fechados, sem taxa escondida."],
  ["Como funciona a troca de contador?", "Você não precisa esperar o fim do ano. Solicitamos a documentação ao escritório anterior, revisamos a escrituração, apontamos pendências e assumimos as rotinas com um cronograma acordado. Suas obrigações continuam sendo entregues durante a transição."],
  ["Vocês atendem empresas no Lucro Real e grupos com várias empresas?", "Sim. Atendemos Simples Nacional, Lucro Presumido e Lucro Real, inclusive grupos econômicos, holdings e empresas com filiais em mais de um estado. O escopo e o time acompanham a complexidade da operação."],
  ["Como fica a minha empresa com a Reforma Tributária?", "A substituição de PIS, COFINS, ICMS, ISS e parte do IPI por IBS e CBS muda preço, créditos e contratos. Simulamos a carga da sua empresa nos dois modelos durante a transição, revisamos contratos de longo prazo e preparamos o ERP com você."],
  ["Preciso trocar meu ERP para trabalhar com a Bear?", "Não. A Plataforma Bear integra os principais ERPs e bancos do mercado. Se a sua empresa não tem sistema, a própria plataforma organiza a rotina financeira e contábil."],
  ["Minha empresa fica em outro estado. O atendimento funciona?", "Sim. A operação é digital: documentos, aprovações e relatórios passam pela plataforma, e as reuniões acontecem por vídeo. Conhecemos as obrigações estaduais e municipais de onde a sua empresa atua."],
  ["Como a Bear protege os dados da minha empresa?", "Tratamos dados conforme a LGPD, com controle de acesso por perfil, dados protegidos, registro das ações na plataforma e acordos de confidencialidade com todo o time."],
];

// Blog
export const blogTabs = ["Blog", "Reforma Tributária", "Materiais ricos", "Webinar e podcasts", "Eventos"];
export const posts = [
  { slug: "reforma-tributaria-ibs-cbs-o-que-muda", cat: "Reforma Tributária", date: "2026-09-28", img: "ph-09.svg", title: "Reforma Tributária: o que muda com IBS e CBS para a sua empresa", excerpt: "Transição, créditos e impacto no preço: o que o empresário precisa preparar antes da virada para IBS e CBS.",
    body: [["p", "A substituição de PIS, COFINS, ICMS, ISS e parte do IPI por IBS e CBS altera a forma como as empresas calculam preço, aproveitam créditos e se relacionam com fornecedores e clientes."], ["h2", "Período de transição"], ["p", "Os novos tributos convivem com os atuais durante alguns anos. Isso exige sistemas preparados para apurar os dois modelos ao mesmo tempo e uma leitura clara de qual regime pesa mais em cada operação."], ["h2", "O que muda na prática"], ["p", "Com o crédito amplo e a cobrança no destino, o imposto embutido no preço do fornecedor passa a importar mais do que o estado de origem. Contratos de longo prazo com preço fechado, benefícios estaduais de ICMS e cadeias com muitos elos são os pontos que mais exigem revisão."], ["h2", "Por onde começar"], ["ul", ["Mapeie a carga tributária atual por produto ou serviço", "Revise contratos de longo prazo e cláusulas de reajuste", "Converse com o fornecedor do seu ERP sobre o cronograma de adaptação", "Simule cenários com o seu contador antes de alterar preços"]], ["p", "Na Bear, a simulação faz parte do diagnóstico: comparamos a carga da sua empresa nos dois modelos e indicamos o que precisa mudar em contratos, sistemas e estrutura."]] },
  { slug: "bpo-financeiro-quando-terceirizar", cat: "Gestão financeira", date: "2026-09-10", img: "ph-10.svg", title: "BPO financeiro: 5 sinais de que é hora de terceirizar o seu financeiro", excerpt: "Fechamento atrasado, pagamentos aprovados por mensagem e caixa sem projeção: veja quando terceirizar o financeiro faz sentido e o que continua com você.",
    body: [["p", "Terceirizar o financeiro não é abrir mão do controle. É ganhar processo, tecnologia e tempo para decidir, mantendo as aprovações com quem manda na empresa."], ["h2", "Os sinais mais comuns"], ["ul", ["O fechamento do mês atrasa", "Ninguém sabe o saldo projetado para os próximos 30 dias", "Pagamentos são aprovados por mensagem, sem registro", "O sócio faz conciliação no fim de semana", "Os relatórios não batem com o extrato"]], ["h2", "O que continua com você"], ["p", "Definição de alçadas, aprovação de pagamentos, negociação com fornecedores e decisões de investimento. O BPO executa dentro das regras que você define e mostra tudo na plataforma."], ["h2", "O que sai da sua mesa"], ["p", "Lançamentos, conciliação, emissão de boletos, régua de cobrança, agendamento de pagamentos e a preparação dos relatórios. É trabalho repetitivo que exige rotina, não cargo de sócio."]] },
  { slug: "holding-familiar-vale-a-pena", cat: "Societário", date: "2026-08-22", img: "ph-11.svg", title: "Holding familiar vale a pena? Custos, benefícios e quando não faz sentido", excerpt: "Proteção patrimonial e sucessão mais simples — mas com custos de constituição e pontos de atenção que precisam ser simulados antes de decidir.",
    body: [["p", "A holding familiar concentra bens em uma pessoa jurídica controlada pela família, facilitando a gestão, a sucessão e a separação entre patrimônio pessoal e risco operacional."], ["h2", "Quando faz sentido"], ["p", "Em geral, para famílias com imóveis geradores de renda, participações em empresas ou planos claros de sucessão. Cada caso exige simulação de ITBI, ITCMD e tributação de aluguéis."], ["h2", "Quando não faz sentido"], ["p", "Quando o patrimônio é pequeno, os bens não geram renda ou a família não pretende organizar a sucessão agora. Nesses casos, o custo de constituição e manutenção pode superar o benefício."], ["h2", "Custos a considerar"], ["ul", ["Constituição, registros e eventual ITBI na integralização de imóveis", "Contabilidade e obrigações da nova pessoa jurídica", "Acordo de sócios e regras de governança entre os familiares", "Revisão periódica da estrutura quando a legislação muda"]]] },
  { slug: "contabilidade-para-medicos-pj-ou-pf", cat: "Contabilidade", date: "2026-08-05", img: "ph-12.svg", title: "Médico: PJ ou pessoa física? Como comparar a carga tributária", excerpt: "Faturamento, fontes pagadoras e equiparação hospitalar: os critérios para decidir entre atender como pessoa física ou jurídica.",
    body: [["p", "A escolha entre pessoa física e jurídica muda a carga tributária e as obrigações de profissionais da saúde. Não existe resposta única: depende de como e para quem você atende."], ["h2", "Pontos a considerar"], ["ul", ["Volume de faturamento anual", "Fontes pagadoras (convênios, hospitais, particulares)", "Possibilidade de equiparação hospitalar", "Planos de expansão para clínica com outros profissionais"]], ["h2", "Sociedade uniprofissional e regime"], ["p", "Em alguns municípios, sociedades formadas só por profissionais da mesma área recolhem ISS por valor fixo, o que muda a conta. O regime federal (Simples, Presumido ou Real) também precisa ser comparado com a folha e as despesas reais."], ["h2", "Como decidir"], ["p", "Simule os dois cenários com números reais do último ano, incluindo pró-labore, INSS, despesas dedutíveis e custo contábil. A decisão precisa ser revisada quando o faturamento ou a estrutura mudam."]] },
  { slug: "conciliacao-bancaria-automatizada", cat: "Tecnologia", date: "2026-07-18", img: "ph-05.svg", title: "Conciliação bancária automatizada: como funciona e o que muda no fechamento", excerpt: "Integração com bancos, regras de correspondência e revisão humana: como a conciliação automatizada reduz o tempo de fechamento e os erros de lançamento.",
    body: [["p", "Com integração direta aos bancos, cada movimentação é importada e comparada aos lançamentos previstos automaticamente, por valor, data, favorecido e histórico."], ["h2", "O papel do especialista"], ["p", "A automação resolve a maior parte dos casos. O time da Bear revisa as exceções, trata divergências e mantém as regras de correspondência atualizadas conforme a operação muda."], ["h2", "O que muda no fechamento"], ["p", "Sem conciliação manual, o fechamento deixa de depender de planilha e de memória. Diferenças aparecem no dia em que surgem, não no fim do mês, e a DRE passa a refletir o extrato."], ["h2", "O que a empresa precisa fazer"], ["ul", ["Autorizar a integração das contas bancárias", "Definir quem aprova lançamentos fora do padrão", "Manter o cadastro de fornecedores e clientes atualizado no ERP"]]] },
  { slug: "incentivos-sudam-sudene", cat: "Reforma Tributária", date: "2026-07-01", img: "ph-07.svg", title: "Incentivos regionais (SUDAM e SUDENE): quem tem direito e como reduzir o IRPJ", excerpt: "Como funcionam os incentivos de desenvolvimento regional, quais empresas se enquadram e o que muda com a Reforma Tributária.",
    body: [["p", "Empresas instaladas em determinadas regiões podem obter redução relevante do IRPJ mediante projeto aprovado pelo órgão de desenvolvimento regional."], ["h2", "Requisitos"], ["ul", ["Localização do empreendimento na área de abrangência", "Setor considerado prioritário", "Projeto de implantação, modernização ou ampliação", "Regularidade fiscal"]], ["h2", "Erros comuns"], ["p", "Pedir o benefício sem laudo adequado, misturar receitas incentivadas e não incentivadas na apuração e esquecer de constituir a reserva de incentivos são as falhas que mais geram glosa."], ["h2", "O que muda com a Reforma"], ["p", "A reforma do consumo (IBS e CBS) não altera diretamente os incentivos de IRPJ, mas muda a conta dos benefícios estaduais de ICMS. Vale revisar o conjunto de incentivos da empresa antes de decidir novos investimentos."]] },
];

// Sobre
export const about = {
  headline: "Contabilidade consultiva<br>com <strong>tecnologia própria</strong><br>e <strong>gente que conhece o seu setor</strong>",
  // `facts` substitui `numbers`: só capacidades verificáveis
  facts: [
    { value: "SP", label: "sede em São Paulo e atendimento digital em todo o Brasil" },
    { value: "IA", label: "plataforma própria com inteligência artificial" },
    { value: "DMC", label: "parte do ecossistema empresarial Complexo DMC" },
  ],
  h2: "Quem é<br><strong>a Bear Finance</strong>",
  p: [
    "A Bear Finance é uma empresa de contabilidade consultiva com sede em São Paulo e operação digital em todo o Brasil. Atendemos empresas que precisam de mais do que obrigações em dia: precisam de números confiáveis para decidir.",
    "Unimos contabilidade, BPO financeiro, BPO de folha, auditoria e consultoria tributária e estruturações corporativas a uma plataforma própria com inteligência artificial, que concilia, classifica e monitora a informação financeira integrada a bancos e ERPs.",
    "Fazemos parte do ecossistema empresarial Complexo DMC, o que nos conecta a outras competências de gestão e amplia o que conseguimos resolver para cada cliente.",
  ],
  img: "ph-01.svg",
  // [A CONFIRMAR] nomes, cargos, fotos, e-mails e biografias dos sócios
  team: [["Sócio(a) — nome a confirmar", "Contabilidade", "Formação, experiência e área de atuação a confirmar com a Bear."], ["Sócio(a) — nome a confirmar", "BPO Financeiro", "Formação, experiência e área de atuação a confirmar com a Bear."], ["Sócio(a) — nome a confirmar", "Consultoria Tributária", "Formação, experiência e área de atuação a confirmar com a Bear."], ["Sócio(a) — nome a confirmar", "Tecnologia e Plataforma", "Formação, experiência e área de atuação a confirmar com a Bear."], ["Sócio(a) — nome a confirmar", "Departamento Pessoal", "Formação, experiência e área de atuação a confirmar com a Bear."], ["Sócio(a) — nome a confirmar", "Comercial e Expansão", "Formação, experiência e área de atuação a confirmar com a Bear."]],
  values: [["handshake", "Proximidade", "Cada cliente tem um contador responsável e um time que conhece o negócio pelo nome."], ["shield", "Ética", "Dizemos o que os números mostram, inclusive quando a notícia não é boa."], ["lightbulb", "Inovação", "Tecnologia própria para tirar o repetitivo do caminho e deixar o julgamento para pessoas."], ["trophy", "Resultado", "Entregas no prazo, revisadas e explicadas, medidas pelo que mudou na empresa do cliente."]],
};

// Carreira
export const career = {
  headline: "Gente que gosta de <strong>resolver</strong>,<br>aprender e <strong>crescer junto</strong>",
  sub: "Contabilidade consultiva, tecnologia própria e clientes de setores diferentes: se isso soa como desafio, este é o lugar",
  culture: [["Entregamos no ", "prazo", " e explicamos o resultado."], ["Revisamos antes de ", "enviar", ", não depois de errar."], ["", "Erramos", " às vezes; corrigimos rápido e registramos o aprendizado."], ["Automatizamos o ", "repetitivo", " para ter tempo para o que exige julgamento."], ["Estudamos ", "legislação", " e setor toda semana."], ["Falamos ", "claro", " com o cliente e entre nós."], ["Este é um negócio sobre ", "pessoas", " e confiança."], ["Tratamos os dados do cliente com ", "cuidado", " e sigilo."], ["Respeitamos a ", "diversidade", " de quem está aqui e de quem atendemos."]],
  areas: ["Contabilidade", "BPO Financeiro", "Departamento Pessoal", "Tecnologia", "Marketing", "Comercial"],
  // [A CONFIRMAR] vagas reais — enquanto o array estiver vazio, o build mostra o banco de talentos
  jobs: [],
  diversity: ["A Bear é para quem se identifica com o jeito de trabalhar descrito acima, independentemente de origem, gênero, raça, idade, religião ou deficiência.", "Atendemos clientes de setores e regiões muito diferentes. Um time diverso entende melhor essa variedade e toma decisões melhores.", "Mantemos um ambiente de respeito, com canal aberto para relatar qualquer situação que fuja disso."],
  people: [["Trabalhe com o time de Contabilidade", "ph-05.svg"], ["Trabalhe com o time de Gente e Gestão", "ph-06.svg"], ["Trabalhe com a Consultoria Tributária", "ph-07.svg"], ["Trabalhe com o time Comercial", "ph-08.svg"]],
  // [A CONFIRMAR] existência de programa formal de estágio ou trainee e seus critérios
  talents: ["Quem entra em início de carreira trabalha em casos reais desde o começo, com revisão e acompanhamento de um profissional sênior.", "Estagiários e assistentes seguem uma trilha de formação em contabilidade, tributos e na nossa plataforma, com a possibilidade de efetivação conforme o desempenho e as vagas abertas.", "Se você ainda não encontrou uma vaga, cadastre-se no banco de talentos: entramos em contato quando surgir uma posição compatível com o seu perfil."],
};

// Cenários de atuação (antigo "Cases de sucesso") — exemplos de situações típicas,
// sem clientes nomeados e sem resultados numéricos.
export const cases = {
  intro: {
    eyebrow: "Cenários de atuação",
    h2: "Situações que <strong>atendemos todos os dias</strong>",
    p: "Os cenários abaixo são exemplos de situações típicas que a Bear atende, descritos sem identificar clientes e sem resultados numéricos. Eles mostram o tipo de problema que resolvemos e o que entregamos em cada caso.",
  },
  items: [
    { segment: "Indústria", title: "Indústria com créditos tributários parados", img: "ph-01.svg", challenge: "Indústria de transformação no Lucro Real, com estoque e produção no ERP e contabilidade feita à parte. Créditos de PIS/COFINS e ICMS sobre insumos apurados parcialmente e inventário que não fecha com o contábil.", approach: "Integração do ERP à rotina contábil, revisão dos créditos do período não prescrito e implantação de custeio por produto com conferência mensal.", deliverables: ["Mapa de créditos por insumo com documentação de suporte", "Custo e margem por linha de produto no fechamento mensal", "Rotina de inventário conciliada com o contábil"] },
    { segment: "Saúde", title: "Clínica com vários sócios e convênios", img: "ph-03.svg", challenge: "Clínica com médicos sócios, convênios com glosas recorrentes e dúvida sobre equiparação hospitalar e regime tributário.", approach: "Análise dos requisitos para equiparação hospitalar, comparativo de regimes, conciliação por convênio e regras claras de repasse e pró-labore.", deliverables: ["Parecer sobre enquadramento e regime tributário", "Conciliação mensal por convênio com controle de glosas", "Relatório de resultado por profissional e por procedimento"] },
    { segment: "Varejo e Distribuição", title: "Distribuidora vendendo em vários canais e estados", img: "ph-06.svg", challenge: "Vendas por loja, e-commerce e marketplaces em vários estados, com ICMS-ST e DIFAL calculados manualmente e repasses das plataformas sem conciliação.", approach: "Parametrização fiscal por produto e UF, conciliação automatizada de adquirentes e marketplaces na plataforma e fechamento com margem por canal.", deliverables: ["Apuração de ICMS-ST e DIFAL por operação", "Conciliação de marketplaces e adquirentes com devoluções e comissões", "DRE gerencial por canal de venda"] },
    { segment: "Serviços e Tecnologia", title: "SaaS se preparando para uma rodada de investimento", img: "ph-08.svg", challenge: "Startup com receita recorrente, stock options e investidores pedindo números auditáveis; a contabilidade anterior tratava tudo como receita de serviço simples.", approach: "Reconhecimento de receita adequado, conciliação do MRR com o contábil, organização societária e preparação do data room para a due diligence.", deliverables: ["Demonstrações mensais no padrão exigido por investidores", "Métricas (MRR, churn, CAC) conciliadas com a contabilidade", "Data room contábil, fiscal e societário organizado"] },
    { segment: "Agronegócio", title: "Produtor rural e a sucessão entre gerações", img: "ph-02.svg", challenge: "Produtor pessoa física com várias propriedades, filhos na operação e dúvida entre manter a PF, abrir PJ ou constituir uma holding rural.", approach: "Simulação tributária dos cenários (PF, PJ e holding), organização do LCDPR e desenho da estrutura societária e sucessória em conjunto com o advogado da família.", deliverables: ["Comparativo tributário e sucessório por cenário", "LCDPR e apuração do produtor em dia", "Estrutura societária desenhada e implantada por etapas"] },
    { segment: "Mercado Imobiliário e Construção Civil", title: "Incorporadora com obras simultâneas", img: "ph-04.svg", challenge: "Incorporadora com várias SPEs, RET aplicado de forma desigual, custo orçado × incorrido desatualizado e bancos pedindo relatórios por empreendimento.", approach: "Contabilidade por SPE, revisão do RET e do patrimônio de afetação, reconhecimento de receita por POC e relatórios padronizados por obra.", deliverables: ["Fechamento mensal por SPE com RET revisado", "Custo orçado × incorrido e margem projetada por obra", "Relatórios para sócios e bancos financiadores"] },
  ],
};

// ESG — linguagem de compromisso só para práticas plausíveis de um escritório digital.
// [A CONFIRMAR] programas formais: compensação de emissões, coletivos de diversidade,
// canal de denúncias, auditoria interna e publicação de relatório ESG.
export const esg = {
  headline: "Cultura baseada em<br>princípios de <strong>ESG</strong>",
  pillars: [["leaf", "Ambiental", "Operação digital, documentos eletrônicos e menos deslocamentos: a rotina contábil roda com o mínimo de papel e de viagens."], ["people", "Social", "Formação de profissionais em início de carreira e um ambiente de respeito à diversidade, dentro do time e no atendimento aos clientes."], ["scale", "Governança", "Código de conduta, segregação de funções, controle de acesso aos dados dos clientes e revisão em duas camadas em cada entrega."]],
  p: ["Acreditamos que uma empresa de contabilidade tem papel direto na governança dos seus clientes, e que isso começa em casa: nos nossos controles, no tratamento dos dados e na forma como tomamos decisões.", "Revisamos nossas práticas periodicamente e compartilhamos com clientes e colaboradores o que mudou e o que ainda está em construção."],
};

// Plataforma (ocupa o lugar de "Partnership" no modelo)
export const platform = {
  headline: "Gestão financeira com<br><strong>inteligência artificial</strong>",
  p: "A plataforma própria da Bear concilia, classifica e organiza a informação financeira da sua empresa, integrada a bancos e ERPs, com dashboards e alertas para você decidir com dados atualizados.",
  features: [["chart-bar", "Relatórios atualizados", "DRE, fluxo de caixa e indicadores gerados a partir dos lançamentos conciliados."], ["bank", "Integração bancária", "Extratos importados automaticamente e conciliados com os lançamentos previstos."], ["users-gear", "Folha integrada", "Folha, férias e encargos refletidos na contabilidade e nas provisões."], ["gauge", "Dashboard financeiro", "Receitas, despesas, caixa projetado e indicadores em painéis atualizados."], ["cpu", "IA integrada", "Classificação de lançamentos, sugestão de conciliação e alertas de inconsistência e de compliance."], ["lock", "Segurança e LGPD", "Controle de acesso por perfil, dados protegidos e registro das ações realizadas."]],
  steps: [["Diagnóstico", "Entendemos sua operação, regime, sistemas e dores em uma conversa sem custo."], ["Proposta sob medida", "Escopo, prazos e investimento conforme o porte e a complexidade."], ["Onboarding", "Migração de dados, integração com bancos e ERP e definição de rotinas e alçadas."], ["Gestão contínua", "Entregas mensais, dashboards atualizados e reuniões de resultado."]],
};

export const erpOptions = ["TOTVS Protheus", "TOTVS Winthor", "SAP Business One", "Omie", "Conta Azul", "Bling", "Sankhya", "Senior", "Outros", "Não temos um ERP"];
export const revenueOptions = ["Até R$ 500 mil", "R$ 500 mil até R$ 1 milhão", "R$ 1 milhão até R$ 4,8 milhões", "R$ 4,8 milhões até R$ 10 milhões", "R$ 10 milhões até R$ 25 milhões", "R$ 25 milhões até R$ 78 milhões", "Acima de R$ 78 milhões", "Sem movimentação"];

// ---------------------------------------------------------------------
// Parcerias
//   • Business Partner Outsourcing (BPO) → contador parceiro
//   • Business Partner (BP)              → agente prospector de negócios
// Os formulários das duas páginas abrem uma conversa no WhatsApp abaixo.
// ---------------------------------------------------------------------
export const partnerWhatsapp = { number: "5511915267749", display: "(11) 91526-7749" };

// `partnerFacts` substitui os antigos `partnerNumbers` (inventados): só capacidades.
// [A CONFIRMAR] modelo contratual de proteção de carteira, percentuais de remuneração e custo de adesão.
export const partnerFacts = [
  { value: "IA", label: "plataforma própria para a sua carteira" },
  { value: "2", label: "camadas de revisão técnica em cada entrega" },
  { value: "8", label: "verticais com especialistas" },
  { value: "100%", label: "da carteira protegida em contrato" },
];
const partnerFactsBP = [
  { value: "IA", label: "plataforma própria por trás de cada entrega" },
  { value: "5", label: "serviços para oferecer às empresas da sua rede" },
  { value: "8", label: "verticais com especialistas" },
  { value: "2", label: "formas de atuar: só indicar ou prospectar ativamente" },
];

export const partnerHub = {
  h2: "Dois programas.<br>Um mesmo <strong>propósito</strong>: crescer junto.",
  p: "A Bear abre a sua estrutura, a sua tecnologia e o seu time para quem quer ir mais longe. Escolha o programa que combina com o seu perfil.",
  video: { id: "", title: "Programas de parceria Bear", sub: "BPO e Business Partner em poucos minutos" },
  compare: [
    ["Para quem é", "Escritórios de contabilidade e contadores com carteira ativa", "Profissionais com rede de relacionamento com empresários"],
    ["O que você faz", "Atende seus clientes com a estrutura, os serviços e a plataforma da Bear", "Indica ou prospecta empresas; o time Bear conduz a venda e a entrega"],
    ["Como ganha", "Participação recorrente sobre os serviços contratados pela sua carteira", "Comissão por contrato fechado e recorrência enquanto o cliente permanecer"],
    ["Pré-requisito", "Registro ativo no CRC", "Nenhum registro profissional específico"],
    ["Apoio da Bear", "Plataforma, revisão técnica, especialistas por vertical e ERP", "Materiais, roteiros, apoio na proposta e acompanhamento das indicações"],
  ],
  faq: [
    ["Qual a diferença entre Business Partner Outsourcing e Business Partner?", "No Business Partner Outsourcing (BPO), o contador mantém a própria carteira e passa a atendê-la com a estrutura e a plataforma da Bear. No Business Partner, o profissional indica ou prospecta empresas e é remunerado pelos contratos fechados."],
    ["Posso participar dos dois programas?", "Sim. Um escritório contábil pode ser BPO para a própria carteira e também indicar empresas que não atende, como Business Partner."],
    ["Como é o primeiro contato?", "Você preenche o formulário do programa e segue direto para uma conversa no WhatsApp com o nosso time de parcerias."],
  ],
};

export const partnerPrograms = [
  {
    key: "bpo",
    slug: "business-partner-outsourcing",
    icon: "calculator",
    tag: "Para contadores",
    name: "Business Partner Outsourcing",
    short: "Contador Parceiro",
    lead: "Para escritórios de contabilidade que querem oferecer mais serviços, ganhar escala e modernizar a operação sem perder o relacionamento com seus clientes.",
    headline: { h2: "Sua carteira com a<br><strong>estrutura e a tecnologia</strong><br>da Bear", p: "Você continua sendo o contador de confiança dos seus clientes. A Bear entra com plataforma, backoffice e especialistas para você atender mais empresas, com mais serviços e menos retrabalho." },
    facts: partnerFacts,
    about: "<strong>Escale o seu escritório</strong> sem aumentar<br>a estrutura com o <strong>Business Partner Outsourcing</strong>",
    diagram: {
      h3: "Você cuida do <strong>cliente</strong>.<br>Nós cuidamos do <strong>backoffice</strong>.",
      h6: "Seu escritório passa a contar com as mesmas áreas de apoio que sustentam a operação da Bear.",
      left: [["Financeiro", "BPO financeiro para a sua carteira"], ["Departamento pessoal", "Folha, eSocial e rotinas trabalhistas"], ["Revisão técnica", "Conferência de fechamentos e apurações"]],
      right: [["Tributário", "Planejamento, créditos e Reforma Tributária"], ["Tecnologia", "Plataforma Bear, dashboards e integração com ERPs"], ["Capacitação", "Treinamento técnico do seu time"]],
      bottom: ["Especialistas por vertical", "Apoio em clientes de setores complexos"],
    },
    call: "<strong>Backoffice, tecnologia e especialistas</strong><br>para o seu escritório crescer com margem",
    how: ["Ofereça BPO financeiro, folha, auditoria e planejamento tributário com a estrutura Bear", "Use a Plataforma Bear com a sua carteira, com dashboards e automação", "Compartilhe a operação de clientes complexos (Lucro Real, grupos econômicos)", "Receba participação recorrente sobre os serviços contratados"],
    who: ["Escritórios contábeis de qualquer porte", "Contadores com carteira ativa", "Registro ativo no CRC"],
    benefits: {
      h2: "Especialistas<br><strong>ao lado do seu escritório</strong>",
      p: "Mais serviços no seu portfólio, menos retrabalho na operação e uma plataforma própria que o seu escritório não precisaria desenvolver sozinho.",
      items: ["<strong>Portfólio ampliado</strong>: BPO financeiro, folha, auditoria e consultoria tributária com a sua marca à frente.", "<strong>Plataforma Bear</strong> para a sua carteira, com conciliação automática e dashboards.", "<strong>Revisão técnica</strong> de fechamentos e apurações por especialistas.", "<strong>Carteira protegida</strong> em contrato: o cliente continua sendo seu."],
    },
    steps: [["Cadastro", "Preencha o formulário e fale conosco pelo WhatsApp."], ["Diagnóstico", "Entendemos sua carteira, equipe, sistemas e desafios."], ["Modelo de parceria", "Definimos serviços, responsabilidades e remuneração."], ["Contrato", "Regras e proteção da carteira formalizadas."], ["Onboarding", "Treinamento, acesso à plataforma e integração de dados."], ["Crescimento", "Metas, acompanhamento e novos serviços para a carteira."]],
    cta: "Leve o seu escritório para o próximo nível. <strong>Fale agora com o time de parcerias</strong> pelo WhatsApp.",
    faq: [
      ["O que é o Business Partner Outsourcing?", "É o programa da Bear para contadores e escritórios contábeis. Você mantém sua carteira e passa a atendê-la com a estrutura, os serviços e a plataforma da Bear."],
      ["Vou perder meus clientes para a Bear?", "Não. O contrato de parceria protege o relacionamento do escritório com os clientes e define claramente o papel de cada parte."],
      ["Quais serviços posso oferecer?", "BPO financeiro, BPO de folha de pagamento, auditoria e consultoria tributária, estruturações corporativas e a Plataforma Bear."],
      ["Como funciona a remuneração?", "O escritório recebe participação recorrente sobre os serviços contratados pela sua carteira. Os percentuais são definidos em contrato conforme o modelo escolhido."],
      ["Há custo para entrar?", "As condições são apresentadas na conversa inicial, de acordo com o porte do escritório e os serviços escolhidos."],
    ],
    img: "ph-04.svg",
    video: { id: "", title: "Business Partner Outsourcing", sub: "Como funciona para escritórios contábeis" },
    form: {
      title: "Quero ser <strong>Business Partner Outsourcing</strong>",
      step2: "Sobre o seu escritório",
      fields: [
        { name: "escritorio", label: "Nome do escritório", type: "text", required: true },
        { name: "carteira", label: "Clientes na carteira", type: "select", required: true, options: ["Até 30", "31 a 100", "101 a 300", "Mais de 300"] },
        { name: "regimes", label: "Regimes que você mais atende", type: "chips", options: ["Simples Nacional", "Lucro Presumido", "Lucro Real", "Terceiro setor"] },
        { name: "desafio", label: "Maior desafio hoje", type: "select", required: true, options: ["Absorver o backoffice", "Expandir a carteira", "Tecnologia e automação", "Equipe e capacitação", "Gestão financeira do escritório", "Outro"] },
      ],
    },
  },
  {
    key: "bp",
    slug: "business-partner",
    icon: "handshake",
    tag: "Para prospectores",
    name: "Business Partner",
    short: "Agente Prospector de Negócios",
    lead: "Para profissionais com bom relacionamento empresarial que querem indicar e prospectar clientes para a Bear e ser remunerados por isso.",
    headline: { h2: "Transforme o seu<br><strong>relacionamento</strong><br>em <strong>renda recorrente</strong>", p: "Você conecta empresários à Bear. Nosso time conduz a proposta, a venda e a entrega, e você é remunerado por cada contrato fechado." },
    facts: partnerFactsBP,
    about: "<strong>Indique, prospecte e ganhe</strong><br>com o programa <strong>Business Partner</strong>",
    // [A CONFIRMAR] painel do parceiro (acompanhamento de indicações e comissões) e condições de adesão
    diagram: {
      h3: "Você abre a <strong>porta</strong>.<br>Nós fazemos o <strong>resto</strong>.",
      h6: "Todo Business Partner conta com o apoio do nosso time comercial do primeiro contato ao contrato assinado.",
      left: [["Materiais de venda", "Apresentações e roteiros de abordagem prontos"], ["Qualificação", "Nosso time avalia cada oportunidade"], ["Proposta", "Especialistas montam a proposta sob medida"]],
      right: [["Negociação", "Apoio comercial na reunião com o cliente"], ["Acompanhamento", "Status das suas indicações e das comissões"], ["Treinamento", "Serviços Bear e venda consultiva"]],
      bottom: ["Pagamento recorrente", "Comissão enquanto o cliente permanecer"],
    },
    call: "<strong>Apoio comercial do início ao fim</strong><br>para você focar no que faz de melhor: relacionamento",
    how: ["Indique empresas ou prospecte ativamente com o apoio do time comercial", "Use materiais, roteiros e propostas preparadas pelo nosso time", "Acompanhe o status das suas indicações com o time de parcerias", "Receba comissão por contrato fechado e recorrência enquanto o cliente permanecer"],
    who: ["Consultores, advogados e corretores", "Profissionais de vendas B2B", "Quem tem rede de contatos com empresários"],
    benefits: {
      h2: "Tudo o que você precisa<br><strong>para fechar negócios</strong>",
      p: "Você não precisa entender de contabilidade a fundo. Nosso time cuida da parte técnica; você cuida do relacionamento.",
      items: ["<strong>Comissão por contrato</strong> e <strong>recorrência</strong> enquanto o cliente permanecer.", "<strong>Kit comercial</strong> com apresentações e roteiros de abordagem.", "<strong>Especialistas</strong> na reunião com o cliente quando você precisar.", "<strong>Acompanhamento</strong> das suas indicações e dos pagamentos pelo time de parcerias."],
    },
    steps: [["Cadastro", "Preencha o formulário e fale conosco pelo WhatsApp."], ["Conversa inicial", "Entendemos seu perfil e sua rede de contatos."], ["Contrato", "Regras de indicação e comissões formalizadas."], ["Treinamento", "Serviços Bear, perfil de cliente ideal e abordagem."], ["Primeiras indicações", "Time comercial apoia suas primeiras oportunidades."], ["Recorrência", "Comissões mensais e evolução no programa."]],
    cta: "Sua rede de contatos vale mais do que você imagina. <strong>Fale agora com o time de parcerias</strong> pelo WhatsApp.",
    faq: [
      ["O que é o Business Partner?", "É o programa da Bear para profissionais que indicam ou prospectam empresas. Você faz a conexão; o time Bear conduz a venda e a entrega."],
      ["Preciso ser contador?", "Não. Buscamos profissionais com boa rede de relacionamento empresarial, como consultores, advogados, corretores e vendedores B2B."],
      ["Como recebo a comissão?", "Você recebe por contrato fechado e uma recorrência enquanto o cliente permanecer na Bear. Percentuais e prazos são definidos em contrato."],
      ["Preciso vender ou só indicar?", "Os dois modelos são possíveis: você pode apenas indicar contatos ou prospectar ativamente com o apoio do nosso time."],
      ["Há custo para participar?", "As condições de adesão são apresentadas na conversa inicial com o time de parcerias."],
    ],
    img: "ph-08.svg",
    video: { id: "", title: "Business Partner", sub: "Como indicar e prospectar com a Bear" },
    form: {
      title: "Quero ser <strong>Business Partner</strong>",
      step2: "Sobre o seu perfil",
      fields: [
        { name: "perfil", label: "Seu perfil profissional", type: "select", required: true, options: ["Consultor(a) empresarial", "Advogado(a)", "Corretor(a) de seguros / imóveis", "Vendedor(a) B2B", "Gestor(a) / empresário(a)", "Outro"] },
        { name: "rede", label: "Tamanho da sua rede de empresários", type: "select", required: true, options: ["Até 20", "21 a 100", "Mais de 100"] },
        { name: "setores", label: "Setores com mais relacionamento", type: "chips", options: ["Indústria", "Agro", "Saúde", "Construção", "Varejo", "Serviços", "Logística", "Energia"] },
        { name: "atuacao", label: "Como pretende atuar", type: "radio", required: true, options: ["Só indicar", "Prospectar ativamente", "Os dois"] },
      ],
    },
  },
];
