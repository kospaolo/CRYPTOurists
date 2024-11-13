export class Article {
  id: number;
  type: string;
  address: string;
  price: number

  constructor(id: number, type: string, address: string, price: number) {
    this.id = id;
    this.type = type;
    this.address = address;
    this.price = price;
  }
}
