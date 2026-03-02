export interface ProtocolItem {
  id: string;
  name: string;
}

export interface ProtocolSection {
  id: string;
  name: string;
  items: ProtocolItem[];
}

export interface ProtocolTemplate {
  name: string;
  description: string;
  sections: ProtocolSection[];
}