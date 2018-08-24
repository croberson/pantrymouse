import { Component } from '@angular/core';

// Import pages for tabs here.  Good practice:  Alphabetical order.
import { ListsPage } from '../lists/lists';
import { PantryPage } from '../pantry/pantry';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tabRootPantry = PantryPage;
  tabRootLists  = ListsPage;
  // Add more tabs here

  constructor() {

  }
}
