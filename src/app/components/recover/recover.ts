import { Component, ChangeDetectorRef } from '@angular/core'; // Importado ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmailService } from '../../services/email.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './recover.html',
  styleUrls: ['./recover.css'],
  providers: [EmailService]
})
export class RecoverComponent {
  email: string = '';
  codigo: string = '';
  codigoGerado: string = '';
  novaSenha: string = '';
  confirmarSenha: string = '';
  
  isLoading: boolean = false;
  etapa: number = 1; 
  mensagemErro: string = '';

  constructor(
    private router: Router,
    private emailService: EmailService,
    private cdr: ChangeDetectorRef // Injetado aqui
  ) {}

  async enviarEmail() {
    if (!this.email) {
      this.mensagemErro = 'Por favor, introduza o seu e-mail.';
      return;
    }

    this.mensagemErro = '';
    this.isLoading = true;
    this.codigoGerado = Math.floor(100000 + Math.random() * 900000).toString();

    try {
      // Dispara o e-mail
      await this.emailService.enviarCodigo(this.email, this.codigoGerado);
      
      // SUCESSO: Mudamos os estados
      this.etapa = 2;
      this.isLoading = false;
      
      // FORÇAR O ANGULAR A ATUALIZAR A TELA
      this.cdr.detectChanges(); 
      
      console.log('Sucesso! Etapa atual:', this.etapa);
    } catch (error) {
      console.error('Erro no envio:', error);
      this.mensagemErro = 'Falha ao enviar e-mail. Verifique a sua conexão.';
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  verificarCodigo() {
    if (this.codigo === this.codigoGerado) {
      this.etapa = 3;
      this.mensagemErro = '';
      this.cdr.detectChanges();
    } else {
      this.mensagemErro = 'Código incorreto. Verifique o seu e-mail.';
    }
  }

  finalizarRedefinicao() {
    if (this.novaSenha !== this.confirmarSenha) {
      this.mensagemErro = 'As senhas não coincidem.';
      return;
    }
    localStorage.setItem('senha_' + this.email, this.novaSenha);
    alert('Senha redefinida com sucesso!');
    this.router.navigate(['/']);
  }

  voltarAoLogin() {
    this.router.navigate(['/']);
  }
}