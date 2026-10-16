export type Lang = 'it' | 'en';

export const LINKS = {
  linkedin: 'https://www.linkedin.com/in/emanuele-manniti-338360183/',
  github: 'https://github.com/LaFrasta',
  // TODO: replace with the real address before publishing
  email: 'mailto:tuo.indirizzo@email.it',
};

export type SkillLayer = 'frontend' | 'backend' | 'data' | 'platform';

export interface Skill {
  name: string;
  layer: SkillLayer;
  // true = listed in the LinkedIn "Competenze" section, false = named in the LinkedIn experience text
  primary: boolean;
}

export const SKILLS: Skill[] = [
  { name: 'React.js', layer: 'frontend', primary: true },
  { name: 'Next.js', layer: 'frontend', primary: true },
  { name: 'JavaScript', layer: 'frontend', primary: true },
  { name: 'HTML5', layer: 'frontend', primary: true },
  { name: 'CSS', layer: 'frontend', primary: true },
  { name: 'Redux Toolkit', layer: 'frontend', primary: false },
  { name: 'MUI', layer: 'frontend', primary: false },
  { name: 'Java', layer: 'backend', primary: true },
  { name: 'Spring Framework', layer: 'backend', primary: true },
  { name: 'Node.js', layer: 'backend', primary: true },
  { name: 'TypeScript', layer: 'backend', primary: false },
  { name: 'Express', layer: 'backend', primary: false },
  { name: 'Kafka', layer: 'backend', primary: false },
  { name: 'SQL', layer: 'data', primary: true },
  { name: 'PL/SQL', layer: 'data', primary: true },
  { name: 'Oracle', layer: 'data', primary: false },
  { name: 'MongoDB', layer: 'data', primary: false },
  { name: 'TypeORM', layer: 'data', primary: false },
  { name: 'OpenShift', layer: 'platform', primary: false },
  { name: 'Azure DevOps', layer: 'platform', primary: false },
  { name: 'AI Agents', layer: 'platform', primary: false },
  { name: 'Automation', layer: 'platform', primary: false },
];

export interface Stage {
  code: string;
  title: string;
  body: string;
  tech: string[];
}

export type ProjectId = 'codice3' | 'albion';

export interface ShowcaseProject {
  id: ProjectId;
  name: string;
  kicker: string;
  badge: string;
  tagline: string;
  body: string;
  specs: string[];
  tech: string[];
  domain: string;
  // null while the project is not publicly reachable
  url: string | null;
  cta: string;
  shots: string[];
  phone: string[];
}

export type MilestoneKind = 'edu' | 'cert' | 'job' | 'now';

export interface Milestone {
  year: string;
  date: string;
  kind: MilestoneKind;
  title: string;
  source: string;
  note: string;
}

export type AgentId = 'investigator' | 'tester' | 'reviewer' | 'docs';

export interface AgentScenario {
  // hour of the day when an automation raises this task for the agents
  hour: number;
  lane: string;
  alarm: string;
  task: string;
  logs: Record<AgentId, [string, string, string]>;
  result: string;
}

export interface AutomationLane {
  id: string;
  label: string;
  // hours of the day (0-24) when the job fires
  times: number[];
  log: string;
  layer: SkillLayer;
}

const LANE_TIMES = {
  backup: [2],
  e2e: [7, 19],
  sync: [8.5, 13.5],
  report: [9],
  health: [0, 3, 6, 9, 12, 15, 18, 21],
  build: [10.2, 11.7, 14.1, 16.8, 17.6],
  intake: [] as number[],
};

interface Copy {
  nav: { grid: string; stack: string; flow: string; agents: string; projects: string; log: string; contact: string };
  langLabel: string;
  hero: {
    role: string;
    line: string;
    short: string;
    editor: { typing: string; live: string; error: string; label: string; replay: string };
  };
  about: { title: string; paragraphs: string[] };
  stack: {
    title: string;
    intro: string;
    layers: Record<SkillLayer, string>;
  };
  flow: {
    title: string;
    role: string;
    company: string;
    period: string;
    place: string;
    intro: string;
    stages: Stage[];
  };
  agents: {
    title: string;
    intro: string;
    credit: string;
    creditSub: string;
    orchestrator: string;
    incoming: string;
    waiting: string;
    triggeredBy: string;
    status: { idle: string; running: string; done: string };
    roles: Record<AgentId, string>;
    scenarios: AgentScenario[];
    lanes: AutomationLane[];
    logTitle: string;
    logAgents: string;
  };
  projects: {
    title: string;
    intro: string;
    items: ShowcaseProject[];
  };
  log: { title: string; intro: string; kinds: Record<MilestoneKind, string>; milestones: Milestone[] };
  contact: {
    title: string;
    body: string;
    console: string;
    online: string;
    boot: [string, string];
    write: string;
    opened: string;
    mailOpened: string;
    form: { name: string; message: string; send: string; ready: string; prompt: string };
  };
}

const it: Copy = {
  nav: { grid: 'Inizio', stack: 'Stack', flow: 'Esperienza', agents: 'Agenti', projects: 'Progetti', log: 'Percorso', contact: 'Contatti' },
  langLabel: 'Lingua',
  hero: {
    role: 'Full Stack Software Engineer',
    line: 'Costruisco sistemi enterprise da capo a fondo: dai microservizi alle interfacce.',
    short: 'Costruisco sistemi enterprise da capo a fondo.',
    editor: { typing: 'scrivendo', live: 'live · modificabile', error: 'errore di sintassi', label: 'Codice della pagina: modificalo e la pagina si aggiorna', replay: 'Riscrivi da capo' },
  },
  about: {
    title: 'Chi sono',
    paragraphs: [
      'Sviluppatore full stack con 5 anni di esperienza su sistemi enterprise. Progetto e sviluppo architetture a microservizi, dall’integrazione tra sistemi fino alle interfacce che le persone usano ogni giorno.',
      'Stack: Java (Spring Boot 3, WebFlux), Node.js/TypeScript (Express, TypeORM, Mongoose), React (Redux Toolkit, MUI), Kafka, MongoDB, Oracle, OpenShift, Azure DevOps.',
      'Mi interessano l’architettura dei sistemi distribuiti, le performance e lo sviluppo assistito dall’AI: costruisco agenti AI e automazioni che si occupano di diagnosi, test e operatività al posto delle persone.',
    ],
  },
  stack: {
    title: 'Lo stack, come schema unifilare',
    intro: 'Le tecnologie con cui lavoro tutti i giorni. Cliccane una e ti faccio vedere un pezzo di codice, scritto come lo scriverei io.',
    layers: { frontend: 'Frontend', backend: 'Backend', data: 'Dati', platform: 'Piattaforma' },
  },
  flow: {
    title: 'Dall’integrazione all’interfaccia',
    role: 'Full Stack Software Engineer',
    company: 'Matrix Consulting Group Srl',
    period: 'set 2021 — oggi',
    place: 'Napoli · Ibrido · A tempo pieno',
    intro:
      'In consulenza per Accenture, sviluppo piattaforme enterprise a microservizi. Lavoro su tutto il percorso del dato: da come entra nel sistema a come arriva sullo schermo, passando per eventi, logica di business e persistenza.',
    stages: [
      {
        code: 'INT',
        title: 'Integrazione',
        body: 'Servizi Java 21 / Spring Boot 3 reattivi per lo scambio di messaggi con sistemi esterni, integrati con Kafka.',
        tech: ['Java 21', 'Spring Boot 3', 'WebFlux', 'XML'],
      },
      {
        code: 'EVT',
        title: 'Eventi',
        body: 'Microservizi Node.js/TypeScript event-driven: API gateway, orchestrazione, processi schedulati e notifiche real-time via WebSocket.',
        tech: ['Node.js', 'TypeScript', 'Express', 'Kafka', 'WebSocket'],
      },
      {
        code: 'LOG',
        title: 'Logica di business',
        body: 'Regole di dominio, validazioni ed elaborazioni automatiche scritte per essere leggibili e affidabili.',
        tech: ['TypeScript', 'Java'],
      },
      {
        code: 'DB',
        title: 'Dati',
        body: 'MongoDB e Oracle: modellazione, query e ottimizzazione delle performance su tabelle da milioni di righe.',
        tech: ['MongoDB', 'Oracle', 'TypeORM', 'Mongoose'],
      },
      {
        code: 'UI',
        title: 'Interfaccia',
        body: 'Frontend React 18 + TypeScript con Redux Toolkit/RTK Query, MUI e Webpack Module Federation.',
        tech: ['React 18', 'RTK Query', 'MUI', 'Module Federation'],
      },
      {
        code: 'OPS',
        title: 'Esercizio',
        body: 'Analisi e risoluzione di problemi in produzione: memory leak e OOM, contesa sui lock, servizi in restart. Rilasci su OpenShift con pipeline Azure DevOps.',
        tech: ['OpenShift', 'Azure DevOps'],
      },
      {
        code: 'AI',
        title: 'Sviluppo con l’AI',
        body: 'Agenti AI e automazioni progettati da me per diagnosi, test end-to-end, report e attività operative ripetitive.',
        tech: ['AI', 'Agenti', 'Automazione'],
      },
    ],
  },
  agents: {
    title: 'Automazioni e agenti AI',
    intro:
      'Mi piace far fare alle macchine il lavoro ripetitivo. Ho messo in piedi automazioni che controllano servizi, dati e rilasci a tutte le ore, e quando qualcosa non torna passano la palla ai miei agenti AI: trovano la causa, sistemano, provano che funzioni e aggiornano la documentazione. Qui sotto una giornata tipo.',
    credit: 'Li progetto, li scrivo e li metto in produzione',
    creditSub: 'dal controllo che trova il problema all’agente che lo risolve',
    orchestrator: 'Orchestratore',
    incoming: 'Compito in arrivo',
    waiting: 'In attesa di un compito dalle automazioni…',
    triggeredBy: 'innescato da',
    status: { idle: 'IN ATTESA', running: 'AL LAVORO', done: 'FATTO' },
    roles: {
      investigator: 'Indaga sugli errori',
      tester: 'Scrive ed esegue i test',
      reviewer: 'Rivede il codice',
      docs: 'Aggiorna la documentazione',
    },
    scenarios: [
      {
        hour: 11,
        lane: 'health',
        alarm: 'allarme: errore 500 su /api/reports',
        task: 'Errore 500 su /api/reports in produzione',
        logs: {
          investigator: ['Grep  logs/*.log "OutOfMemory"', 'Read  report.service.ts', 'causa: query senza limite'],
          tester: ['Write  reports.e2e.ts', 'Bash  npm run test:e2e', '38 test, tutti verdi'],
          reviewer: ['Read  diff (2 file)', 'Check  gestione errori', 'approvato, 1 suggerimento'],
          docs: ['Read  docs/reports.md', 'Edit  sezione paginazione', 'documentazione aggiornata'],
        },
        result: 'Fix pronta: causa trovata, test verdi, documentazione aggiornata.',
      },
      {
        hour: 15.5,
        lane: 'intake',
        alarm: 'nuova richiesta: export CSV',
        task: 'Nuova funzione: export CSV degli ordini',
        logs: {
          investigator: ['Grep  "orders" src/', 'Read  orders.controller.ts', 'punto di estensione trovato'],
          tester: ['Write  orders.export.e2e.ts', 'Bash  npm run test:e2e', '4 nuovi test, verdi'],
          reviewer: ['Read  diff (3 file)', 'Check  validazione input', 'approvato'],
          docs: ['Edit  openapi/orders.yaml', 'Edit  README.md', 'API documentata'],
        },
        result: 'Funzione pronta: codice, test e documentazione in un solo giro.',
      },
    ],
    lanes: [
      { id: 'health', label: 'Controllo salute dei servizi', times: LANE_TIMES.health, log: 'servizi ok, nessun allarme', layer: 'frontend' },
      { id: 'backup', label: 'Export e archiviazione dati', times: LANE_TIMES.backup, log: 'archivio notturno completato', layer: 'data' },
      { id: 'e2e', label: 'Test end-to-end nel browser', times: LANE_TIMES.e2e, log: 'flussi principali verificati', layer: 'frontend' },
      { id: 'sync', label: 'Allineamento dei repository', times: LANE_TIMES.sync, log: 'repository aggiornati in parallelo', layer: 'platform' },
      { id: 'report', label: 'Report giornaliero', times: LANE_TIMES.report, log: 'report pubblicato, differenze evidenziate', layer: 'data' },
      { id: 'build', label: 'Build e test a ogni push', times: LANE_TIMES.build, log: 'build verde, pronta al rilascio', layer: 'backend' },
      { id: 'intake', label: 'Nuove richieste', times: LANE_TIMES.intake, log: '', layer: 'platform' },
    ],
    logTitle: 'Registro del turno',
    logAgents: 'agenti',
  },
  projects: {
    title: 'Progetti',
    intro: 'Quello che costruisco quando nessuno me lo chiede. Nati dalla passione per i videogiochi.',
    items: [
      {
        id: 'codice3',
        name: 'Codice 3',
        kicker: 'Simulatore di emergenza',
        badge: 'Progetto personale · online',
        tagline: 'Simulatore di dispatching d’emergenza su mappa reale.',
        body: 'Rispondi alle chiamate, valuti la gravità con il triage e mandi le unità giuste sulle strade vere della città. Un mondo condiviso che continua a vivere anche a gioco chiuso: l’ho ideato, progettato e sviluppato da solo, dal motore di simulazione al sito.',
        specs: ['5 corpi da coordinare', '44 monumenti reali sulla mappa', '141 pezzi di equipaggiamento', 'mondo condiviso in tempo reale'],
        tech: ['React', 'TypeScript', 'MapLibre', 'deck.gl', 'three.js', 'Node.js', 'Socket.IO', 'MongoDB', 'Railway'],
        domain: 'codice3.com',
        url: 'https://codice3.com/',
        cta: 'Gioca su codice3.com',
        shots: ['Il sito: accesso alla centrale operativa', 'Una chiamata dall’inizio alla fine', 'I cinque corpi in campo', 'L’armeria: 141 pezzi', 'Le meraviglie del mondo sulla mappa'],
        phone: ['Il gioco su Roma', 'Il manuale operatore'],
      },
      {
        id: 'albion',
        name: 'Albion Companion',
        kicker: 'Strumenti per giocatori',
        badge: 'Progetto personale · online',
        tagline: 'Il compagno di mercato per Albion Online.',
        body: 'Prezzi di mercato in tempo reale, un calcolatore di rotte commerciali tra le città, un pianificatore di profitti, il Black Market, le build della community e le statistiche dei personaggi. Frontend, backend e bot Discord: tutto scritto da me, con un’interfaccia che riprende i materiali del gioco.',
        specs: ['prezzi di mercato live', 'calcolatore di rotte su canvas', 'pianificatore di profitti', 'bot Discord'],
        tech: ['React', 'TypeScript', 'Redux Toolkit', 'RTK Query', 'Canvas 2D', 'Node.js', 'Express', 'Discord', 'Railway'],
        domain: 'albion-companion-fe-collaudo.up.railway.app',
        url: 'https://albion-companion-fe-collaudo.up.railway.app/',
        cta: 'Visita il sito',
        shots: ['La Tavola: il mercato su un solo schermo', 'Rotte e capitale tra le città', 'Il catalogo di 9850 oggetti', 'Il Market Flipper', 'La mappa del mondo', 'Le build della community'],
        phone: [],
      },
    ],
  },
  log: {
    title: 'Il percorso',
    intro: 'Dalla prima riga di codice a oggi.',
    kinds: { edu: 'Formazione', cert: 'Certificazione', job: 'Lavoro', now: 'Oggi' },
    milestones: [
      { year: '2014', date: '2014', kind: 'edu', title: 'Inizio a programmare', source: 'Istituto Don Geremia Piscopo', note: 'Indirizzo Computer Programming: le prime basi di logica e codice.' },
      { year: '2018', date: 'feb 2018', kind: 'cert', title: 'IT Essentials', source: 'Cisco', note: 'Hardware, sistemi operativi e reti: come funziona la macchina sotto il codice.' },
      { year: '2018', date: 'mar 2018', kind: 'cert', title: 'C++', source: 'Cisco', note: 'Memoria, puntatori e programmazione a oggetti.' },
      { year: '2019', date: '2019', kind: 'edu', title: 'Diploma tecnico, Computer Programming', source: 'Istituto Don Geremia Piscopo', note: 'Cinque anni di informatica, dal 2014 al 2019.' },
      { year: '2021', date: 'giu 2021', kind: 'cert', title: 'Java Developer', source: 'Itconsulting', note: 'Java e programmazione a oggetti, il linguaggio con cui entro nel lavoro.' },
      { year: '2021', date: 'set 2021', kind: 'job', title: 'Software Engineer', source: 'Matrix Consulting Group', note: 'A tempo pieno: sistemi enterprise a microservizi, in consulenza per Accenture.' },
      { year: 'OGGI', date: 'oggi', kind: 'now', title: 'Full Stack Software Engineer', source: 'Matrix Consulting Group', note: 'Microservizi, interfacce, agenti AI e automazioni.' },
    ],
  },
  contact: {
    title: 'Chiudi il circuito',
    body: 'Cerchi uno sviluppatore che segua un sistema dal database all’interfaccia? Scegli un canale qui sotto.',
    console: 'em-console · napoli',
    online: 'ONLINE',
    boot: ['ciao, sono Emanuele.', 'scegli come contattarmi: basta un clic.'],
    write: 'Scrivimi',
    opened: 'aperto in una nuova scheda',
    mailOpened: 'apro il tuo programma di posta',
    form: { name: 'nome', message: 'messaggio', send: 'Invia', ready: 'messaggio pronto: lo trovi nel tuo programma di posta', prompt: 'scrivi qui il tuo messaggio, ti rispondo appena posso' },
  },
};

const en: Copy = {
  nav: { grid: 'Home', stack: 'Stack', flow: 'Experience', agents: 'Agents', projects: 'Projects', log: 'Path', contact: 'Contact' },
  langLabel: 'Language',
  hero: {
    role: 'Full Stack Software Engineer',
    line: 'I build enterprise systems end to end: from microservices to interfaces.',
    short: 'I build enterprise systems end to end.',
    editor: { typing: 'typing', live: 'live · editable', error: 'syntax error', label: 'Page source: edit it and the page updates', replay: 'Write it again' },
  },
  about: {
    title: 'About',
    paragraphs: [
      'Full stack developer with 5 years of experience on enterprise systems. I design and build microservice architectures, from system integration to the interfaces people use every day.',
      'Stack: Java (Spring Boot 3, WebFlux), Node.js/TypeScript (Express, TypeORM, Mongoose), React (Redux Toolkit, MUI), Kafka, MongoDB, Oracle, OpenShift, Azure DevOps.',
      'I care about distributed systems architecture, performance and AI-assisted development: I build AI agents and automations that take care of diagnosis, testing and operations so people don’t have to.',
    ],
  },
  stack: {
    title: 'The stack, as a single-line diagram',
    intro: 'The tech I work with every day. Click one and I’ll show you a bit of code, written the way I’d write it.',
    layers: { frontend: 'Frontend', backend: 'Backend', data: 'Data', platform: 'Platform' },
  },
  flow: {
    title: 'From integration to interface',
    role: 'Full Stack Software Engineer',
    company: 'Matrix Consulting Group Srl',
    period: 'Sep 2021 — present',
    place: 'Naples · Hybrid · Full-time',
    intro:
      'Consulting for Accenture, I build enterprise microservice platforms. I work along the whole path of the data: how it enters the system and how it reaches the screen, through events, business logic and persistence.',
    stages: [
      {
        code: 'INT',
        title: 'Integration',
        body: 'Reactive Java 21 / Spring Boot 3 services exchanging messages with external systems, integrated with Kafka.',
        tech: ['Java 21', 'Spring Boot 3', 'WebFlux', 'XML'],
      },
      {
        code: 'EVT',
        title: 'Events',
        body: 'Event-driven Node.js/TypeScript microservices: API gateway, orchestration, scheduled processes and real-time WebSocket notifications.',
        tech: ['Node.js', 'TypeScript', 'Express', 'Kafka', 'WebSocket'],
      },
      {
        code: 'LOG',
        title: 'Business logic',
        body: 'Domain rules, validations and automated processing written to be readable and reliable.',
        tech: ['TypeScript', 'Java'],
      },
      {
        code: 'DB',
        title: 'Data',
        body: 'MongoDB and Oracle: data modelling, queries and performance tuning on tables with millions of rows.',
        tech: ['MongoDB', 'Oracle', 'TypeORM', 'Mongoose'],
      },
      {
        code: 'UI',
        title: 'Interface',
        body: 'React 18 + TypeScript frontend with Redux Toolkit/RTK Query, MUI and Webpack Module Federation.',
        tech: ['React 18', 'RTK Query', 'MUI', 'Module Federation'],
      },
      {
        code: 'OPS',
        title: 'Operations',
        body: 'Production troubleshooting: memory leaks and OOM, lock contention, restarting services. Releases on OpenShift with Azure DevOps pipelines.',
        tech: ['OpenShift', 'Azure DevOps'],
      },
      {
        code: 'AI',
        title: 'Building with AI',
        body: 'AI agents and automations I designed for diagnosis, end-to-end testing, reports and repetitive operational work.',
        tech: ['AI', 'Agents', 'Automation'],
      },
    ],
  },
  agents: {
    title: 'Automation and AI agents',
    intro:
      'I like letting machines do the repetitive work. I’ve set up automations that check services, data and releases around the clock, and when something looks off they hand it over to my AI agents: they find the cause, fix it, check that it works and update the docs. Below, a typical day.',
    credit: 'I design them, write them and run them in production',
    creditSub: 'from the check that spots a problem to the agent that fixes it',
    orchestrator: 'Orchestrator',
    incoming: 'Incoming task',
    waiting: 'Waiting for a task from the automations…',
    triggeredBy: 'raised by',
    status: { idle: 'IDLE', running: 'WORKING', done: 'DONE' },
    roles: {
      investigator: 'Investigates errors',
      tester: 'Writes and runs tests',
      reviewer: 'Reviews the code',
      docs: 'Updates the docs',
    },
    scenarios: [
      {
        hour: 11,
        lane: 'health',
        alarm: 'alarm: 500 error on /api/reports',
        task: '500 error on /api/reports in production',
        logs: {
          investigator: ['Grep  logs/*.log "OutOfMemory"', 'Read  report.service.ts', 'cause: unbounded query'],
          tester: ['Write  reports.e2e.ts', 'Bash  npm run test:e2e', '38 tests, all green'],
          reviewer: ['Read  diff (2 files)', 'Check  error handling', 'approved, 1 suggestion'],
          docs: ['Read  docs/reports.md', 'Edit  pagination section', 'docs updated'],
        },
        result: 'Fix ready: root cause found, tests green, docs updated.',
      },
      {
        hour: 15.5,
        lane: 'intake',
        alarm: 'new request: CSV export',
        task: 'New feature: CSV export of orders',
        logs: {
          investigator: ['Grep  "orders" src/', 'Read  orders.controller.ts', 'extension point found'],
          tester: ['Write  orders.export.e2e.ts', 'Bash  npm run test:e2e', '4 new tests, green'],
          reviewer: ['Read  diff (3 files)', 'Check  input validation', 'approved'],
          docs: ['Edit  openapi/orders.yaml', 'Edit  README.md', 'API documented'],
        },
        result: 'Feature ready: code, tests and docs in a single pass.',
      },
    ],
    lanes: [
      { id: 'health', label: 'Service health checks', times: LANE_TIMES.health, log: 'all services healthy', layer: 'frontend' },
      { id: 'backup', label: 'Data export and archiving', times: LANE_TIMES.backup, log: 'nightly archive completed', layer: 'data' },
      { id: 'e2e', label: 'End-to-end browser tests', times: LANE_TIMES.e2e, log: 'core flows verified', layer: 'frontend' },
      { id: 'sync', label: 'Repository sync', times: LANE_TIMES.sync, log: 'repositories updated in parallel', layer: 'platform' },
      { id: 'report', label: 'Daily report', times: LANE_TIMES.report, log: 'report published, changes highlighted', layer: 'data' },
      { id: 'build', label: 'Build and test on every push', times: LANE_TIMES.build, log: 'build green, ready to ship', layer: 'backend' },
      { id: 'intake', label: 'New requests', times: LANE_TIMES.intake, log: '', layer: 'platform' },
    ],
    logTitle: 'Shift log',
    logAgents: 'agents',
  },
  projects: {
    title: 'Projects',
    intro: 'What I build when nobody asks me to. Born from a love of video games.',
    items: [
      {
        id: 'codice3',
        name: 'Codice 3',
        kicker: 'Emergency simulator',
        badge: 'Personal project · live',
        tagline: 'An emergency dispatch simulator on a real map.',
        body: 'You answer calls, triage them and send the right units down the city’s real streets. A shared world that keeps running even when the game is closed: I conceived, designed and built it on my own, from the simulation engine to the website.',
        specs: ['5 services to coordinate', '44 real landmarks on the map', '141 pieces of equipment', 'shared real-time world'],
        tech: ['React', 'TypeScript', 'MapLibre', 'deck.gl', 'three.js', 'Node.js', 'Socket.IO', 'MongoDB', 'Railway'],
        domain: 'codice3.com',
        url: 'https://codice3.com/',
        cta: 'Play on codice3.com',
        shots: ['The site: entering the control room', 'One call, start to finish', 'The five services', 'The armoury: 141 items', 'World landmarks on the map'],
        phone: ['The game over Rome', 'The operator manual'],
      },
      {
        id: 'albion',
        name: 'Albion Companion',
        kicker: 'Tools for players',
        badge: 'Personal project · live',
        tagline: 'The market companion for Albion Online.',
        body: 'Live market prices, a trade-route calculator between cities, a profit planner, the Black Market, community builds and character statistics. Frontend, backend and Discord bot, all written by me, with an interface built from the game’s own materials.',
        specs: ['live market prices', 'canvas route calculator', 'profit planner', 'Discord bot'],
        tech: ['React', 'TypeScript', 'Redux Toolkit', 'RTK Query', 'Canvas 2D', 'Node.js', 'Express', 'Discord', 'Railway'],
        domain: 'albion-companion-fe-collaudo.up.railway.app',
        url: 'https://albion-companion-fe-collaudo.up.railway.app/',
        cta: 'Visit the site',
        shots: ['The Table: the market on one screen', 'Routes and capital between cities', 'The 9,850-item catalogue', 'The Market Flipper', 'The world map', 'Community builds'],
        phone: [],
      },
    ],
  },
  log: {
    title: 'The path',
    intro: 'From the first line of code to today.',
    kinds: { edu: 'Education', cert: 'Certification', job: 'Work', now: 'Today' },
    milestones: [
      { year: '2014', date: '2014', kind: 'edu', title: 'I start programming', source: 'Istituto Don Geremia Piscopo', note: 'Computer Programming track: first foundations of logic and code.' },
      { year: '2018', date: 'Feb 2018', kind: 'cert', title: 'IT Essentials', source: 'Cisco', note: 'Hardware, operating systems and networks: the machine under the code.' },
      { year: '2018', date: 'Mar 2018', kind: 'cert', title: 'C++', source: 'Cisco', note: 'Memory, pointers and object-oriented programming.' },
      { year: '2019', date: '2019', kind: 'edu', title: 'Technical diploma, Computer Programming', source: 'Istituto Don Geremia Piscopo', note: 'Five years of computer science, 2014 to 2019.' },
      { year: '2021', date: 'Jun 2021', kind: 'cert', title: 'Java Developer', source: 'Itconsulting', note: 'Java and object-oriented programming, the language I started my career with.' },
      { year: '2021', date: 'Sep 2021', kind: 'job', title: 'Software Engineer', source: 'Matrix Consulting Group', note: 'Full-time: enterprise microservice systems, consulting for Accenture.' },
      { year: 'NOW', date: 'today', kind: 'now', title: 'Full Stack Software Engineer', source: 'Matrix Consulting Group', note: 'Microservices, interfaces, AI agents and automation.' },
    ],
  },
  contact: {
    title: 'Close the circuit',
    body: 'Looking for a developer who can own a system from the database to the interface? Pick a channel below.',
    console: 'em-console · naples',
    online: 'ONLINE',
    boot: ['hi, I’m Emanuele.', 'pick a way to reach me: one click is enough.'],
    write: 'Write to me',
    opened: 'opened in a new tab',
    mailOpened: 'opening your mail app',
    form: { name: 'name', message: 'message', send: 'Send', ready: 'message ready: you’ll find it in your mail app', prompt: 'write your message here, I’ll get back to you soon' },
  },
};

export const COPY: Record<Lang, Copy> = { it, en };
export type { Copy };
