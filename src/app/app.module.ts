import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { SQLite } from '@ionic-native/sqlite';
import { Utilities } from '../lib/Utilities';

//pages
import { AddingPage } from '../pages/adding/adding';
import { ListsPage } from '../pages/lists/lists';
import { PantryPage } from '../pages/pantry/pantry';
import { TabsPage } from '../pages/tabs/tabs';
import { ItemDetailsPage } from '../pages/pantry/item-details/item-details'

//important elements
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
    declarations: [
        MyApp,
        PantryPage,
        AddingPage,
        ListsPage,
        TabsPage,
        ItemDetailsPage
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(MyApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        PantryPage,
        AddingPage,
        ListsPage,
        TabsPage,
        ItemDetailsPage
    ],
    providers: [
        BarcodeScanner,
        SQLite,
        StatusBar,
        SplashScreen,
        Utilities,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
