import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})

export class Toast {

  @Input() message = '';
  @Input() type = 'success';
}