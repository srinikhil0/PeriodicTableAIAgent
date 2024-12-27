export interface Element {
    atomicNumber: number;
    symbol: string;
    name: string;
    atomicMass: number;
    category: string;
    block: string;
    group: number;
    period: number;
    electronConfiguration: string;
    oxidationStates: number[];
    electronegativity: number | null;
    atomicRadius: number | null;
    ionizationEnergy: number | null;
    density: number | null;
    meltingPoint: number | null;
    boilingPoint: number | null;
    discoveredBy: string;
    discoveryYear: number;
  }