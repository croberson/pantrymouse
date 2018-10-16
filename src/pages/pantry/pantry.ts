import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {AddingPage} from "../adding/adding";
import {ToastController} from 'ionic-angular';
import {PantryItem} from "../../lib/models/pantry_item_model";
import {ItemDetailsPage} from "../pantry/item-details/item-details";
import {PopoverController} from 'ionic-angular';

@Component({
    selector: 'page-pantry',
    templateUrl: 'pantry.html'
})
export class PantryPage {
    displayItems: PantryItem[] = [];

    constructor(public navCtrl: NavController,
                private sqlite: SQLite,
                private toastCtrl: ToastController,
                public popoverCtrl: PopoverController) {

        // Do ya db stuff, yo.
        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                // //ALTERS
                // db.executeSql(`DROP TABLE pantry_items`, <any>{})
                //     .then(() => console.log('Table `pantry_items` dropped.'))
                //     .catch(e => console.log(e));

                db.executeSql(`
                    CREATE TABLE IF NOT EXISTS pantry_items(
                        id INTEGER PRIMARY KEY,
                        wupc VARCHAR(30),
                        upca VARCHAR(30),
                        ean13 VARCHAR(30),
                        walmart_product_id VARCHAR(30),
                        name CHAR(50),
                        qty INTEGER,
                        threshold INTEGER qty,
                        thumbnail_image_url VARCHAR(256))`, <any>{})
                    .then(() => {
                        console.log('Table `pantry_items` created.');
                    })
                // .then(() => this.getPantryItems())
                // .catch(e => console.log(e));
            })
            .catch(e => console.log(e));


    }

    private getPantryItems(reload: boolean = true) {
        // This reload boolean is to keep from loading the list twice when the ap loads
        if (reload)
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
                                if (this.displayItems.indexOf(pantryItem) == -1) {
                                    //determine badge color and then add to display array
                                    pantryItem.badgeColorChange();
                                    this.displayItems.push(pantryItem);
                                }
                            }
                        })
                        .catch(e => {
                            console.log(e);
                            const toast = this.toastCtrl.create({
                                message: e.message,
                                duration: 5000
                            });
                            toast.present();
                        });
                })
    }

    public addToPantry() {
        //Open up the adding page
        this.navCtrl.push(AddingPage);
    }

    ionViewWillEnter() {
        // refresh pantry list
        this.displayItems.length = 0;
        this.getPantryItems();
    }

    presentItemDetailsPopover(item) {
        let popover = this.popoverCtrl.create(ItemDetailsPage, {item}, {enableBackdropDismiss: false});
        let event = {
            target: {
                getBoundingClientRect: () => {
                    return {
                        top: '100',
                        bottom: 'auto'
                    }
                }
            }
        };
        popover.present({ev: event});
    }
}

