import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Component } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { HttpClient } from '@angular/common/http';
import { PantryItem } from "../../lib/PantryItem";
import { Utilities } from "../../lib/Utilities";
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { PantryPage } from "../pantry/pantry";


@Component({
  selector: 'page-adding',
  templateUrl: 'adding.html'
})
export class AddingPage {

  //this will be displayed on the page
  items: {item: PantryItem, existsInDb: boolean}[] = [];

  //this will be used to "operate on"
  _items: {item: PantryItem, existsInDb: boolean}[] = [];


  constructor(public httpClient: HttpClient,
              private barcodeScanner: BarcodeScanner,
              private sqlite: SQLite,
              private utilities: Utilities,
              public toastCtrl: ToastController,
              public navCtrl: NavController) {
  }

  public async scan() {
    console.log("scan initiated.");
    this.barcodeScanner.scan().then(barcodeData => {
      //If scan was successful, do stuff.
      if (barcodeData.cancelled == false) {
        //get an integer version of the barcode to be used for array indexing.
        var intBarcode = Number(barcodeData.text);

        //Check to see if barcode data is in the list already.
        if (this._items.hasOwnProperty(intBarcode)) {

          //Data is already in the list. Increment it's qty by 1.
          this._items[intBarcode].item.qty += 1;

        } else {
          //Data is not in list.
          //Check database.
          console.log("Data is not in the list already.");
          var item: PantryItem = this.getItem(barcodeData.text, "db");

          if (!this.utilities.isObjEmpty(item)) {
            //Data is in the db.  Increment the count and add it to the list of stuff to be added.
            item.qty++;
            this.addToList(item, true);

          } else {
            //Data is not in the database.  Do an API call to get its data.
            this.getItem(barcodeData.text, "api");
          }
        }

        //Display the updated list of items
        this.updateDisplayList();

      } else {
        console.log("cancelled");
        //TODO: stay on adding page when backing out of camera scan
      }
    }).catch(err => {
      console.log('Could not scan: ', err);
    });
  }

  private addToList(item: PantryItem, existsInDb: boolean) {
    var intBarcode = Number(item.upca);
    this._items[intBarcode] = { item, existsInDb: existsInDb };
  }

  public updateDisplayList() {
    for (var key in this._items) {
      if(this.items.indexOf(this._items[key]) == -1) {
        //its not in the list, so add it.
        this.items.push(this._items[key]);
      }
    }
  }

  private getItem(barcode: string, method: string): PantryItem {
    if (method == "db") {

      //Database check
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql(`SELECT * FROM pantry_items WHERE upca = ${barcode}`, <any>{})
            .then((data) => {
              console.log("data from db in get function: ", data.rows.item(0));
              return new PantryItem();
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    } else {
      //API call
      this.httpClient.get(`https://search.mobile.walmart.com/v1/products-by-code/UPC/${barcode}?storeId=1`).subscribe(response => {
        //extract the data we want
        let newItem: PantryItem = new PantryItem();
        newItem.createFromWalmart(response);

        //add to the list and then update the display list
        this.addToList(newItem, false);
        this.updateDisplayList();
      });

      return new PantryItem();
    }
    return new PantryItem();
  }

  public save() {
    console.log("adding these: ", this.items);

    for (var key in this.items) {
      //Save the items to the database
      if(!this.items[key].existsInDb) {
        this.items[key].item.id = null; //make extra sure the id = null if the item was never in the db
      }
      let qry: string = `INSERT OR REPLACE INTO pantry_items 
        (id, wupc, upca, ean13, walmart_product_id, name, qty, thumbnail_image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
      let values = [
        this.items[key].item.id,
        this.items[key].item.wupc,
        this.items[key].item.upca,
        this.items[key].item.ean13,
        this.items[key].item.walmart_product_id,
        this.items[key].item.name,
        this.items[key].item.qty,
        this.items[key].item.thumbnail_image_url
      ];

      //Database check
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          db.executeSql(qry, values)
            .then(res => {
              console.log(res);
              const toast = this.toastCtrl.create({
                message: 'Items saved to pantry.',
                duration: 3000
              });
              toast.present();
              this.navCtrl.push(PantryPage);
            }).catch(e => {
              console.log(e);
              const toast = this.toastCtrl.create({
                message: e.message,
                duration: 3000
              });
            toast.present();
            });
        }).catch(e => {
        console.log(e);
        const toast = this.toastCtrl.create({
          message: e.message,
          duration: 3000
        });
        toast.present();
      });
    }
  }

}

