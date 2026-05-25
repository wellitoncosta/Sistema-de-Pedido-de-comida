import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ThemeService } from '../../services/theme.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslateModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})

export class Login {

  email = '';
  password = '';
  showPassword = false;

  loading = false;
  errorMessage = '';

  constructor(
    private api: ApiService,
    private router: Router,
    public themeService: ThemeService
  ) {}


  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  login() {
  // 1. Reset imediato do erro para limpar mensagens antigas
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    // --- LOGICA DE ALTA VELOCIDADE (Verificação Local) ---
    // Procuramos se existe uma senha para este email no localStorage (vinda do Register ou Recover)
    const senhaSalvaLocal = localStorage.getItem('senha_' + this.email);

    if (senhaSalvaLocal) {
      if (this.password === senhaSalvaLocal) {
        // SUCESSO INSTANTÂNEO: Senha coincide com a local
        console.log('Login local bem-sucedido');
        
        // Recupera dados do user ou cria um objeto básico
        const userSalvo = JSON.parse(localStorage.getItem('user') || '{}');
        const userData = {
          nome: userSalvo.nome || 'Utilizador',
          email: this.email
        };

        localStorage.setItem('user', JSON.stringify(userData));
        this.router.navigate(['/app/dashboard']);
        return; // Para aqui, não precisa de chamar a API
      } else {
        // ERRO INSTANTÂNEO: E-mail existe mas a senha está errada
        this.errorMessage = 'Senha incorreta. Tente novamente.';
        return;
      }
    }

    // --- SE NÃO EXISTIR LOCALMENTE, CHAMA A API (Pode demorar mais) ---
    this.loading = true;
    this.api.login({
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.success) {
          localStorage.setItem('user', JSON.stringify(res.user));
          this.router.navigate(['/app/dashboard']);
        } else {
          // Erro vindo do servidor
          this.errorMessage = res.message || 'E-mail não encontrado no sistema.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Erro de rede. Verifique se o backend está ligado.';
      }
    });
  }
}