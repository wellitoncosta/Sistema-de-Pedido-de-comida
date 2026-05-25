import { Component } from '@angular/core';

@Component({
  selector: 'app-favorites',
  standalone: true,
  template: `
    <div class="container">
      <h1>❤️ Favoritos</h1>
      <p>Seus favoritos aparecerão aqui...</p>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
    }
  `]
})
export class FavoritesComponent {}
