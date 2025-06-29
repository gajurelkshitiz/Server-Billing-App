export interface PurchaseEntry {
  _id: string;
  date: Date;
  amount: Number;
  itemDescription: String;
  Supplier: String;
  billAttachment: String;
  fiscalYear: String;
  paid:Boolean;
  dueAmount:Number;
}

