import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {Component} from '@angular/core';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {HttpClient} from '@angular/common/http';
import {PantryItem} from "../../lib/models/pantry_item_model";
import {ToastController} from 'ionic-angular';
import {NavController, NavOptions, ViewController} from 'ionic-angular';
import {PantryPage} from "../pantry/pantry";


@Component({
    selector: 'page-adding',
    templateUrl: 'adding.html'
})
export class AddingPage {

    //this will be displayed on the page
    items: {item: PantryItem, existsInDb: boolean}[] = [];

    //this will be used to "operate on"
    _items: {item: PantryItem, existsInDb: boolean}[] = [];

    displayCounts: number[] = [];


    constructor(public httpClient: HttpClient,
                private barcodeScanner: BarcodeScanner,
                private sqlite: SQLite,
                public toastCtrl: ToastController,
                public navCtrl: NavController,
                public viewCtrl: ViewController) {
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
                    this.incrementDisplayCount(intBarcode);

                } else {
                    //Data is not in list.  Get from database or api.
                    this.getItem(barcodeData.text);
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

    incrementDisplayCount(barcode) {
        if(typeof this.displayCounts[barcode] === 'undefined') {
            this.displayCounts[barcode] = 1;
        } else {
            this.displayCounts[barcode] += 1;
        }
    }

    decrementDisplayCount(barcode) {
        if(typeof this.displayCounts[barcode] === 'undefined') {
            this.displayCounts[barcode] = 0;
        } else {
            if(this.displayCounts[barcode] <= 0) {
                this.displayCounts[barcode] = 0;
            } else {
                this.displayCounts[barcode] -= 1;
            }
        }
    }

    private addToList(item: PantryItem, existsInDb: boolean) {
        var intBarcode = Number(item.upca);
        this._items[intBarcode] = {item, existsInDb: existsInDb};
    }

    public updateDisplayList() {
        for (var key in this._items) {
            if (this.items.indexOf(this._items[key]) == -1) {
                //its not in the list, so add it.
                this.items.push(this._items[key]);
            }
        }
    }

    private getItem(barcode: string) {
        //Database check
        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                db.executeSql(`SELECT * FROM pantry_items WHERE upca = "${barcode}"`, <any>{})
                    .then((response) => {
                        if (response.rows.length > 0) {
                            let item = response.rows.item(0); //using 0 for index because we are expecitng just 1.
                            let pantryItem: PantryItem = new PantryItem();
                            pantryItem.createFromDb(item);

                            //Data is in the db.  Increment the count and add it to the list of stuff to be added.
                            pantryItem.qty++;
                            this.incrementDisplayCount(barcode);

                            //add to the list and then update the display list
                            this.addToList(pantryItem, true);
                            this.updateDisplayList();

                        } else {
                            //Data is not in the database.  Do an API call to get its data.
                            this.httpClient.get(`https://search.mobile.walmart.com/v1/products-by-code/UPC/${barcode}?storeId=1`).subscribe(
                                data => {
                                    console.log(data);
                                    //extract the data we want
                                    let newItem: PantryItem = new PantryItem();
                                    newItem.createFromWalmart(data);

                                    //put 1 for the count
                                    this.incrementDisplayCount(barcode);

                                    //add to the list and then update the display list
                                    this.addToList(newItem, false);
                                    this.updateDisplayList();
                                },
                                error => {
                                    console.log('oops', error.error.error.diagnosticMessage);
                                    const toast = this.toastCtrl.create({
                                        message: error.error.error.diagnosticMessage,
                                        duration: 3000
                                    });
                                    toast.present();
                                }
                            );
                        }
                    })
                    .catch(e => console.log(e));
            })
            .catch(e => console.log(e));
    }

    public remove(barcode) {
        debugger;
        if(barcode in this.items) {
            delete this.items[barcode];
        }

        if(barcode in this._items) {
            delete this._items[barcode];
        }

        if(barcode in this.displayCounts) {
            delete this.displayCounts[barcode];
        }
    }

    public save() {
        console.log("adding these: ", this.items);

        for (var key in this.items) {
            let qry: string = ``;
            let values: any[] = [];

            //Save the items to the database
            if (!this.items[key].existsInDb) {
                //if not already in db, do an insert
                qry = `
                    INSERT INTO pantry_items 
                    (wupc, upca, ean13, walmart_product_id, name, qty, threshold, thumbnail_image_url)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
                values = [
                    this.items[key].item.wupc,
                    this.items[key].item.upca,
                    this.items[key].item.ean13,
                    this.items[key].item.walmart_product_id,
                    this.items[key].item.name,
                    this.items[key].item.qty,
                    this.items[key].item.threshold,
                    this.items[key].item.thumbnail_image_url
                ];
            } else {
                //if already in db, do an update
                qry = `
                    UPDATE pantry_items 
                    SET
                        wupc = ?, 
                        upca = ?, 
                        ean13 = ?, 
                        walmart_product_id = ?, 
                        name = ?, 
                        qty = ?, 
                        threshold = ?, 
                        thumbnail_image_url = ?
                    WHERE
                        id = ?`;
                values = [
                    this.items[key].item.wupc,
                    this.items[key].item.upca,
                    this.items[key].item.ean13,
                    this.items[key].item.walmart_product_id,
                    this.items[key].item.name,
                    this.items[key].item.qty,
                    this.items[key].item.threshold,
                    this.items[key].item.thumbnail_image_url,
                    this.items[key].item.id
                ];
            }

            this.sqlite.create({
                name: 'data.db',
                location: 'default'
            })
                .then((db: SQLiteObject) => {
                    db.executeSql(qry, values).then(res => {
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
        const toast = this.toastCtrl.create({
            message: 'Items saved to pantry.',
            duration: 3000
        });
        toast.present();

        this.navCtrl.pop();
    }

}

