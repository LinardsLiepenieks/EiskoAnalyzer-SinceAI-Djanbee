// Symbol types and data models for electrical diagram analysis

export interface Symbol {
  id: string;
  name: string;
  category: SymbolCategory;
  iconName?: string; // Will be populated when icons are added
  description?: string;
}

export enum SymbolCategory {
  SWITCH = 'SWITCH',
  RELAY = 'RELAY',
  FUSE = 'FUSE',
  PROTECTION = 'PROTECTION',
  CONTACTOR = 'CONTACTOR',
  MOTOR = 'MOTOR',
  TRANSFORMER = 'TRANSFORMER',
  MEASUREMENT = 'MEASUREMENT',
  INDICATOR = 'INDICATOR',
  OTHER = 'OTHER',
}

// Symbol definitions based on the PDF document
export const SYMBOLS: Symbol[] = [
  // Switches
  { id: 'S', name: 'Kytkin (Switch)', category: SymbolCategory.SWITCH },
  {
    id: 'SA',
    name: 'Hätäseis-kytkin (Emergency stop switch)',
    category: SymbolCategory.SWITCH,
  },
  {
    id: 'SB',
    name: 'Painonappi (Push button)',
    category: SymbolCategory.SWITCH,
  },
  {
    id: 'SF',
    name: 'Turvakytkin (Safety switch)',
    category: SymbolCategory.SWITCH,
  },
  {
    id: 'SK',
    name: 'Pääkytkin (Main switch)',
    category: SymbolCategory.SWITCH,
  },
  {
    id: 'SL',
    name: 'Rajankytkin (Limit switch)',
    category: SymbolCategory.SWITCH,
  },
  {
    id: 'SP',
    name: 'Paine-/tyhjiökytkin (Pressure/vacuum switch)',
    category: SymbolCategory.SWITCH,
  },
  {
    id: 'SQ',
    name: 'Asentokytkin (Position switch)',
    category: SymbolCategory.SWITCH,
  },
  {
    id: 'SS',
    name: 'Valintakytkin (Selector switch)',
    category: SymbolCategory.SWITCH,
  },
  {
    id: 'ST',
    name: 'Lämpötilakytkin (Temperature switch)',
    category: SymbolCategory.SWITCH,
  },

  // Relays
  { id: 'K', name: 'Rele (Relay)', category: SymbolCategory.RELAY },
  {
    id: 'KA',
    name: 'Virta-/jänniterele (Current/voltage relay)',
    category: SymbolCategory.RELAY,
  },
  { id: 'KT', name: 'Aikarele (Time relay)', category: SymbolCategory.RELAY },

  // Fuses and Protection
  { id: 'F', name: 'Sulake (Fuse)', category: SymbolCategory.FUSE },
  {
    id: 'FA',
    name: 'Ylivirtasuoja (Overcurrent protection)',
    category: SymbolCategory.PROTECTION,
  },
  {
    id: 'FV',
    name: 'Ylijännitesuoja (Overvoltage protection)',
    category: SymbolCategory.PROTECTION,
  },

  // Contactors
  {
    id: 'KM',
    name: 'Kontaktori (Contactor)',
    category: SymbolCategory.CONTACTOR,
  },

  // Motors
  { id: 'M', name: 'Moottori (Motor)', category: SymbolCategory.MOTOR },

  // Transformers
  {
    id: 'T',
    name: 'Muuntaja (Transformer)',
    category: SymbolCategory.TRANSFORMER,
  },
  {
    id: 'TA',
    name: 'Virtamuuntaja (Current transformer)',
    category: SymbolCategory.TRANSFORMER,
  },
  {
    id: 'TV',
    name: 'Jännitemuuntaja (Voltage transformer)',
    category: SymbolCategory.TRANSFORMER,
  },

  // Measurement and Indicators
  { id: 'P', name: 'Mittari (Meter)', category: SymbolCategory.MEASUREMENT },
  {
    id: 'PA',
    name: 'Amperimittari (Ammeter)',
    category: SymbolCategory.MEASUREMENT,
  },
  {
    id: 'PV',
    name: 'Volttimittari (Voltmeter)',
    category: SymbolCategory.MEASUREMENT,
  },
  {
    id: 'PW',
    name: 'Wattimittari (Wattmeter)',
    category: SymbolCategory.MEASUREMENT,
  },
  {
    id: 'H',
    name: 'Merkinantolaite (Signaling device)',
    category: SymbolCategory.INDICATOR,
  },
  {
    id: 'HL',
    name: 'Merkkivalo (Indicator light)',
    category: SymbolCategory.INDICATOR,
  },
  {
    id: 'HA',
    name: 'Äänimerkki (Audible signal)',
    category: SymbolCategory.INDICATOR,
  },

  // Other components
  { id: 'R', name: 'Vastus (Resistor)', category: SymbolCategory.OTHER },
  {
    id: 'X',
    name: 'Liitinrivi (Terminal strip)',
    category: SymbolCategory.OTHER,
  },
  { id: 'XT', name: 'Testipiste (Test point)', category: SymbolCategory.OTHER },
  {
    id: 'Q',
    name: 'Katkaisija (Circuit breaker)',
    category: SymbolCategory.PROTECTION,
  },
];

// Helper function to get symbol by ID
export function getSymbolById(id: string): Symbol | undefined {
  return SYMBOLS.find((symbol) => symbol.id === id);
}

// Helper function to get symbols by category
export function getSymbolsByCategory(category: SymbolCategory): Symbol[] {
  return SYMBOLS.filter((symbol) => symbol.category === category);
}

// Type for extraction field data
export interface ExtractionData {
  pageNumber: number;
  rows: ExtractionRow[];
}

export interface ExtractionRow {
  id: string;
  icon?: string;
  nro: string;
  kuvateksti: string;
  suoja: string;
  kaapeli: string;
}
