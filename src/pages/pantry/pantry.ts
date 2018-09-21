import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
//import { Observable } from 'rxjs/Observable';
import {HttpClient} from '@angular/common/http';
import {Item} from "../../lib/Item";
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {AddingPage} from "../adding/adding";

@Component({
    selector: 'page-pantry',
    templateUrl: 'pantry.html'
})
export class PantryPage {
    // itemsObservable:    Observable<any>;
    displayArray: {"category": string, "items": Item[]}[] = [];

    constructor(public navCtrl: NavController,
                public httpClient: HttpClient,
                private barcodeScanner: BarcodeScanner,
                private sqlite: SQLite) {

        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        })
        .then((db: SQLiteObject) => {
            db.executeSql("CREATE TABLE IF NOT EXISTS pantry_items(" +
                     "id INT(10) PRIMARY KEY, " + 
                    "barcode CHAR(10), " + 
                    "barcode_type, " + 
                    "name CHAR(50), " + 
                    "qty INT)", <any>{})
                .then(() => console.log('Executed SQL'))
                .catch(e => console.log(e));
        })
        .catch(e => console.log(e));

        //this.itemsObservable = this.httpClient.get('/api/pantry');

        // this.itemsObservable.subscribe(data => {
        //   this.displayItemsArray.push(data);
        //   console.log(data);
        // });

        // Get items
        this.displayArray = [
            {
                "category": "SNACKS",
                "items": [{"id": 0, "name": "Twinkies", "qty": 1},
                    {"id": 1, "name": "Ding Dongs", "qty": 17},
                    {"id": 2, "name": "Oatmeal Pies", "qty": 4}]
            },

            {
                "category": "CONDIMENTS",
                "items": [{"id": 3, "name": "BBQ Sauce", "qty": 12},
                    {"id": 4, "name": "Mustard", "qty": 3},
                    {"id": 5, "name": "Catsup", "qty": 2}]
            },

            {
                "category": "CANNED VEGGIES",
                "items": [{"id": 6, "name": "sweet potatoes", "qty": 4},
                    {"id": 7, "name": "corn", "qty": 8},
                    {"id": 8, "name": "green beans", "qty": 7}]
            }
        ];
    }

    public addToPantry() {
        //Open up the adding page
        this.navCtrl.push(AddingPage);
    }

}

