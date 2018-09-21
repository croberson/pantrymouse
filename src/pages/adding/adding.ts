import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Component({
    selector: 'page-adding',
    templateUrl: 'adding.html'
})
export class AddingPage {

    items: {
        data: {barcode: any, name: string},
        qty: number, exists: boolean
    }[] = [];

    _items: {
        data: {barcode: any, name: string},
        qty: number, exists: boolean
    }[] = [];

    itemsObservable: Observable<any>;

    constructor(public navCtrl: NavController,
                public httpClient: HttpClient,
                private barcodeScanner: BarcodeScanner,
                private sqlite: SQLite) {
    }

    public async scan() {
        this.barcodeScanner.scan().then(barcodeData => {

            //get an integer version of the barcode to be used for array indexing.
            var intBarcode = Number(barcodeData.text);

            //Check to see if barcode data is in the list already.
            if (!this._items.hasOwnProperty(intBarcode)) {

                //Data is not in list.
                //Check database.
                var item: any = this.getItem(barcodeData.text, "db");

                if (item) {
                    //Data is in the database.  add it to the list with the name
                    // this.zone.run(() => {
                    //     this.items.splice(intBarcode, 0, {
                    //         data: {
                    //             barcode: intBarcode,
                    //             name: item.name
                    //         },
                    //         qty: 1,
                    //         exists: true
                    //     });
                    // });
                    if (item.name != undefined) {
                        this._items[intBarcode] = {
                            data: {
                                barcode: intBarcode,
                                name: item.name
                            },
                            qty: 1,
                            exists: true
                        }
                    }
                } else {

                    //Data is not in the database.  Do an API call.
                    var item: any = this.getItem(intBarcode, "api");
                    // this.zone.run(() => {
                    //     this.items.splice(intBarcode, 0, {
                    //         data: {
                    //             barcode: intBarcode,
                    //             name: item.name,
                    //         },
                    //         qty: 1,
                    //         exists: false
                    //     });
                    // });
                    this._items[intBarcode] = {
                        data: {
                            barcode: intBarcode,
                            name: item.name
                        },
                        qty: 1,
                        exists: false
                    }
                }
            } else {
                //Data is already in the list. Increment it's qty by 1.
                this._items[intBarcode].qty++;

            }

            console.log("_items", this._items);

            for (var key in this._items) {
                console.log("key: ", key);
                if (this.items.indexOf(this._items[key]) == -1) {
                    this.items.push(this._items[key]);
                }
            }
        }).catch(err => {
            console.log('Could not scan: ', err);
        });
    }

    private getItem(barcode: any, method: string) {
        if (method == "db") {
            //Database check
            this.sqlite.create({
                name: 'data.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {
                    db.executeSql(`SELECT * FROM pantry_items WHERE barcode = ${barcode}`, <any>{})
                        .then((data) => {
                            console.log(data.rows.item(0));
                            return data.rows.item(0);
                        })
                        .catch(e => console.log(e));
                })
                .catch(e => console.log(e));
        } else {
            //API call
            //let headers: any = new HttpHeaders().set('Content-Type', 'text/plain').set('Access-Control-Allow-Origin', '*');

            //this.itemsObservable = this.httpClient.get(`https://api.barcodelookup.com/v2/products?barcode=${barcode}&formatted=n&key=5fi2f2uq2271jpt19bscxzi0ps3vih`, headers);

            //this.itemsObservable.subscribe(data => {
            //    console.log("from api: ", data);
            //});

            //dummy data
            let inventory: any[] = [];
            inventory[21000026753] = {text: "021000026753", type: "_", name: "Miracle Whip"};
            inventory[72486002205] = {text: "072486002205", type: "_", name: "Jiffy Corn Muffin Mix"};
            inventory[44300093003] = {text: "044300093003", type: "_", name: "Refried Beans"};
            inventory[13300579022] = {text: "013300579022", type: "_", name: "Banana Nut Muffin Mix"};
            inventory[51000015877] = {text: "051000015877", type: "_", name: "Tomato Bisque"};

            return(inventory[barcode]);
        }
    }

    public add(list){
        console.log(list);
        //this.navCtrl.push(AddingPage);
    }

}

