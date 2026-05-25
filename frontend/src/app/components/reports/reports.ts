import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector:'app-reports',
  standalone:true,

  imports:[
    CommonModule,
    TranslateModule
  ],

  templateUrl:'./reports.html',
  styleUrls:['./reports.css']
})

export class Reports {

  pedidos:any[] = JSON.parse(

    localStorage.getItem('pedidos')
    || '[]'
  );

  exportCSV(){

    let csv =
    'ID,Data,Total\n';

    this.pedidos.forEach(

      (p:any)=>{

        csv +=
        `${p.id},${p.data},${p.total}\n`;
      }
    );

    const blob = new Blob(

      [csv],

      {
        type:'text/csv'
      }
    );

    const url =
    window.URL.createObjectURL(blob);

    const a =
    document.createElement('a');

    a.href = url;

    a.download =
    'relatorio_pedidos.csv';

    a.click();

    window.URL
    .revokeObjectURL(url);
  }
}
