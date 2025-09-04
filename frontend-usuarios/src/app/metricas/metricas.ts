import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario';
import { CommonModule } from '@angular/common';

// ✅ Definição da interface para as métricas
interface Metricas {
  total: number;
  genero: { masculino: number; feminino: number; outro: number };
  porEstado: { [key: string]: number };
  faixaEtaria: { [key: string]: number };
  renda: { [key: string]: { quantidade: number; percentual: number } };
  escolaridade: {
    [key: string]: {
      quantidade: number;
      percentual: number;
      situacoes: { [key: string]: number };
    };
  };
}

@Component({
  selector: 'app-metricas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './metricas.html',
  styleUrls: ['./metricas.css']
})
export class MetricasComponent implements OnInit {
  // ✅ A variável 'metricas' tem um tipo definido
  metricas: Metricas = {
    total: 0,
    genero: { masculino: 0, feminino: 0, outro: 0 },
    porEstado: {},
    faixaEtaria: {},
    renda: {},
    escolaridade: {}
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    // ✅ O tipo 'Metricas' aos dados recebidos
    this.usuarioService.getMetricas().subscribe({
      next: (data: Metricas) => {
        this.metricas = data;
      },
      error: (err) => {
        console.error('Erro ao carregar métricas:', err);
      }
    });
  }
}
