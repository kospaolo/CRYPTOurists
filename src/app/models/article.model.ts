export class Article {
  id: number;
  name: string;
  price: number
  ownerAddress: string;

  constructor(id: number, type: string, address: string, price: number) {
    this.id = id;
    this.name = type;
    this.ownerAddress = address;
    this.price = price;
  }
}
