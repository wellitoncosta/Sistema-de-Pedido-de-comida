import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './settings.html',
  styleUrls: ['./settings.css']
})
export class SettingsComponent {

  user: any = {
    nome: '',
    email: ''
  };
  novoNome = '';

  codigo = '';

  codigoVerificado = false;

  senhaAtual = '';

  novaSenha = '';

  confirmarSenha = '';

  codigoGerado = '';

  emailService = new EmailService();

  constructor(
    private translate: TranslateService
  ) {

      const idiomaSalvo =
        localStorage.getItem('lang') || 'pt';

      this.translate.use(idiomaSalvo);

      const userSalvo = localStorage.getItem('user');

      if(userSalvo){

        this.user = JSON.parse(userSalvo);
      }
    }

  salvarPerfil() {

    if(this.novoNome.trim() !== '') {

      this.user.nome = this.novoNome;

      localStorage.setItem(
        'user',
        JSON.stringify(this.user)
      );

      alert('Perfil atualizado!');
    }
  }

  async enviarCodigo() {

    console.log(localStorage.getItem('user'));

    const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

    const email = user.email;

    console.log(email);

    if(!email){

      alert('Email não encontrado');

      return;
    }

    this.codigoGerado = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    try {

      await this.emailService.enviarCodigo(
        email,
        this.codigoGerado
      );

      alert('Código enviado no email!');

    } catch(error){

      console.log(error);

      alert('Erro ao enviar email');
    }
  }

verificarCodigo() {

  if(this.codigo === this.codigoGerado){

    this.codigoVerificado = true;

    alert('Código correto!');

  } else {

    alert('Código inválido');
  }
}

    alterarSenha() {

      const user = JSON.parse(
        localStorage.getItem('user') || '{}'
      );

      const email = user.email;

      const senhaSalva = localStorage.getItem(
        'senha_' + email
      );

      console.log('EMAIL:', email);
      console.log('SENHA SALVA:', senhaSalva);
      console.log('SENHA DIGITADA:', this.senhaAtual);

      if(!senhaSalva){

        alert(
          'Nenhuma senha encontrada. Faça login novamente.'
        );

        return;
      }

      if(this.senhaAtual.trim() !== senhaSalva.trim()){

        alert('Senha atual incorreta');

        return;
      }

      if(this.novaSenha !== this.confirmarSenha){

        alert('As senhas não coincidem');

        return;
      }

      localStorage.setItem(
        'senha_' + email,
        this.novaSenha
      );

      alert('Senha alterada com sucesso!');

      this.senhaAtual = '';
      this.novaSenha = '';
      this.confirmarSenha = '';
    }

  mudarIdioma(idioma: string) {
  // 1. Muda o idioma no momento
    this.translate.use(idioma);
    
    // 2. Guarda para quando a página for recarregada
    localStorage.setItem('lang', idioma);

    // 3. Feedback visual
    const msg = idioma === 'pt' ? 'Idioma alterado.' : 'Language changed.';
    alert(msg);
  }
}