import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
<<<<<<< HEAD
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  criarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  atualizarUsuario(id: string, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, usuario);
  }

  deletarUsuario(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getMetricas(): Observable<any> {
    return this.http.get<any>('http://localhost:3000/api/metricas');
  }
}
=======
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
>>>>>>> 993e2dbee4de8a918a4f0e4349848cf8ba9dd054
