import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
    selector: 'page-adding',
    templateUrl: 'adding.html'
})
export class AddingPage {

    barcodes: {data: any, qty: number}[] = [];

    constructor(public navCtrl: NavController,
                private barcodeScanner: BarcodeScanner) {

    }

    public scan() {
        this.barcodeScanner.scan().then(barcodeData => {
            console.log(barcodeData);

            //First, check the list to see if barcode is already there.  If it is, then update the count.
            //This means that we have multiples of the same item being added.
            // if (this.barcodes[<number>barcodeData.text] !== undefined) {
            //     var intBarcode = <number>barcodeData.text;
            //     this.barcodes[intBarcode] = barcodeData;
            // } else if (true) {
            //     //If it is not already in the list, then check the db to get its data.
            //     //Add its data to the list with a count of 1.
            //
            // } else if (true) {
            //     //If it is not in the list and it doesn't exist in the db, get the data from an api call
            //     //and add it to the list.
            // }
            //
            // //Now, we should have an array of items to add (barcode, name, category, qty, update? for each).
            // //We need to loop through and add/update to the database
            //
            //
            // //this is how you push it good.  Use it wisely.
            // this.barcodes.push(barcodeData);
        }).catch(err => {
            console.log('Could not scan: ', err);
        });
    }

    private containsObject(obj, list) {
        var i;
        for (i = 0; i < list.length; i++) {
            if (list[i] === obj) {
                return true;
            }
        }

        return false;
    }

}
