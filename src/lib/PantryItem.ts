export class PantryItem {
  id: number;
  wupc: string;
  upca: string;
  ean13: string;
  walmart_product_id: string;
  name: string;
  qty: number;
  thumbnail_image_url: string;

  //takes an object straight from a Walmart api call
  public createFromWalmart(response: any) {
    this.id = null;
    this.wupc = response.data.common.productId.wupc;
    this.upca = response.data.common.productId.upca;
    this.ean13 = response.data.common.productId.ean13;
    this.walmart_product_id = response.data.common.productId.productId;
    this.name = response.data.common.name;
    this.qty = 1;
    this.thumbnail_image_url = response.data.common.thumbnailImageUrl;
  }

  public createFromDb(data) {
    this.id = data.id;
    this.wupc = data.wupc;
    this.upca = data.upca;
    this.ean13 = data.ean13;
    this.walmart_product_id = data.walmart_product_id;
    this.name = data.name;
    this.qty = data.qty;
    this.thumbnail_image_url = data.thumbnail_image_url;
  }
}
