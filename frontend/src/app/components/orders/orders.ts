import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector:'app-orders',
  standalone:true,
  imports:[
    CommonModule,
    TranslateModule
  ],

  templateUrl:'./orders.html',
  styleUrls:['./orders.css']
})

export class Orders {

  pedidos:any[] = JSON.parse(

    localStorage.getItem('pedidos')
    || '[]'
  );
}