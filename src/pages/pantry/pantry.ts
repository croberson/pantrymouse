import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-pantry',
  templateUrl: 'pantry.html'
})
export class PantryPage {

  categoryIds:  number[] = [1, 2, 3, 4];
  categories:   string[] = [];

  constructor(public navCtrl: NavController) {

    //Loop through categories and translate from id to text for display
    this.categoryIds.forEach(function(id) {

      let category;

      switch(id) {
        case 1:
          category = "Breads";
          break;
        case 2:
          category = "Snacks"
          break;
        case 3:
          category = "Veggies"
          break;
        case 4:
          category = "Meats"
          break;
      }

      this.categories.push(category);
    }.bind(this));
  }

}
