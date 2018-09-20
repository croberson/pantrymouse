import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
import {SQLite} from '@ionic-native/sqlite';

//pages
import {AddingPage} from '../pages/adding/adding';
import {ListsPage} from '../pages/lists/lists';
import {PantryPage} from '../pages/pantry/pantry';
import {TabsPage} from '../pages/tabs/tabs';

//important elements
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

@NgModule({
    declarations: [
        MyApp,
        PantryPage,
        AddingPage,
        ListsPage,
        TabsPage
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
        TabsPage
    ],
    providers: [
        BarcodeScanner,
        SQLite,
        StatusBar,
        SplashScreen,
        {provide: ErrorHandler, useClass: IonicErrorHandler}
    ]
})
export class AppModule {
}
