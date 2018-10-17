import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {NavParams} from 'ionic-angular';
import {PantryItem} from '../../../lib/models/pantry_item_model';
import {SQLite, SQLiteObject} from '@ionic-native/sqlite';
import {ToastController, AlertController} from 'ionic-angular';


@Component({
    selector: 'page-item-details',
    templateUrl: 'item-details.html'
})
export class ItemDetailsPage {

    mainItem: PantryItem;
    item: PantryItem;

    constructor(public viewCtrl: ViewController,
                public navParams: NavParams,
                private sqlite: SQLite,
                public toastCtrl: ToastController,
                private alertCtrl: AlertController) {

        this.mainItem = this.navParams.get('item');
        this.item = new PantryItem();
        this.item.copy(this.mainItem);  //copy of the main item so we don't change anything in pantry without saving
    }

    public saveItem() {
        let qry: string = `UPDATE pantry_items 
        SET wupc = ?, 
          upca = ?, 
          ean13 = ?, 
          walmart_product_id = ?, 
          name = ?, 
          qty = ?, 
          threshold = ?, 
          thumbnail_image_url = ?
        WHERE
          id = ?`;
        let values: any[] = [
            this.item.wupc,
            this.item.upca,
            this.item.ean13,
            this.item.walmart_product_id,
            this.item.name,
            this.item.qty,
            this.item.threshold,
            this.item.thumbnail_image_url,
            this.item.id
        ];

        this.sqlite.create({
            name: 'data.db',
            location: 'default'
        })
            .then((db: SQLiteObject) => {
                db.executeSql(qry, values)
                    .then(res => {
                        console.log(res);
                        const toast = this.toastCtrl.create({
                            message: 'Item updated.',
                            duration: 5000
                        });
                        toast.present();
                        this.item.badgeColorChange();
                        this.mainItem.copy(this.item);
                        this.close(true);

                    })
                    .catch(e => {
                        console.log(e);
                        const toast = this.toastCtrl.create({
                            message: e.message,
                            duration: 5000
                        });
                        toast.present();
                    });
            }).catch(e => {
            console.log(e);
            const toast = this.toastCtrl.create({
                message: e.message,
                duration: 5000
            });

            toast.present();
        });
    }

    public removeFromPantry() : boolean {
        let alert = this.alertCtrl.create({
            title: 'Confirm remove',
            message: 'Are you sure you want to remove this item from your pantry?',
            buttons: [
                {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                    }
                },
                {
                    text: 'Remove',
                    handler: () => {
                        let qry: string = `DELETE FROM pantry_items WHERE id = ?`;
                        let values: any[] = [this.item.id];

                        this.sqlite.create({
                            name: 'data.db',
                            location: 'default'
                        }).then((db: SQLiteObject) => {
                            db.executeSql(qry, values)
                                .then(res => {
                                    console.log("1---");
                                    const toast = this.toastCtrl.create({
                                        message: 'Item removed from pantry.',
                                        duration: 5000
                                    });
                                    toast.present();
                                    this.close(true);
                                })
                                .catch(e => {
                                    console.log(e);
                                    const toast = this.toastCtrl.create({
                                        message: e.message,
                                        duration: 5000
                                    });
                                    toast.present();
                                });
                            console.log("2---");
                            }).then(() => {
                            console.log("3---");
                        }).catch(e => {
                            console.log(e);
                            const toast = this.toastCtrl.create({
                                message: e.message,
                                duration: 5000
                            });

                            toast.present();
                        });
                    }
                }
            ]
        });
        alert.present();

        return false;
    }

    changeNum(operation: string, valueName: string) {
        if (valueName == "qty") {
            // qty
            if (operation == "+") {
                this.item.qty++;
            } else {
                this.item.qty = this.item.qty > 0 ? this.item.qty - 1 : this.item.qty;
            }
        } else {
            // threshold
            if (operation == "+") {
                this.item.threshold++;
            } else {
                this.item.threshold = this.item.threshold > 0 ? this.item.threshold - 1 : this.item.threshold;
            }
        }
    }

    close(doRefresh: boolean = true) {
        this.viewCtrl.dismiss(doRefresh);
    }
}
