import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import {
  RouterLink,
  RouterLinkActive,
  Router
} from '@angular/router';

import {
  LucideAngularModule,
  House,
  ClipboardList,
  Heart,
  Settings,
  FileSpreadsheet,
  LogOut
} from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone:true,

  imports:[

    CommonModule,
    RouterLink,
    RouterLinkActive,
    LucideAngularModule,
    TranslateModule
  ],

  templateUrl:'./sidebar.html',
  styleUrls:['./sidebar.css']
})

export class Sidebar {

  icons = {

    House,
    ClipboardList,
    Heart,
    Settings,
    FileSpreadsheet,
    LogOut
  };

  constructor(
    private router:Router
  ){}

  logout(){

    localStorage.removeItem('user');

    this.router.navigate(['/']);
  }
}