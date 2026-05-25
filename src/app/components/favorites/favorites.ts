import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector:'app-favorites',
  standalone:true,
  imports:[
    CommonModule,
    TranslateModule
  ],

  templateUrl:'./favorites.html',
  styleUrls:['./favorites.css']
})

export class Favorites {

  favoritos:any[] = JSON.parse(

    localStorage.getItem('favoritos')
    || '[]'
  );
}