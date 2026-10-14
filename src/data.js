// =====================================================================
// Conteúdo do site Bear Finance. Edite aqui e rode `npm run build`.
// Textos, fotos e vídeos são provisórios: o marketing substitui depois.
// Vídeos: informe o ID do YouTube (ex.: "dQw4w9WgXcQ") ou deixe "" para
// manter o espaço reservado com botão de play.
// =====================================================================

export const site = {
  name: "Bear Finance",
  tagline: "Soluções contábeis, financeiras e tributárias",
  url: "https://www.bearfinance.com.br",
  email: "contato@bearfinance.com.br",
  phone: "(11) 98314-8774",
  phoneHref: "tel:+5511983148774",
  whatsapp: "https://w.app/bcalgz",
  instagram: "https://instagram.com/bearfinance",
  linkedin: "https://www.linkedin.com/company/bearfinance",
  youtube: "https://www.youtube.com/@bearfinance",
  address: "Rua Riachuelo, 231 – 4º andar, Sé, 01007-000",
  city: "São Paulo – SP",
  platformUrl: "https://www.bearfinance.com.br",
  heroVideo: "",                 // URL de um .mp4 para o fundo do topo (vazio = usa a imagem)
  heroImage: "hero.svg",
  headlineFx: true,              // ondas animadas também no topo das páginas internas
  placeholderLabels: true,       // false = esconde as etiquetas "FOTO · substituir"
};

// IDs de vídeo do YouTube por página ("" = espaço reservado)
export const videos = {
  home: { id: "", title: "Conheça a Bear Finance", sub: "Vídeo institucional · 2 min" },
  sobre: { id: "", title: "Nossa história", sub: "Quem somos e como trabalhamos" },
  carreira: { id: "", title: "Um dia na Bear", sub: "Depoimentos do time" },
  cases: { id: "", title: "Resultados reais", sub: "Clientes contam suas histórias" },
  contato: { id: "", title: "Como funciona o primeiro contato", sub: "Diagnóstico gratuito em 15 minutos" },
  plataforma: { id: "", title: "Tour pela Plataforma Bear", sub: "Dashboards, conciliação e IA" },
  esg: { id: "", title: "Nosso compromisso ESG", sub: "Práticas e metas" },
  conteudo: { id: "", title: "Webinars e podcasts", sub: "Último episódio" },
};

export const hero = {
  typedWords: ["contábeis", "financeiras", "tributárias", "tecnológicas"],
  title: `Somos a ponte entre a <strong>rotina contábil</strong> da sua empresa hoje, e os <strong>resultados</strong> que ela terá amanhã.<br><strong>Somos a Bear Finance.</strong>`,
  cta: "Saiba mais",
  ctaHref: "/sobre/",
};

// Logos de clientes (placeholders – trocar por logos reais)
export const clients = ["Cliente 01", "Cliente 02", "Cliente 03", "Cliente 04", "Cliente 05", "Cliente 06", "Cliente 07", "Cliente 08"];

// ---------------------------------------------------------------------
// Áreas de atuação (5, como no modelo)
// ---------------------------------------------------------------------
export const services = [
  {
    slug: "contabilidade",
    icon: "fa-calculator",
    name: "Contabilidade",
    excerpt: "Tenha domínio dos desafios, das necessidades e da legislação do seu mercado para identificar oportunidades e reduzir riscos.",
    headline: { h2: "Business<br><strong>Partner</strong><br>Outsourcing", p: "Gestão contábil e tributária com tecnologia própria, metodologia única e equipe especialista nos principais ERPs do mercado." },
    intro: {
      h2: "Domínio dos desafios<br><strong>do seu mercado</strong>",
      p: "Conhecemos as necessidades do seu setor e dominamos a legislação para identificar oportunidades e reduzir riscos na contabilidade da sua empresa.",
      arrows: ["Estrutura completa de BPO Contábil e Tributário", "Integração com os principais ERPs e com a sua equipe", "Fechamento mensal com demonstrações revisadas", "Modelo de atendimento focado nos desafios do seu setor"],
      close: "Na Bear é possível lidar com os desafios diários do seu negócio com um atendimento especializado, consultivo e próximo. Aumente sua eficiência e competitividade.",
    },
    method: {
      h2: "Metodologia exclusiva<br><strong>aliada a um atendimento único</strong>",
      items: [["Revisão rigorosa", "Contamos com revisores internos dedicados para conferir minuciosamente todas as demonstrações financeiras."], ["Processo preciso", "Nosso processo de apuração é rigoroso, garantindo precisão e eliminação de erros."], ["Melhoria contínua", "Aperfeiçoamos constantemente nossos procedimentos para entregar resultados cada vez mais assertivos."], ["Mapeamento completo", "Identificamos e corrigimos todos os pontos críticos para evitar distorções."], ["Benefícios garantidos", "Asseguramos todos os incentivos e créditos tributários disponíveis para a sua empresa."]],
    },
    quote: "Dominamos as particularidades de cada segmento com inteligência de mercado, <strong>produzindo informações relevantes, seguras e sempre atualizadas.</strong>",
    img: "ph-01.svg", img2: "ph-02.svg",
    video: { id: "", title: "Como funciona a contabilidade Bear", sub: "Do onboarding ao fechamento mensal" },
    faq: [["O que está incluso na contabilidade da Bear?", "Escrituração contábil e fiscal, apuração de tributos, obrigações acessórias (SPED, ECD, ECF), demonstrações financeiras mensais e atendimento consultivo com um contador responsável."], ["Como funciona a troca de contador?", "Cuidamos de todo o processo: solicitamos a documentação ao escritório anterior, revisamos a escrituração, apontamos pendências e assumimos as rotinas sem interromper suas obrigações."], ["A Bear atende empresas de qualquer porte?", "Sim. De empresas em fase inicial a grupos com múltiplas operações e Lucro Real, com escopo e investimento proporcionais."]],
  },
  {
    slug: "bpo-financeiro",
    icon: "fa-chart-line",
    name: "BPO Financeiro",
    excerpt: "Liberte seu negócio da rotina de contas a pagar, receber e conciliação com a parceria da Bear e uma operação de ponta a ponta.",
    headline: { h2: "Seu financeiro<br><strong>operado por especialistas</strong>", p: "Contas a pagar, contas a receber, conciliação bancária e fluxo de caixa com automação, aprovação por alçada e visibilidade em tempo real." },
    intro: {
      h2: "Operação financeira<br><strong>de ponta a ponta</strong>",
      p: "Assumimos a rotina financeira da sua empresa para que a liderança dedique tempo à estratégia, não à planilha.",
      arrows: ["Contas a pagar e a receber com fluxo de aprovação", "Conciliação bancária automatizada e integrada aos bancos", "Fluxo de caixa projetado e realizado", "Faturamento, boletos e régua de cobrança"],
      close: "Tudo acompanhado pela Plataforma Bear: saldo, entradas, saídas e previsões acessíveis a qualquer momento.",
    },
    method: {
      h2: "Processo desenhado<br><strong>para dar controle</strong>",
      items: [["Alçadas e aprovações", "Cada pagamento passa por aprovação definida com você, com trilha de auditoria completa."], ["Conciliação diária", "Movimentações importadas dos bancos e comparadas aos lançamentos automaticamente."], ["Relatórios gerenciais", "DRE gerencial, fluxo de caixa e indicadores atualizados na plataforma."], ["Cobrança organizada", "Régua de cobrança e acompanhamento de inadimplência."], ["Time dedicado", "Analistas que conhecem a sua operação pelo nome."]],
    },
    quote: "Menos tempo operacional, mais visibilidade: <strong>processos repetitivos saem da sua equipe e passam a rodar com automação e conferência humana.</strong>",
    img: "ph-03.svg", img2: "ph-04.svg",
    video: { id: "", title: "BPO Financeiro na prática", sub: "Um mês de operação em 3 minutos" },
    faq: [["Perco o controle do meu financeiro ao terceirizar?", "Não. Você aprova pagamentos, acompanha tudo na plataforma e recebe relatórios; o que sai da sua mesa é a execução repetitiva."], ["Quais bancos e ERPs são integrados?", "Os principais bancos via Open Finance e ERPs como TOTVS, SAP Business One, Omie, Conta Azul, Bling e Sankhya."], ["Em quanto tempo a operação começa?", "O onboarding típico leva de 2 a 4 semanas, incluindo migração de dados e integrações."]],
  },
  {
    slug: "bpo-de-folha-de-pagamento",
    icon: "fa-users",
    name: "BPO de Folha de Pagamento",
    excerpt: "Folha, férias, rescisões, encargos e eSocial processados com automação e revisão, sem retrabalho e sem passivo trabalhista.",
    headline: { h2: "Departamento pessoal<br><strong>completo e integrado</strong>", p: "Gestão da folha de pagamento com conformidade trabalhista e previdenciária e portal do colaborador." },
    intro: {
      h2: "Folha sem retrabalho<br><strong>e sem surpresas</strong>",
      p: "Processamos a folha com automação e validações antes do envio, cobrindo toda a jornada do colaborador.",
      arrows: ["Folha de pagamento, pró-labore e benefícios", "Admissões, férias, rescisões e afastamentos", "eSocial, FGTS Digital, DCTFWeb e EFD-Reinf", "Portal do colaborador com holerites digitais"],
      close: "Dados dos colaboradores tratados conforme a LGPD, com rotinas revisadas conforme CLT e convenções coletivas.",
    },
    method: {
      h2: "Rotina mensal<br><strong>com conferência dupla</strong>",
      items: [["Calendário acordado", "Datas de envio de apontamentos e de fechamento definidas com o seu RH."], ["Validações automáticas", "Inconsistências apontadas antes do processamento."], ["Conferência humana", "Analista revisa cada folha antes da liberação."], ["Obrigações no prazo", "eSocial e demais entregas monitoradas."], ["Provisões e custos", "Relatórios de encargos e provisões para o seu planejamento."]],
    },
    quote: "Menos passivo trabalhista, mais agilidade: <strong>folha processada com automação e validada por especialistas.</strong>",
    img: "ph-05.svg", img2: "ph-06.svg",
    video: { id: "", title: "Como processamos a folha", sub: "Do apontamento ao holerite" },
    faq: [["Vocês cuidam de admissões e rescisões?", "Sim, toda a jornada do colaborador: admissão, férias, afastamentos, rescisão e homologações."], ["Como os colaboradores acessam os holerites?", "Pelo portal do colaborador, com acesso individual e histórico."], ["Atendem convenções coletivas específicas?", "Sim, mapeamos a convenção de cada categoria e aplicamos os reajustes e benefícios previstos."]],
  },
  {
    slug: "auditoria-consultoria-tributaria",
    icon: "fa-magnifying-glass-chart",
    name: "Auditoria e Consultoria Tributária",
    excerpt: "Conte com um agente externo para assegurar a confiabilidade das informações financeiras e uma visão independente sobre riscos e oportunidades.",
    headline: { h2: "Segurança para<br><strong>decidir e crescer</strong>", p: "Auditoria contábil, revisão tributária e consultoria para validar números, fortalecer controles e preparar a empresa para investidores." },
    intro: {
      h2: "Olhar independente<br><strong>sobre o seu negócio</strong>",
      p: "Validamos demonstrações, revisamos tributos e apontamos riscos e oportunidades com um plano de ação priorizado.",
      arrows: ["Auditoria contábil e de controles internos", "Revisão tributária e previdenciária dos últimos 5 anos", "Due diligence para M&A e captação", "Consultoria em custos, precificação e governança"],
      close: "Entregamos diagnóstico objetivo, recomendações com responsáveis e prazos, e acompanhamento da implantação.",
    },
    method: {
      h2: "Da análise<br><strong>ao plano de ação</strong>",
      items: [["Planejamento", "Definimos escopo, materialidade e cronograma com você."], ["Execução", "Testes, cruzamentos e entrevistas com as áreas."], ["Relatório", "Achados classificados por risco e impacto."], ["Plano de ação", "Recomendações com responsáveis e prazos."], ["Acompanhamento", "Monitoramos a implantação das melhorias."]],
    },
    quote: "Demonstrações e controles no padrão que o mercado exige: <strong>prontos para investidores, bancos e auditorias externas.</strong>",
    img: "ph-07.svg", img2: "ph-08.svg",
    video: { id: "", title: "Auditoria e consultoria", sub: "O que esperar de um diagnóstico" },
    faq: [["Qual a diferença entre auditoria e revisão tributária?", "A auditoria valida demonstrações e controles; a revisão tributária analisa apurações passadas em busca de créditos e riscos."], ["Vocês emitem parecer de auditoria independente?", "Sim, por auditores registrados, conforme as normas aplicáveis."], ["Quanto tempo leva uma due diligence?", "Depende do porte e da qualidade da informação; em geral de 3 a 8 semanas."]],
  },
  {
    slug: "estruturacoes-corporativas",
    icon: "fa-sitemap",
    name: "Estruturações Corporativas",
    excerpt: "Assessoria para tomar decisões societárias com segurança: holdings, reorganizações, sucessão e planejamento tributário.",
    headline: { h2: "Estrutura certa<br><strong>para proteger e crescer</strong>", p: "Holdings patrimoniais e operacionais, reorganizações societárias, planejamento sucessório e escolha do regime tributário ideal." },
    intro: {
      h2: "Decisões societárias<br><strong>com segurança</strong>",
      p: "Estruturamos a empresa e o patrimônio com visão contábil, tributária e societária integrada, já considerando a Reforma Tributária.",
      arrows: ["Holding patrimonial e familiar", "Cisões, fusões e incorporações", "Planejamento sucessório", "Comparativo Simples × Presumido × Real e simulações de IBS/CBS"],
      close: "Toda tese documentada e fundamentada, com estimativa de economia e de riscos antes de qualquer alteração.",
    },
    method: {
      h2: "Como conduzimos<br><strong>uma reestruturação</strong>",
      items: [["Diagnóstico", "Mapeamos bens, sociedades, regimes e objetivos da família ou do grupo."], ["Cenários", "Simulamos alternativas com impacto tributário e sucessório."], ["Desenho", "Definimos a estrutura, os acordos e a governança."], ["Implantação", "Alterações contratuais, integralizações e registros."], ["Manutenção", "Acompanhamos obrigações e revisamos a estrutura periodicamente."]],
    },
    quote: "Patrimônio protegido e sucessão organizada: <strong>separação clara entre bens pessoais e risco operacional.</strong>",
    img: "ph-09.svg", img2: "ph-10.svg",
    video: { id: "", title: "Holding vale a pena?", sub: "Custos, benefícios e pontos de atenção" },
    faq: [["Holding familiar vale a pena para mim?", "Em geral, para famílias com imóveis geradores de renda, participações em empresas ou planos claros de sucessão. Cada caso exige simulação."], ["Vocês fazem a parte jurídica?", "Trabalhamos em conjunto com o seu advogado ou com escritórios parceiros para a redação dos atos societários."], ["Quanto tempo leva?", "Uma holding simples leva de 30 a 60 dias; reorganizações maiores, de 3 a 6 meses."]],
  },
];

// ---------------------------------------------------------------------
// Por que a Bear? (6 caixas; as de índice par recebem foto)
// ---------------------------------------------------------------------
export const why = [
  { html: "<strong>+ 500 empresas</strong> atendidas em todo o Brasil" },
  { html: "Somos reconhecidos pela <strong>tecnologia própria</strong> com IA!", bg: "ph-11.svg" },
  { html: "<strong>NPS</strong> em zona de excelência" },
  { html: "Cultura baseada em <strong>proximidade e resultado</strong>", bg: "ph-12.svg" },
  { html: "<strong>+ 15 anos</strong> de mercado" },
  { html: "<strong>+ 300%</strong> de eficiência operacional com a Plataforma Bear", bg: "ph-03.svg" },
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

export const verticals = [
  {
    slug: "contabilidade-industria", icon: "fa-industry", name: "Indústria", short: "Manufatura, transformação e beneficiamento.", img: "ph-01.svg",
    headline: "A indústria brasileira opera com margens pressionadas e uma das cargas tributárias mais complexas do mundo. Custos, créditos e produção precisam estar integrados à contabilidade.",
    g: ["A busca por <strong>eficiência tributária</strong> é um dos principais desafios da indústria.", "Créditos de IPI, PIS/COFINS e ICMS exigem controle rigoroso de entradas e saídas.", "Custeio industrial e bloco K pedem integração total entre produção e contabilidade."],
    block1: { eyebrow: "No chão de fábrica", h2: "Contadores e consultores<br><strong>especializados em indústria</strong>", p: ["Em meio aos desafios da contabilidade industrial, a busca por eficiência tributária e controle de custos é constante.", "Por isso a Bear mantém uma equipe multidisciplinar que conhece créditos, incentivos regionais, drawback e o dia a dia da produção."] },
    block2: { eyebrow: "Margem real por produto", h2: "Custos sob controle<br><strong>e crédito aproveitado</strong>", p: ["O ganho de competitividade passa por saber a margem real de cada linha, considerando tributos, créditos e custos indiretos.", "Integramos o ERP industrial à contabilidade para que cada decisão de preço e mix tenha base em números confiáveis."] },
    atuacao: { eyebrow: "Presença em cada etapa", h2: "Estamos em<br><strong>toda a cadeia produtiva</strong>", p: "Dominamos as particularidades contábeis e tributárias do setor, do fornecedor de insumos ao distribuidor.", items: ["Metalurgia", "Alimentos e bebidas", "Química e plásticos", "Têxtil e confecção", "Móveis", "Embalagens", "Máquinas e equipamentos", "Cosméticos"] },
    partner: { h3: "Parceiros<br><strong>homologados</strong>", p: "Atuamos ao lado de associações e entidades do setor para manter nosso time atualizado sobre incentivos e normas." },
    tabs: tabsPadrao,
    faq: [["O que é contabilidade para indústria?", "É a contabilidade que integra custos de produção, estoques, créditos tributários e obrigações específicas (como o bloco K) para dar à indústria margem real por produto e conformidade fiscal."], ["Quais créditos a indústria costuma deixar de aproveitar?", "Créditos de IPI, PIS/COFINS sobre insumos e ICMS sobre energia e ativo imobilizado são os mais comuns."], ["Vocês atendem incentivos regionais?", "Sim, mapeamos incentivos estaduais e regionais (como SUDAM e SUDENE) aplicáveis à sua planta."]],
  },
  {
    slug: "contabilidade-agronegocio", icon: "fa-wheat-awn", name: "Agronegócio", short: "Produtores rurais, cooperativas e agroindústrias.", img: "ph-02.svg",
    headline: "O agronegócio é um dos setores mais dinâmicos da economia brasileira. Para dispor de informações confiáveis, é preciso uma contabilidade que entenda o campo.",
    g: ["A busca por <strong>eficiência tributária</strong> é um dos principais desafios do agro.", "Questões societárias, como sucessão familiar e holding rural, pedem planejamento.", "A escolha entre pessoa física e jurídica muda a carga tributária de forma relevante."],
    block1: { eyebrow: "No dia a dia do agro", h2: "Contadores e consultores<br><strong>especializados no mercado rural</strong>", p: ["Entre LCDPR, Funrural e créditos presumidos, o produtor precisa de quem fale a língua do campo.", "A Bear dispõe de uma equipe especializada em contabilidade rural, cooperativas e agroindústrias."] },
    block2: { eyebrow: "O futuro do agro, hoje", h2: "Cultivando eficiência<br><strong>e colhendo rentabilidade</strong>", p: ["O ganho de produtividade também passa por questões societárias: sucessão, proteção patrimonial e governança.", "Estruturamos a propriedade e o negócio para crescer com segurança entre gerações."] },
    atuacao: { eyebrow: "Presença em cada solo", h2: "Estamos em<br><strong>toda a cadeia produtiva</strong> do agronegócio", p: "Do produtor rural ao distribuidor de insumos, dominamos as particularidades de cada elo.", items: ["Produtor rural", "Revenda de insumos", "Concessionárias de máquinas", "Sementeiras", "Beneficiamento de grãos", "Fertilizantes", "Cooperativas", "Transporte da produção"] },
    partner: { h3: "Parceiros<br><strong>homologados</strong>", p: "Participamos de entidades do setor para acompanhar de perto a legislação e as oportunidades do agro." },
    tabs: tabsPadrao,
    faq: [["O que é contabilidade para o agronegócio?", "É um serviço especializado que atende produtores, revendas, cooperativas e agroindústrias nas demandas fiscais, societárias e financeiras do setor."], ["Qual a importância do LCDPR?", "O Livro Caixa Digital do Produtor Rural é obrigatório acima de determinada receita e base para a apuração do IRPF do produtor."], ["Produtor rural deve virar PJ?", "Depende do faturamento, das fontes de receita e dos planos de sucessão. Simulamos os dois cenários antes de recomendar."]],
  },
  {
    slug: "contabilidade-saude", icon: "fa-stethoscope", name: "Saúde", short: "Clínicas, consultórios, laboratórios e médicos.", img: "ph-03.svg",
    headline: "Clínicas e profissionais da saúde precisam de apuração correta de impostos, gestão de custos e organização fiscal para focar no paciente.",
    g: ["<strong>Equiparação hospitalar</strong> e escolha do regime reduzem a carga tributária.", "Repasses entre sócios médicos exigem controle e transparência.", "Convênios e glosas pedem conciliação detalhada de recebíveis."],
    block1: { eyebrow: "Dentro da clínica", h2: "Contabilidade que entende<br><strong>a rotina da saúde</strong>", p: ["Da clínica individual ao hospital-dia, cada estrutura tem um enquadramento ideal.", "Nosso time acompanha a jurisprudência sobre equiparação hospitalar e sociedades uniprofissionais."] },
    block2: { eyebrow: "Mais tempo para o paciente", h2: "Organização fiscal<br><strong>e previsibilidade</strong>", p: ["Relatórios por profissional, por procedimento e por convênio.", "Planejamento de retiradas e pró-labore com eficiência tributária."] },
    atuacao: { eyebrow: "Presença em cada especialidade", h2: "Atendemos<br><strong>toda a cadeia da saúde</strong>", p: "Da pessoa física ao hospital, dominamos as particularidades de cada modelo.", items: ["Médicos PJ", "Clínicas", "Laboratórios", "Odontologia", "Fisioterapia", "Psicologia", "Hospitais-dia", "Home care"] },
    partner: { h3: "Parceiros<br><strong>homologados</strong>", p: "Atuamos com associações médicas e cooperativas para manter o conhecimento do setor atualizado." },
    tabs: tabsPadrao,
    faq: [["Médico deve atender como PJ ou PF?", "Depende do faturamento, das fontes pagadoras e dos planos de expansão. Comparamos a carga tributária de cada modelo."], ["O que é equiparação hospitalar?", "Benefício que reduz a base de IRPJ e CSLL no Lucro Presumido para serviços hospitalares, mediante requisitos específicos."], ["Vocês conciliam convênios?", "Sim, conciliamos repasses, glosas e recursos de glosa por convênio."]],
  },
  {
    slug: "contabilidade-mercado-imobiliario-e-construcao-civil", icon: "fa-helmet-safety", name: "Mercado Imobiliário e Construção Civil", short: "Construtoras, incorporadoras e loteadoras.", img: "ph-04.svg",
    headline: "RET, SPE, patrimônio de afetação e controle por obra: construtoras e incorporadoras precisam de transparência em cada empreendimento.",
    g: ["O <strong>Regime Especial de Tributação</strong> pode reduzir a carga da incorporação.", "Contabilidade por SPE e por obra dá visibilidade a cada empreendimento.", "Reconhecimento de receita por POC exige controle de custo orçado e incorrido."],
    block1: { eyebrow: "No canteiro e no escritório", h2: "Especialistas em<br><strong>incorporação e construção</strong>", p: ["Cada empreendimento é um negócio: SPE, RET, CNO, INSS de obra e retenções.", "Nosso time acompanha a obra do lançamento à entrega das chaves."] },
    block2: { eyebrow: "Resultado por empreendimento", h2: "Visibilidade<br><strong>obra a obra</strong>", p: ["Custo orçado × incorrido, margem projetada e fluxo de caixa por SPE.", "Relatórios para sócios, investidores e bancos financiadores."] },
    atuacao: { eyebrow: "Presença em cada etapa", h2: "Atendemos<br><strong>toda a cadeia imobiliária</strong>", p: "Da loteadora à administradora de condomínios.", items: ["Incorporadoras", "Construtoras", "Loteadoras", "Imobiliárias", "Administradoras", "Fundos imobiliários", "Empreiteiras", "Arquitetura e engenharia"] },
    partner: { h3: "Parceiros<br><strong>homologados</strong>", p: "Atuamos com sindicatos e associações do setor da construção." },
    tabs: tabsPadrao,
    faq: [["O que é o RET?", "Regime Especial de Tributação aplicável a incorporações com patrimônio de afetação, com alíquota unificada sobre a receita."], ["Por que criar uma SPE por obra?", "Para segregar riscos, resultados e financiamentos de cada empreendimento."], ["Como vocês tratam o INSS de obra?", "Cadastramos a obra no CNO, calculamos e acompanhamos as retenções até a averbação."]],
  },
  {
    slug: "contabilidade-transportes-e-logistica", icon: "fa-truck-fast", name: "Transportes e Logística", short: "Transportadoras, operadores logísticos e frotas.", img: "ph-05.svg",
    headline: "Transportadoras e operadores logísticos lidam com ICMS interestadual, créditos de combustível e custos de frota que precisam de contabilidade precisa.",
    g: ["<strong>ICMS</strong> por estado e regimes especiais pedem apuração cuidadosa.", "Créditos sobre combustível, pneus e manutenção impactam o resultado.", "Custo por quilômetro e por rota orienta a precificação do frete."],
    block1: { eyebrow: "Na estrada", h2: "Contabilidade que acompanha<br><strong>cada rota</strong>", p: ["CT-e, MDF-e e obrigações por estado exigem rotina organizada.", "Integramos o TMS à contabilidade para enxergar o custo real de cada operação."] },
    block2: { eyebrow: "Frete que dá lucro", h2: "Custo por quilômetro<br><strong>e margem por cliente</strong>", p: ["Relatórios por veículo, rota e cliente.", "Planejamento de renovação de frota com impacto tributário calculado."] },
    atuacao: { eyebrow: "Presença em cada modal", h2: "Atendemos<br><strong>toda a cadeia logística</strong>", p: "Do transportador autônomo ao operador logístico.", items: ["Transporte rodoviário", "Operadores logísticos", "Armazéns", "Distribuidoras", "Transporte de cargas especiais", "Locação de frota", "Courier", "Agenciamento de cargas"] },
    partner: { h3: "Parceiros<br><strong>homologados</strong>", p: "Atuamos com sindicatos e associações do transporte." },
    tabs: tabsPadrao,
    faq: [["Transportadora pode ficar no Simples?", "Sim, dentro dos limites de faturamento, mas em muitos casos o Lucro Presumido ou Real é mais vantajoso. Simulamos."], ["Quais créditos de ICMS a transportadora tem?", "Combustível, lubrificantes, pneus e peças, conforme a legislação de cada estado."], ["Vocês integram o TMS?", "Sim, com os principais sistemas de gestão de transporte."]],
  },
  {
    slug: "contabilidade-varejo-e-distribuicao", icon: "fa-store", name: "Varejo e Distribuição", short: "Lojas físicas, distribuidores e e-commerce.", img: "ph-06.svg",
    headline: "Controle de estoque, substituição tributária e margens por canal para varejistas e distribuidores que precisam vender mais sem perder dinheiro em imposto.",
    g: ["<strong>ICMS-ST e DIFAL</strong> em vendas interestaduais exigem apuração precisa.", "Marketplaces e meios de pagamento pedem conciliação detalhada.", "Inventário e custo médio sustentam a precificação."],
    block1: { eyebrow: "Na loja e no e-commerce", h2: "Contabilidade para<br><strong>vender com margem</strong>", p: ["Cada canal tem taxa, prazo e tributação diferentes.", "Conciliamos marketplaces, adquirentes e estoque para mostrar a margem real por canal."] },
    block2: { eyebrow: "Preço certo", h2: "Precificação<br><strong>com carga tributária real</strong>", p: ["Simulações de preço considerando ST, DIFAL e comissões.", "Relatórios por categoria, loja e canal."] },
    atuacao: { eyebrow: "Presença em cada canal", h2: "Atendemos<br><strong>todo o varejo</strong>", p: "Do atacado ao e-commerce.", items: ["Lojas físicas", "E-commerce", "Marketplaces", "Atacado e distribuição", "Franquias", "Farmácias", "Supermercados", "Moda e calçados"] },
    partner: { h3: "Parceiros<br><strong>homologados</strong>", p: "Atuamos com associações do comércio e plataformas de e-commerce." },
    tabs: tabsPadrao,
    faq: [["O que é ICMS-ST?", "Substituição tributária: o ICMS de toda a cadeia é recolhido antecipadamente por um contribuinte, geralmente o fabricante ou distribuidor."], ["Vocês conciliam marketplaces?", "Sim, conciliamos repasses, comissões e devoluções dos principais marketplaces."], ["Como controlar o estoque para a contabilidade?", "Integramos o ERP ou PDV e fazemos inventário periódico com custo médio."]],
  },
  {
    slug: "contabilidade-energia", icon: "fa-bolt", name: "Energia", short: "Geração, distribuição e comercialização.", img: "ph-07.svg",
    headline: "Geradoras, comercializadoras e usinas solares operam em um ambiente regulado com incentivos específicos e contabilidade complexa.",
    g: ["<strong>Incentivos fiscais</strong> para geração renovável exigem apuração dedicada.", "Contratos de longo prazo pedem reconhecimento de receita cuidadoso.", "Regulação setorial impõe reportes específicos."],
    block1: { eyebrow: "No setor elétrico", h2: "Contabilidade para<br><strong>um mercado regulado</strong>", p: ["Geração distribuída, autoprodução e mercado livre têm regras próprias.", "Nosso time acompanha a regulação e os incentivos do setor."] },
    block2: { eyebrow: "Energia que rende", h2: "Projetos com<br><strong>retorno previsível</strong>", p: ["Modelagem financeira e tributária de usinas e parques.", "Relatórios para investidores e financiadores."] },
    atuacao: { eyebrow: "Presença em cada fonte", h2: "Atendemos<br><strong>toda a cadeia de energia</strong>", p: "Da usina ao consumidor livre.", items: ["Solar", "Eólica", "Hidrelétrica", "Biomassa", "Comercializadoras", "Geração distribuída", "Eficiência energética", "Consumidores livres"] },
    partner: { h3: "Parceiros<br><strong>homologados</strong>", p: "Atuamos com associações do setor de energia renovável." },
    tabs: tabsPadrao,
    faq: [["Usina solar tem incentivo fiscal?", "Há incentivos federais e estaduais, como isenção de ICMS na energia compensada e regimes especiais; avaliamos cada caso."], ["Como reconhecer a receita de contratos de longo prazo?", "Conforme as normas contábeis, com atenção a ajustes e garantias."], ["Vocês atendem comercializadoras?", "Sim, incluindo as obrigações junto à CCEE."]],
  },
  {
    slug: "contabilidade-servicos", icon: "fa-laptop-code", name: "Serviços e Tecnologia", short: "Startups, SaaS, agências e consultorias.", img: "ph-08.svg",
    headline: "Empresas de serviços e tecnologia precisam de uma estrutura preparada para escalar: receitas recorrentes, rodadas de investimento e incentivos.",
    g: ["<strong>Fator R</strong> e escolha do regime mudam a carga de empresas de serviços.", "Receita recorrente (SaaS) exige reconhecimento adequado.", "Rodadas e due diligence pedem números prontos para investidores."],
    block1: { eyebrow: "No digital", h2: "Contabilidade pronta<br><strong>para escalar</strong>", p: ["Da agência à startup em rodada série A, cada fase tem necessidades diferentes.", "Nosso time entende stock options, vesting, Lei do Bem e exportação de serviços."] },
    block2: { eyebrow: "Crescimento com base", h2: "Métricas e números<br><strong>que investidores confiam</strong>", p: ["MRR, churn e CAC conciliados com a contabilidade.", "Relatórios mensais no padrão que fundos e bancos exigem."] },
    atuacao: { eyebrow: "Presença em cada modelo", h2: "Atendemos<br><strong>toda a economia de serviços</strong>", p: "De consultorias a plataformas SaaS.", items: ["SaaS", "Agências", "Consultorias", "Software house", "Educação", "Marketing", "Engenharia", "Startups"] },
    partner: { h3: "Parceiros<br><strong>homologados</strong>", p: "Atuamos com hubs de inovação e aceleradoras." },
    tabs: tabsPadrao,
    faq: [["O que é Fator R?", "Regra do Simples Nacional que define a tabela de tributação de serviços conforme a proporção entre folha de pagamento e receita."], ["Vocês ajudam em rodadas de investimento?", "Sim, preparamos a contabilidade para due diligence e apoiamos na estruturação societária."], ["Exportação de serviços é isenta?", "Há isenções de PIS/COFINS e ISS em muitos casos; avaliamos a operação."]],
  },
];

export const erps = ["TOTVS Protheus", "SAP Business One", "Omie", "Conta Azul", "Bling", "Sankhya", "Senior", "Oracle NetSuite", "Tiny", "Domínio", "TOTVS Winthor", "Plataforma Bear"];

// Presença nacional
export const presence = {
  p: "Com sede em <strong>São Paulo</strong> e operação 100% digital, <strong>impulsionamos negócios em <span class='text-lilas'>todos os estados brasileiros</span></strong>.",
  numbers: [[500, "empresas atendidas", "+", ""], [15, "anos de mercado", "+", ""], [98, "de satisfação dos clientes", "", "%"], [300, "de eficiência operacional", "+", "%"]],
  offices: [["São Paulo – SP", "Rua Riachuelo, 231 – 4º andar, Sé, 01007-000", "(11) 98314-8774"], ["Atendimento digital", "Clientes em todo o Brasil pela Plataforma Bear", ""]],
};

export const faq = [
  ["O que é a Bear Finance?", "A Bear Finance é uma empresa de contabilidade empresarial que se destaca por unir contabilidade, BPO financeiro, departamento pessoal e inteligência tributária a uma plataforma própria com inteligência artificial."],
  ["Quais serviços a Bear oferece?", "Contabilidade, BPO Financeiro, BPO de Folha de Pagamento, Auditoria e Consultoria Tributária e Estruturações Corporativas, além da Plataforma Bear para gestão financeira em tempo real."],
  ["Como a Bear pode ajudar minha empresa?", "Identificamos oportunidades e riscos contábeis e tributários, automatizamos rotinas e entregamos relatórios que apoiam decisões, com um time que conhece o seu setor e o seu ERP."],
  ["Quais são os benefícios de contratar a Bear?", "Especialistas que conhecem a sua vertical, resultados apresentados em dashboards, segurança na gestão financeira e um atendimento consultivo e próximo."],
  ["A Bear oferece gestão contábil personalizada?", "Sim. Avaliamos a realidade e as necessidades da sua empresa e montamos um escopo sob medida, com investimento proporcional."],
  ["Como a Bear lida com a confidencialidade das informações?", "Tratamos dados conforme a LGPD, com controle de acesso, criptografia e acordos de confidencialidade com todo o time."],
  ["Quais são os diferenciais da Bear em relação ao mercado?", "Tecnologia própria com IA, metodologia de revisão em dupla camada, conhecimento setorial e atendimento próximo. Entre em contato e conheça."],
];

// Blog
export const blogTabs = ["Blog", "Reforma Tributária", "Materiais ricos", "Webinar e podcasts", "Eventos"];
export const posts = [
  { slug: "reforma-tributaria-ibs-cbs-o-que-muda", cat: "Reforma Tributária", date: "2026-09-28", img: "ph-09.svg", title: "Reforma Tributária: o que muda com IBS e CBS na prática", excerpt: "Um guia direto sobre o período de transição, créditos e o impacto no preço dos seus produtos e serviços.",
    body: [["p", "A substituição de PIS, COFINS, ICMS, ISS e parte do IPI por IBS e CBS altera a forma como empresas calculam preço, aproveitam créditos e se relacionam com fornecedores."], ["h2", "Período de transição"], ["p", "Os novos tributos convivem com os atuais durante alguns anos. Isso exige sistemas preparados para apurar os dois modelos ao mesmo tempo."], ["h2", "Por onde começar"], ["ul", ["Mapeie a carga tributária atual por produto ou serviço", "Revise contratos de longo prazo", "Converse com o fornecedor do seu ERP", "Simule cenários com seu contador"]]] },
  { slug: "bpo-financeiro-quando-terceirizar", cat: "Gestão financeira", date: "2026-09-10", img: "ph-10.svg", title: "BPO financeiro: 5 sinais de que é hora de terceirizar", excerpt: "Atrasos na conciliação, decisões sem números e equipe sobrecarregada são só o começo.",
    body: [["p", "Terceirizar o financeiro não é abrir mão do controle — é ganhar processo, tecnologia e tempo para decidir."], ["h2", "Os sinais mais comuns"], ["ul", ["O fechamento do mês atrasa", "Ninguém sabe o saldo projetado para os próximos 30 dias", "Pagamentos são aprovados por mensagem", "O sócio faz conciliação no fim de semana", "Os relatórios não batem com o extrato"]]] },
  { slug: "holding-familiar-vale-a-pena", cat: "Societário", date: "2026-08-22", img: "ph-11.svg", title: "Holding familiar vale a pena? Entenda custos e benefícios", excerpt: "Proteção patrimonial e sucessão mais simples — mas com pontos de atenção que precisam ser avaliados.",
    body: [["p", "A holding familiar concentra bens em uma pessoa jurídica controlada pela família, facilitando a gestão e a sucessão."], ["h2", "Quando faz sentido"], ["p", "Em geral, para famílias com imóveis geradores de renda, participações em empresas ou planos claros de sucessão. Cada caso exige simulação de ITBI, ITCMD e tributação de aluguéis."]] },
  { slug: "contabilidade-para-medicos-pj-ou-pf", cat: "Contabilidade", date: "2026-08-05", img: "ph-12.svg", title: "Médico: atender como PJ ou pessoa física?", excerpt: "Comparamos a carga tributária de cada modelo e quando a equiparação hospitalar faz diferença.",
    body: [["p", "A escolha entre pessoa física e jurídica muda a carga tributária de forma relevante para profissionais da saúde."], ["h2", "Pontos a considerar"], ["ul", ["Volume de faturamento anual", "Fontes pagadoras (convênios, hospitais, particulares)", "Possibilidade de equiparação hospitalar", "Planos de expansão para clínica"]]] },
  { slug: "conciliacao-bancaria-automatizada", cat: "Tecnologia", date: "2026-07-18", img: "ph-05.svg", title: "Conciliação bancária automatizada: como funciona", excerpt: "Open Finance, regras de correspondência e revisão humana para fechar o mês em dias, não semanas.",
    body: [["p", "Com integração direta aos bancos, cada movimentação é importada e comparada aos lançamentos previstos automaticamente."], ["h2", "O papel do especialista"], ["p", "A automação resolve a maior parte dos casos; o time da Bear revisa as exceções e mantém as regras atualizadas."]] },
  { slug: "incentivos-sudam-sudene", cat: "Reforma Tributária", date: "2026-07-01", img: "ph-07.svg", title: "Incentivos regionais: quem tem direito e como reduzir o IRPJ", excerpt: "Como funcionam os incentivos de desenvolvimento regional e o que muda com a reforma.",
    body: [["p", "Empresas instaladas em determinadas regiões podem obter redução relevante do IRPJ mediante projeto aprovado."], ["h2", "Requisitos"], ["ul", ["Localização do empreendimento", "Setor prioritário", "Projeto de implantação, modernização ou ampliação", "Regularidade fiscal"]]] },
];

// Sobre
export const about = {
  headline: "A contabilidade empresarial<br>que une <strong>tecnologia</strong>,<br><strong>expertise</strong> e <strong>proximidade</strong>",
  numbers: [["+ 500", "empresas atendidas"], ["+ 15 anos", "de mercado"], ["NPS 90+", "em zona de excelência"]],
  h2: "Somos<br><strong>a Bear Finance</strong>",
  p: ["Com sede em São Paulo e operação digital em todo o Brasil, a Bear Finance nasceu para atender às necessidades de empresas que buscam resultados extraordinários com uma contabilidade consultiva e tecnológica.", "Unimos contabilidade, BPO financeiro, departamento pessoal e inteligência tributária a uma plataforma própria com inteligência artificial, que automatiza lançamentos, conciliações e compliance.", "Compartilhamos e desenvolvemos estratégias contábeis e tributárias para que nossos clientes lidem com a complexidade do ambiente de negócios brasileiro com segurança."],
  img: "ph-01.svg",
  team: [["Sócio(a) 01", "Contabilidade", "Breve biografia do sócio ou sócia: formação, experiência e área de atuação. Texto provisório para substituição pelo marketing."], ["Sócio(a) 02", "BPO Financeiro", "Breve biografia do sócio ou sócia: formação, experiência e área de atuação."], ["Sócio(a) 03", "Consultoria Tributária", "Breve biografia do sócio ou sócia: formação, experiência e área de atuação."], ["Sócio(a) 04", "Tecnologia e Plataforma", "Breve biografia do sócio ou sócia: formação, experiência e área de atuação."], ["Sócio(a) 05", "Departamento Pessoal", "Breve biografia do sócio ou sócia: formação, experiência e área de atuação."], ["Sócio(a) 06", "Comercial e Expansão", "Breve biografia do sócio ou sócia: formação, experiência e área de atuação."]],
  values: [["fa-handshake", "Proximidade", "Cada cliente tem um time que conhece seu negócio."], ["fa-shield-halved", "Ética", "Transparência e conformidade acima de tudo."], ["fa-lightbulb", "Inovação", "Tecnologia a serviço de decisões melhores."], ["fa-trophy", "Resultado", "Foco em eficiência e entrega de valor real."]],
};

// Carreira
export const career = {
  headline: "Abrimos <strong>caminhos</strong><br>Lideramos <strong>mudanças</strong><br>Assumimos <strong>riscos</strong>",
  sub: "Esse é o jogo dos melhores",
  culture: [["A", "mudança", " é a nossa única constante."], ["Sempre faremos ", "melhor", " do que fizemos antes."], ["", "Erramos", ", mas corrigimos rapidamente."], ["Perseguimos o ", "extraordinário", ""], ["Nos ", "antecipamos", " sempre."], ["Somos ", "pragmáticos", " e analíticos."], ["Este é um negócio sobre ", "pessoas", ""], ["Nossa cultura é ", "inegociável", ""], ["Prezamos pela ", "diversidade", ""]],
  areas: ["Contabilidade", "BPO Financeiro", "Departamento Pessoal", "Tecnologia", "Marketing", "Comercial"],
  jobs: [["Analista Contábil Pleno", "São Paulo · Híbrido"], ["Analista de BPO Financeiro", "São Paulo · Híbrido"], ["Analista de Departamento Pessoal", "São Paulo · Presencial"], ["Desenvolvedor(a) Full Stack — Plataforma Bear", "Remoto"], ["Estágio em Contabilidade", "São Paulo · Presencial"]],
  diversity: ["A Bear é para você e para quem mais se identificar com a nossa missão e quiser fazer parte.", "Acreditamos que a diversidade do nosso país deve ser refletida em nosso ambiente de trabalho. Só assim construímos um time que entende clientes tão diversos quanto o Brasil.", "Agimos em conjunto com nossos coletivos para promover um ambiente seguro e de respeito."],
  people: [["Trabalhe com o time de Contabilidade", "ph-05.svg"], ["Trabalhe com o time de Gente e Gestão", "ph-06.svg"], ["Trabalhe com a Consultoria Tributária", "ph-07.svg"], ["Trabalhe com o time Comercial", "ph-08.svg"]],
  talents: ["Com uma cultura empreendedora, do \"vai lá e faz\", não nos preocupamos com os erros que surgem no meio do caminho — e sim com o aprendizado que eles trazem.", "O Programa Novos Talentos desenvolve, prepara e capacita estagiários para ocupar um cargo efetivo na Bear.", "Queremos que você cresça profissionalmente e saiba tomar as decisões mais ajustadas ao propósito do nosso negócio."],
};

// Cases de sucesso (placeholders)
export const cases = [
  ["Indústria de embalagens", "Indústria", "Redução de 18% na carga tributária com recuperação de créditos e revisão do regime.", "ph-01.svg"],
  ["Rede de clínicas", "Saúde", "Equiparação hospitalar e reorganização societária com economia recorrente.", "ph-03.svg"],
  ["Distribuidora de alimentos", "Varejo e Distribuição", "Conciliação de 12 marketplaces e fechamento mensal em 5 dias úteis.", "ph-06.svg"],
  ["Startup SaaS", "Serviços e Tecnologia", "Contabilidade preparada para rodada série A e due diligence aprovada.", "ph-08.svg"],
  ["Produtor rural", "Agronegócio", "Holding rural e planejamento sucessório entre três gerações.", "ph-02.svg"],
  ["Construtora", "Construção Civil", "RET e contabilidade por SPE para 6 empreendimentos simultâneos.", "ph-04.svg"],
];

// ESG
export const esg = {
  headline: "Cultura baseada em<br>princípios de <strong>ESG</strong>",
  pillars: [["fa-leaf", "Ambiental", "Operação digital, redução de papel e compensação de emissões das viagens do time."], ["fa-people-group", "Social", "Programa de novos talentos, coletivos de diversidade e apoio a entidades do terceiro setor."], ["fa-scale-balanced", "Governança", "Código de conduta, canal de denúncias e auditoria interna dos nossos processos."]],
  p: ["Acreditamos que uma empresa de contabilidade tem papel direto na governança dos seus clientes — e que isso começa em casa.", "Nossas práticas ESG são revisadas anualmente e publicadas em relatório para clientes e colaboradores."],
};

// Plataforma (ocupa o lugar de "Partnership" no modelo)
export const platform = {
  headline: "Gestão financeira com<br><strong>inteligência artificial</strong>",
  p: "A plataforma que simplifica processos contábeis complexos e aumenta a eficiência da sua gestão financeira em até 300%.",
  features: [["fa-chart-column", "Relatórios em tempo real", "Dashboards atualizados automaticamente com a saúde financeira da sua empresa."], ["fa-building-columns", "Integração bancária", "Conecte suas contas e automatize a conciliação sem esforço manual."], ["fa-users-gear", "Gestão de folha", "Folha de pagamento, férias e encargos automatizados."], ["fa-gauge-high", "Dashboard financeiro", "Receitas, despesas e indicadores em painéis personalizados."], ["fa-robot", "IA integrada", "Classificação de lançamentos e alertas de inconsistência."], ["fa-lock", "100% seguro", "Criptografia, controle de acesso e conformidade com a LGPD."]],
  steps: [["Diagnóstico", "Entendemos sua operação, regime, sistemas e dores em uma conversa sem custo."], ["Proposta sob medida", "Escopo, prazos e investimento conforme o porte e a complexidade."], ["Onboarding", "Migração de dados, integração com bancos e ERP e definição de rotinas."], ["Gestão contínua", "Entregas mensais, dashboards em tempo real e reuniões de resultado."]],
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

const partnerNumbers = [["+500", "empresas atendidas"], ["+15 anos", "de mercado"], ["+300%", "de eficiência com a plataforma"], ["98%", "de satisfação dos clientes"]];

export const partnerHub = {
  h2: "Dois programas.<br>Um mesmo <strong>propósito</strong>: crescer junto.",
  p: "A Bear abre a sua estrutura, a sua tecnologia e o seu time para quem quer ir mais longe. Escolha o programa que combina com o seu perfil.",
  video: { id: "", title: "Programas de parceria Bear", sub: "BPO e Business Partner em 2 minutos" },
  compare: [
    ["Para quem é", "Escritórios de contabilidade e contadores com carteira ativa", "Profissionais com rede de relacionamento com empresários"],
    ["O que você faz", "Atende seus clientes com a estrutura, os serviços e a plataforma da Bear", "Indica ou prospecta empresas; o time Bear conduz a venda e a entrega"],
    ["Como ganha", "Participação recorrente sobre os serviços contratados pela sua carteira", "Comissão por contrato fechado e recorrência enquanto o cliente permanecer"],
    ["Pré-requisito", "Registro ativo no CRC", "Nenhum registro profissional específico"],
    ["Apoio da Bear", "Plataforma, revisão técnica, especialistas por vertical e ERP", "Materiais, roteiros, propostas prontas e painel de indicações"],
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
    icon: "fa-calculator",
    tag: "Para contadores",
    name: "Business Partner Outsourcing",
    short: "Contador Parceiro",
    lead: "Para escritórios de contabilidade que querem oferecer mais serviços, ganhar escala e modernizar a operação sem perder o relacionamento com seus clientes.",
    headline: { h2: "Sua carteira com a<br><strong>estrutura e a tecnologia</strong><br>da Bear", p: "Você continua sendo o contador de confiança dos seus clientes. A Bear entra com plataforma, backoffice e especialistas para você atender mais e melhor." },
    numbers: partnerNumbers,
    about: "<strong>Escale o seu escritório</strong> sem aumentar<br>a estrutura com o <strong>Business Partner Outsourcing</strong>",
    diagram: {
      h3: "Você cuida do <strong>cliente</strong>.<br>Nós cuidamos do <strong>backoffice</strong>.",
      h6: "Seu escritório passa a contar com as mesmas áreas de apoio que sustentam a operação da Bear.",
      left: [["Financeiro", "BPO financeiro para a sua carteira"], ["Departamento pessoal", "Folha, eSocial e rotinas trabalhistas"], ["Revisão técnica", "Conferência de fechamentos e apurações"]],
      right: [["Tributário", "Planejamento, créditos e Reforma Tributária"], ["Tecnologia", "Plataforma Bear, BI e integração com ERPs"], ["Capacitação", "Treinamento técnico do seu time"]],
      bottom: ["Especialistas por vertical", "Apoio em clientes de setores complexos"],
    },
    call: "<strong>Backoffice, tecnologia e especialistas</strong><br>para o seu escritório crescer com margem",
    how: ["Ofereça BPO financeiro, folha, auditoria e planejamento tributário com a estrutura Bear", "Use a Plataforma Bear com a sua carteira, com dashboards e automação", "Compartilhe a operação de clientes complexos (Lucro Real, grupos econômicos)", "Receba participação recorrente sobre os serviços contratados"],
    who: ["Escritórios contábeis de qualquer porte", "Contadores com carteira ativa", "Registro ativo no CRC"],
    benefits: {
      h2: "Especialistas<br><strong>ao lado do seu escritório</strong>",
      p: "Mais serviços no seu portfólio, menos retrabalho na operação e a confiança de uma marca que investe em tecnologia.",
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
    icon: "fa-handshake",
    tag: "Para prospectores",
    name: "Business Partner",
    short: "Agente Prospector de Negócios",
    lead: "Para profissionais com bom relacionamento empresarial que querem indicar e prospectar clientes para a Bear e ser remunerados por isso.",
    headline: { h2: "Transforme o seu<br><strong>relacionamento</strong><br>em <strong>renda recorrente</strong>", p: "Você conecta empresários à Bear. Nosso time conduz a proposta, a venda e a entrega, e você é remunerado por cada contrato fechado." },
    numbers: partnerNumbers,
    about: "<strong>Indique, prospecte e ganhe</strong><br>com o programa <strong>Business Partner</strong>",
    diagram: {
      h3: "Você abre a <strong>porta</strong>.<br>Nós fazemos o <strong>resto</strong>.",
      h6: "Todo Business Partner conta com o apoio do nosso time comercial do primeiro contato ao contrato assinado.",
      left: [["Materiais de venda", "Apresentações, cases e roteiros prontos"], ["Qualificação", "Nosso time avalia cada oportunidade"], ["Proposta", "Especialistas montam a proposta sob medida"]],
      right: [["Negociação", "Apoio comercial na reunião com o cliente"], ["Painel do parceiro", "Indicações, contratos e comissões em tempo real"], ["Treinamento", "Serviços Bear e venda consultiva"]],
      bottom: ["Pagamento recorrente", "Comissão enquanto o cliente permanecer"],
    },
    call: "<strong>Apoio comercial completo</strong><br>para você focar no que faz de melhor: relacionamento",
    how: ["Indique empresas ou prospecte ativamente com o apoio do time comercial", "Use materiais, roteiros e propostas prontas", "Acompanhe suas indicações em um painel exclusivo", "Receba comissão por contrato fechado e recorrência enquanto o cliente permanecer"],
    who: ["Consultores, advogados e corretores", "Profissionais de vendas B2B", "Quem tem rede de contatos com empresários"],
    benefits: {
      h2: "Tudo o que você precisa<br><strong>para fechar negócios</strong>",
      p: "Você não precisa entender de contabilidade a fundo. Nosso time cuida da parte técnica; você cuida do relacionamento.",
      items: ["<strong>Comissão por contrato</strong> e <strong>recorrência</strong> enquanto o cliente permanecer.", "<strong>Kit comercial</strong> com apresentações, cases e roteiros de abordagem.", "<strong>Especialistas</strong> na reunião com o cliente quando você precisar.", "<strong>Painel do parceiro</strong> para acompanhar indicações e pagamentos."],
    },
    steps: [["Cadastro", "Preencha o formulário e fale conosco pelo WhatsApp."], ["Conversa inicial", "Entendemos seu perfil e sua rede de contatos."], ["Contrato", "Regras de indicação e comissões formalizadas."], ["Treinamento", "Serviços Bear, perfil de cliente ideal e abordagem."], ["Primeiras indicações", "Time comercial apoia suas primeiras oportunidades."], ["Recorrência", "Comissões mensais e evolução no programa."]],
    cta: "Sua rede de contatos vale mais do que você imagina. <strong>Fale agora com o time de parcerias</strong> pelo WhatsApp.",
    faq: [
      ["O que é o Business Partner?", "É o programa da Bear para profissionais que indicam ou prospectam empresas. Você faz a conexão; o time Bear conduz a venda e a entrega."],
      ["Preciso ser contador?", "Não. Buscamos profissionais com boa rede de relacionamento empresarial, como consultores, advogados, corretores e vendedores B2B."],
      ["Como recebo a comissão?", "Você recebe por contrato fechado e uma recorrência enquanto o cliente permanecer na Bear. Percentuais e prazos são definidos em contrato."],
      ["Preciso vender ou só indicar?", "Os dois modelos são possíveis: você pode apenas indicar contatos ou prospectar ativamente com o apoio do nosso time."],
      ["Há custo para participar?", "Não. A adesão ao programa Business Partner não tem custo."],
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
