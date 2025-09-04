import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
@Component({
  selector: 'app-metricas',
  templateUrl: './metricas.html',
  styleUrls: ['./metricas.css'],
    standalone: true,
  imports: [CommonModule]
})
export class MetricasComponent implements OnInit {
  metricas: any = {};
  estadosKeys: string[] = [];
  faixaEtariaKeys: string[] = [];
  rendaKeys: string[] = [];
  escolaridadeKeys: string[] = [];
=======

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
>>>>>>> 993e2dbee4de8a918a4f0e4349848cf8ba9dd054

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
<<<<<<< HEAD
    this.usuarioService.getMetricas().subscribe(data => {
      this.metricas = data;
      this.estadosKeys = Object.keys(data.porEstado || {});
      this.faixaEtariaKeys = Object.keys(data.faixaEtaria || {});
      this.rendaKeys = Object.keys(data.renda || {});
      this.escolaridadeKeys = Object.keys(data.escolaridade || {});
    });
  }

  situacaoKeys(nivel: string): string[] {
    return Object.keys(this.metricas.escolaridade?.[nivel]?.situacoes || {});
  }
}
=======
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
>>>>>>> 993e2dbee4de8a918a4f0e4349848cf8ba9dd054
