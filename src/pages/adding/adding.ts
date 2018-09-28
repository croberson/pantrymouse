import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {Component, NgZone} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpParams} from "@angular/common/http";
import {PantryItem} from "../../lib/PantryItem";
import {Utilities} from "../../lib/Utilities";


@Component({
  selector: 'page-adding',
  templateUrl: 'adding.html'
})
export class AddingPage {

  //this will be displayed on the page
  items: {item: PantryItem, existsInDb: boolean}[] = [];

  //this will be used to "operate on"
  _items: {item: PantryItem, existsInDb: boolean}[] = [];

  test: string = "the test of the century";

  itemsObservable: Observable<any>;


  constructor(public navCtrl: NavController,
              public httpClient: HttpClient,
              private barcodeScanner: BarcodeScanner,
              private sqlite: SQLite,
              private platform: Platform,
              private utilities: Utilities,
              private ngZone: NgZone) {
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
            //var item: PantryItem = this.getItem(barcodeData.text, "api");
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
      /*//barcode = '013300579022'; //test data
      this.itemsObservable = this.httpClient.get(`https://search.mobile.walmart.com/v1/products-by-code/UPC/${barcode}?storeId=1`);
      this.itemsObservable.subscribe(response => {
        //Extract
        let pantryItem: PantryItem = new PantryItem();
        pantryItem.createFromWalmart(response.data);

        //return pantryItem;

        //TODO: get this out of the promise and do it right!
        var intBarcode = Number(pantryItem.upca);
        this._items[intBarcode] = { item: pantryItem, existsInDb: false };
      });*/

      this.httpClient.get(`https://search.mobile.walmart.com/v1/products-by-code/UPC/${barcode}?storeId=1`).subscribe(response => {
        //extract the data we want
        let newItem: PantryItem = new PantryItem();
        newItem.createFromWalmart(response);

        //add to the list and then update the display list
        this.addToList(newItem, false);
        this.updateDisplayList();
      });

      return new PantryItem();

      //dummy data
      // let inventory: any[] = [];
      // inventory[21000026753] = {text: "021000026753", type: "_", name: "Miracle Whip"};
      // inventory[72486002205] = {text: "072486002205", type: "_", name: "Jiffy Corn Muffin Mix"};
      // inventory[44300093003] = {text: "044300093003", type: "_", name: "Refried Beans"};
      // inventory[13300579022] = {text: "013300579022", type: "_", name: "Banana Nut Muffin Mix"};
      // inventory[51000015877] = {text: "051000015877", type: "_", name: "Tomato Bisque"};
      //
      // return(inventory[barcode]);
    }
    return new PantryItem();
  }

  public save(data) {
    console.log("adding these: ", data);

    //Save the items to the database


    //Reload the
    //this.navCtrl.push(AddingPage);
  }

}

