import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // ✅ URL base para o back-end, com a porta e o prefixo /api
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any> {
    // ✅ URL a rota do back-end
    return this.http.get(`${this.apiUrl}/usuarios`);
  }

  criarUsuario(usuario: any): Observable<any> {
    // ✅ URL para a rota do back-end
    return this.http.post(`${this.apiUrl}/usuarios`, usuario);
  }

  atualizarUsuario(id: string, usuario: any): Observable<any> {
    // ✅ URL para a rota do back-end
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, usuario);
  }

  deletarUsuario(id: string): Observable<any> {
    // ✅ URL para a rota do back-end
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }

  getMetricas(): Observable<any> {
    // ✅ URL para a rota do back-end
    return this.http.get(`${this.apiUrl}/metricas`);
  }
}
