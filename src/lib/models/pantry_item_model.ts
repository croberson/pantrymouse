import { BaseModel } from "../../lib/models/base_model"

export class PantryItem{
  id: string;
  wupc: string;
  upca: string;
  ean13: string;
  walmart_product_id: string;
  name: string;
  qty: number;
  threshold: number;
  thumbnail_image_url: string;

  //props not in the db
  badgeColor: string = "normal";

  //takes an object straight from a Walmart api call
  public createFromWalmart(response: any) {
    this.id = null;
    this.wupc = response.data.common.productId.wupc;
    this.upca = response.data.common.productId.upca;
    this.ean13 = response.data.common.productId.ean13;
    this.walmart_product_id = response.data.common.productId.productId;
    this.name = response.data.common.name;
    this.qty = 1;
    this.threshold = 0;
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
    this.threshold = data.threshold;
    this.thumbnail_image_url = data.thumbnail_image_url;
  }

  public copy(data) {
    this.id = data.id;
    this.wupc = data.wupc;
    this.upca = data.upca;
    this.ean13 = data.ean13;
    this.walmart_product_id = data.walmart_product_id;
    this.name = data.name;
    this.qty = data.qty;
    this.threshold = data.threshold;
    this.thumbnail_image_url = data.thumbnail_image_url;
  }

  public badgeColorChange() {
    if(this.qty < this.threshold && this.qty > 0) {
      this.badgeColor = "low";
    } else if(this.qty <= 0) {
      this.badgeColor = "empty";
    } else {
      this.badgeColor = "normal";
    }
  }
}
