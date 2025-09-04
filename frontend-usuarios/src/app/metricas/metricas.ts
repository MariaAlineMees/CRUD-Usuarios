import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../services/usuario';
import { CommonModule } from '@angular/common';
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

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
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