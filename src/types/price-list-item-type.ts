export interface IPriceListItem {
  id: string | number;
  productId: string | number;
  productName?: string;
  sku?: string;
  unitPrice: number;

}

export interface PriceListCustomer {
  id: string | number;
  name: string;
  description?: string;
  currencyCode: string;
  isDefault?: boolean;
  validFrom?: string | Date;
  validTo?: string | Date;
  items?: IPriceListItem[];
}
