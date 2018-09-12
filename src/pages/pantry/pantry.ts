import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Item } from "../../lib/Item";
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Component({
  selector: 'page-pantry',
  templateUrl: 'pantry.html'
})
export class PantryPage {
  // itemsObservable:    Observable<any>;
  displayArray:  {"category": string, "items": Item[]}[] = [];

  constructor(public navCtrl: NavController,
              public httpClient: HttpClient,
              private barcodeScanner: BarcodeScanner) {

    //this.itemsObservable = this.httpClient.get('/api/pantry');

    // this.itemsObservable.subscribe(data => {
    //   this.displayItemsArray.push(data);
    //   console.log(data);
    // });

    // Get items
    this.displayArray = [
      {"category": "snacks",
        "items":  [{"id": 0, "name": "Kara", "qty": 1},
                  {"id": 1, "name": "meat snacks", "qty": 17},
                  {"id": 2, "name": "sweet knees", "qty": 4}]},

      {"category": "condiments",
        "items":  [{"id": 3, "name": "magic sauce", "qty": 12},
                  {"id": 4, "name": "mustard", "qty": 3},
                  {"id": 5, "name": "catsup", "qty": 2}]},

      {"category": "canned veggies",
        "items":  [{"id": 6, "name": "sweet potatoes", "qty": 4},
                  {"id": 7, "name": "corn", "qty": 8},
                  {"id": 8, "name": "green beans", "qty": 7}]}
      ];
  }

  public addToPantry() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
    }).catch(err => {
      console.log('Could not scan: ', err);
    });
  }

}

