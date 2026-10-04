export type Role = 'admin' | 'staff';

export interface User {
  id: string;
  name: string;
  pin: string;
  role: Role;
  active: boolean;
}

export type ProductType = 'part' | 'consumable' | 'accessory' | 'service_addon';

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  type: ProductType;
  forVehicle: string;
  price: number; // PHP integer
  cost: number; // PHP integer, hidden from staff
  unit: string;
  trackStock: boolean;
  stock: number; // derived cache
  reorderPoint: number;
  active: boolean;
}

export interface Service {
  id: string;
  name: string;
  desc: string;
  basePrice: number;
  laborMins: number;
  linkedProductIds: string[];
  active: boolean;
}

export interface InventoryLot {
  id: string;
  productId: string;
  qty: number;
  cost: number;
  receivedAt: string;
  supplier?: string;
}

export type MovementReason = 'sale' | 'restock' | 'adjust' | 'return' | 'damage';

export interface StockMovement {
  id: string;
  productId: string;
  delta: number;
  reason: MovementReason;
  refId?: string;
  at: string;
  byUserId: string;
}

export interface Sale {
  id: string;
  at: string;
  byUserId: string;
  customerName?: string;
  plate?: string;
  subtotal: number;
  discount: number;
  total: number;
  payMethod: 'cash' | 'gcash' | 'card';
  status: 'completed' | 'voided';
}

export interface SaleItem {
  id: string;
  saleId: string;
  kind: 'product' | 'service';
  refId: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

export type BlockType = 'hero' | 'notice' | 'hours' | 'contact';

export interface SiteBlock {
  id: string;
  type: BlockType;
  order: number;
  visible: boolean;
  data: Record<string, string>;
}

export interface SeedDB {
  version: number;
  products: Product[];
  services: Service[];
  lots: InventoryLot[];
  movements: StockMovement[];
  sales: Sale[];
  saleItems: SaleItem[];
  users: User[];
  siteBlocks: SiteBlock[];
}

export interface CartLine {
  kind: 'product' | 'service';
  refId: string;
  name: string;
  unitPrice: number;
  qty: number;
}
