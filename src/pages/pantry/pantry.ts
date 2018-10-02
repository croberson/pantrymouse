import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Item} from "../../lib/Item";
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {AddingPage} from "../adding/adding";
import {ToastController} from 'ionic-angular';
import {PantryItem} from "../../lib/PantryItem";

@Component({
  selector: 'page-pantry',
  templateUrl: 'pantry.html'
})
export class PantryPage {
  displayItems: PantryItem[] = [];

  constructor(public navCtrl: NavController,
              private sqlite: SQLite,
              private toastCtrl: ToastController) {

    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        // db.executeSql(`DROP TABLE IF EXISTS pantry_items`, <any>{})
        //   .then(() => console.log('Table `pantry_items` dropped.'))
        //   .catch(e => console.log(e));

        db.executeSql(`CREATE TABLE IF NOT EXISTS pantry_items(
          id INTEGER PRIMARY KEY,
          wupc VARCHAR(30),
          upca VARCHAR(30),
          ean13 VARCHAR(30),
          walmart_product_id VARCHAR(30),
          name CHAR(50),
          qty INT,
          thumbnail_image_url VARCHAR(256))`, <any>{})
          .then(() => console.log('Table `pantry_items` created.'))
          .catch(e => console.log(e));

      })
      .catch(e => console.log(e));

    this.getPantryItems();
    console.log(this.displayItems);
  }

  private getPantryItems() {
    //Database check
    this.sqlite.create({
      name: 'data.db',
      location: 'default'
    })
      .then((db: SQLiteObject) => {
        //Get them pantry items
        db.executeSql(`SELECT * FROM pantry_items`, <any>{})
          .then((response) => {
            for (let i = 0; i < response.rows.length; i++) {
              //add items to display array
              let item = response.rows.item(i);
              let pantryItem: PantryItem = new PantryItem();
              pantryItem.createFromDb(item);
              this.displayItems.push(pantryItem);
            }
          })
          .catch(e => {
            console.log(e);
            const toast = this.toastCtrl.create({
              message: e.message,
              duration: 3000
            });
            toast.present();
          });
      })
  }

  public addToPantry() {
    //Open up the adding page
    this.navCtrl.push(AddingPage);
  }
}

