// Catálogo inicial de produtos (RF004, RF006, RF007, RF008).
// O administrador pode cadastrar, alterar e remover itens (RF017–RF019);
// essas alterações ficam salvas pelo serviço em src/services/api.js.

export const CATEGORIAS = [
  'Sensores',
  'Controladores (CLP)',
  'Robótica',
  'Inversores e Motores',
  'IHM e Supervisão',
  'Atuadores',
]

export const PRODUTOS_INICIAIS = [
  {
    id: 1,
    nome: 'Sensor Indutivo SI-18',
    categoria: 'Sensores',
    resumo: 'Detecção de peças metálicas sem contato, ideal para linhas de montagem.',
    descricao:
      'Sensor de proximidade indutivo em corpo metálico M18, com alta repetibilidade e proteção contra curto-circuito. Indicado para contagem e posicionamento de peças metálicas em esteiras e máquinas.',
    caracteristicas: ['Corpo em latão niquelado', 'LED indicador de estado', 'Proteção contra inversão de polaridade'],
    especificacoes: {
      'Distância sensora': '8 mm',
      Alimentação: '10–30 Vcc',
      Saída: 'PNP NA',
      'Grau de proteção': 'IP67',
    },
  },
  {
    id: 2,
    nome: 'Sensor Fotoelétrico FX-200',
    categoria: 'Sensores',
    resumo: 'Detecção de objetos de qualquer material por feixe de luz.',
    descricao:
      'Sensor fotoelétrico do tipo difuso refletivo com ajuste de sensibilidade. Detecta caixas, embalagens e peças plásticas em processos de envase e logística interna.',
    caracteristicas: ['Ajuste de sensibilidade', 'Imune a luz ambiente', 'Conector M12'],
    especificacoes: {
      Alcance: 'até 2 m',
      Alimentação: '12–24 Vcc',
      'Tempo de resposta': '1 ms',
      'Grau de proteção': 'IP65',
    },
  },
  {
    id: 3,
    nome: 'CLP Compacto DT-1200',
    categoria: 'Controladores (CLP)',
    resumo: 'Controlador lógico programável para máquinas de pequeno e médio porte.',
    descricao:
      'CLP compacto com entradas e saídas integradas, comunicação Ethernet e programação em Ladder. Expansível por módulos, ideal para automatizar máquinas e pequenas linhas.',
    caracteristicas: ['Programação Ladder e blocos de função', 'Servidor web integrado', 'Relógio de tempo real'],
    especificacoes: {
      'Entradas digitais': '14',
      'Saídas digitais': '10 (relé)',
      Comunicação: 'Ethernet / Modbus TCP',
      Alimentação: '24 Vcc',
    },
  },
  {
    id: 4,
    nome: 'CLP Modular DT-3000',
    categoria: 'Controladores (CLP)',
    resumo: 'Plataforma modular para controle de processos complexos.',
    descricao:
      'Controlador modular de alto desempenho para processos contínuos e linhas completas. Suporta redundância, múltiplas redes industriais e integração com sistemas supervisórios.',
    caracteristicas: ['Até 32 módulos de expansão', 'Suporte a PROFINET e OPC UA', 'Troca de módulos a quente'],
    especificacoes: {
      'Memória de programa': '4 MB',
      'Tempo de ciclo': '0,1 ms / 1 k instruções',
      Comunicação: 'PROFINET, OPC UA, Modbus',
      Alimentação: '24 Vcc',
    },
  },
  {
    id: 5,
    nome: 'Robô Colaborativo CoBot C6',
    categoria: 'Robótica',
    resumo: 'Robô de 6 eixos que trabalha com segurança ao lado de pessoas.',
    descricao:
      'Braço robótico colaborativo com sensores de força em todas as juntas. Programação por demonstração (arrastar o braço) e aplicações em montagem, pick and place e inspeção.',
    caracteristicas: ['Parada automática ao detectar contato', 'Programação por arraste', 'Instalação em bancada'],
    especificacoes: {
      'Carga útil': '6 kg',
      Alcance: '900 mm',
      Repetibilidade: '± 0,03 mm',
      Eixos: '6',
    },
  },
  {
    id: 6,
    nome: 'Robô Industrial R-20',
    categoria: 'Robótica',
    resumo: 'Robô articulado para soldagem, paletização e manuseio de cargas.',
    descricao:
      'Robô industrial de alta velocidade para aplicações pesadas. Acompanha controlador dedicado e pode ser integrado a células com proteção perimetral.',
    caracteristicas: ['Alta velocidade', 'Montagem no piso ou teto', 'Pacotes para solda e paletização'],
    especificacoes: {
      'Carga útil': '20 kg',
      Alcance: '1.800 mm',
      Repetibilidade: '± 0,05 mm',
      Eixos: '6',
    },
  },
  {
    id: 7,
    nome: 'Inversor de Frequência IF-750',
    categoria: 'Inversores e Motores',
    resumo: 'Controle de velocidade de motores com economia de energia.',
    descricao:
      'Inversor de frequência para motores trifásicos, com controle vetorial e funções de economia de energia. Indicado para bombas, ventiladores e esteiras.',
    caracteristicas: ['Controle vetorial sem sensor', 'Filtro EMC integrado', 'Comunicação Modbus RTU'],
    especificacoes: {
      Potência: '7,5 kW',
      'Tensão de entrada': '380–440 Vca trifásico',
      'Faixa de frequência': '0–400 Hz',
      'Grau de proteção': 'IP20',
    },
  },
  {
    id: 8,
    nome: 'Servomotor SM-400',
    categoria: 'Inversores e Motores',
    resumo: 'Movimentos precisos para eixos de máquinas e posicionamento.',
    descricao:
      'Servomotor com encoder de alta resolução e servoacionamento dedicado. Ideal para máquinas de corte, embalagem e posicionamento preciso.',
    caracteristicas: ['Encoder absoluto 23 bits', 'Freio eletromagnético opcional', 'Autoajuste de ganhos'],
    especificacoes: {
      Potência: '400 W',
      'Rotação nominal': '3.000 rpm',
      'Torque nominal': '1,27 N·m',
      Encoder: 'Absoluto 23 bits',
    },
  },
  {
    id: 9,
    nome: 'IHM Touchscreen 7"',
    categoria: 'IHM e Supervisão',
    resumo: 'Interface de operação para acompanhar e comandar máquinas.',
    descricao:
      'Interface homem-máquina com tela sensível ao toque de 7 polegadas, alarmes, gráficos de tendência e acesso remoto. Compatível com os principais CLPs do mercado.',
    caracteristicas: ['Tela colorida 7"', 'Registro de alarmes e receitas', 'Acesso remoto via navegador'],
    especificacoes: {
      Tela: '7" TFT 800×480',
      Comunicação: 'Ethernet, RS-485',
      Alimentação: '24 Vcc',
      'Grau de proteção frontal': 'IP65',
    },
  },
  {
    id: 10,
    nome: 'Cilindro Pneumático CP-50',
    categoria: 'Atuadores',
    resumo: 'Atuador pneumático para movimentos lineares em máquinas.',
    descricao:
      'Cilindro pneumático de dupla ação com amortecimento regulável e sensores magnéticos de fim de curso. Aplicações em fixação, prensagem e transferência de peças.',
    caracteristicas: ['Dupla ação', 'Amortecimento regulável', 'Êmbolo magnético para sensores'],
    especificacoes: {
      Diâmetro: '50 mm',
      Curso: '100 mm',
      'Pressão de trabalho': '1–10 bar',
      Norma: 'ISO 15552',
    },
  },
]
