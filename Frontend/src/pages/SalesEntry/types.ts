export interface SalesEntry {
  _id: string;
  customerID: String;
  billNo: String;
  date: Date;
  amount: Number;
  vat: Number;
  discount: Number;
  discountType: String;
  itemDescription: String;
  netTotalAmount: Number;
  billAttachment: String;
  fiscalYear: String;
  
}

