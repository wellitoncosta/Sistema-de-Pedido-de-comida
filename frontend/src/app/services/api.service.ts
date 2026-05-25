import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  api = 'http://localhost/SistemaPedidoComida/backend';

  constructor(private http: HttpClient) {}

  getProdutos(): Observable<any> {

    return this.http.get(`${this.api}/api/produtos.php`);
  }

  getPedidos(): Observable<any> {

    return this.http.get(`${this.api}/api/pedidos.php`);
  }

  createPedido(data:any): Observable<any> {

    return this.http.post(`${this.api}/api/pedidos.php`, data);
  }

  exportCSV() {

    window.open(`${this.api}/reports/export.php`, '_blank');
  }
  login(data:any): Observable<any> {

  return this.http.post(
    `${this.api}/auth/login.php`,
    data
    );
    }

    register(data:any): Observable<any> {

    return this.http.post(
        `${this.api}/auth/register.php`,
        data
    );
    }

    recover(data:any): Observable<any> {

    return this.http.post(
        `${this.api}/auth/recover.php`,
        data
    );
    }

    criarPedido(data:any){

        return this.http.post(`${this.api}/api/pedidos.php`,data);
    }

    enviarCodigoAlteracao(email:any){

      return this.http.post(

        `${this.api}/auth/send-code.php`,
        { email }
      );
    }

    alterarSenha(data:any){

      return this.http.post(

        `${this.api}/auth/change-password.php`,
        data
      );
    }

}