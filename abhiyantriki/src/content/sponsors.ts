export interface Sponsor {
  name: string;
  category: 'Defense & Institutional' | 'Corporate & Industry' | 'Media & Community';
  role?: string;
  tier?: string;
}

export const INSTITUTIONAL_PARTNERS: Sponsor[] = [
  { name: "Indian Navy", category: "Defense & Institutional", role: "Armed Forces Partner" },
  { name: "Indian Army", category: "Defense & Institutional", role: "Armed Forces Partner" },
  { name: "Indian Air Force", category: "Defense & Institutional", role: "Armed Forces Partner" },
  { name: "ISRO", category: "Defense & Institutional", role: "Space Technology Partner" },
  { name: "BARC", category: "Defense & Institutional", role: "Nuclear Research Partner" },
  { name: "NSG", category: "Defense & Institutional", role: "Tactical Defense Partner" },
  { name: "RAF", category: "Defense & Institutional", role: "Special Operations Partner" },
  { name: "IMD", category: "Defense & Institutional", role: "Meteorological Sciences Partner" },
  { name: "BDDS", category: "Defense & Institutional", role: "Explosive Neutralization Partner" },
  { name: "HAL", category: "Defense & Institutional", role: "Aeronautics Partner" }
];

export const CORPORATE_PARTNERS: Sponsor[] = [
  { name: "Hitachi", category: "Corporate & Industry" },
  { name: "TATA", category: "Corporate & Industry" },
  { name: "Vivo", category: "Corporate & Industry" },
  { name: "Boat", category: "Corporate & Industry" },
  { name: "Cadmatic", category: "Corporate & Industry" },
  { name: "Oracle Academy", category: "Corporate & Industry" },
  { name: "Grey Atom", category: "Corporate & Industry" },
  { name: "British Council", category: "Corporate & Industry" },
  { name: "Xiaomi", category: "Corporate & Industry" },
  { name: "UPL", category: "Corporate & Industry" },
  { name: "Bank of Baroda", category: "Corporate & Industry" },
  { name: "OLA", category: "Corporate & Industry" },
  { name: "Radio Mirchi", category: "Media & Community" },
  { name: "Maharashtra Times", category: "Media & Community" },
  { name: "Education Times", category: "Media & Community" },
  { name: "Balaji Wafers", category: "Corporate & Industry" },
  { name: "VLCC", category: "Corporate & Industry" }
];
