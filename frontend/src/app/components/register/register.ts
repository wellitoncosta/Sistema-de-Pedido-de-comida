import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})

export class Register {

  nome = '';
  email = '';
  password = '';
  confirmPassword = '';

  errorMessage = '';
  successMessage = '';

  loading = false;

  constructor(
    private api: ApiService,
    private router: Router
  ) {}

  register() {
    this.errorMessage = '';
    
    if (!this.nome || !this.email || !this.password) {
      this.errorMessage = 'Todos os campos são obrigatórios.';
      return;
    }

    // VERIFICAÇÃO: O e-mail já existe?
    const usuarioExistente = localStorage.getItem('senha_' + this.email);
    if (usuarioExistente) {
      this.errorMessage = 'Este e-mail já está a ser utilizado.';
      return;
    }

    this.loading = true;
    this.api.register({ nome: this.nome, email: this.email, password: this.password }).subscribe({
      next: (res: any) => {
        this.loading = false;
        // Salva localmente para podermos recuperar a senha depois se precisarmos
        localStorage.setItem('senha_' + this.email, this.password);
        localStorage.setItem('user', JSON.stringify({ nome: this.nome, email: this.email }));
        
        alert('Conta criada com sucesso!');
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Erro no servidor ao criar conta.';
      }
    });
  }
}