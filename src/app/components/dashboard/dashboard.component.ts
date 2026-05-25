import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service'; // ajusta o caminho se necessário
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Interface de Produto
export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  categoria: string;
  rating?: number;
  badge?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, TranslateModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // ----- ESTADO DA UI -----
  pesquisa: string = '';
  categoria: string = 'Todos';
  loading: boolean = false;
  telaAtiva: string = 'inicio';
  mostrarCarrinho: boolean = false;
  produtoSelecionado: Produto | null = null;
  mostrarCheckout: boolean = false;
  morada: string = '';
  pagamento: string = '';
  mostrarPerfilMenu: boolean = false;

  // ----- LISTAS -----
  categorias: string[] = ['Todos', 'Pratos', 'Bebidas', 'Sobremesas'];
  skeletons: number[] = [1, 2, 3, 4];
  carrinho: Produto[] = [];

  // ----- DADOS MOCK (substituir por chamadas reais ao backend) -----
  private todosProdutos: Produto[] = [
    {
      id: 1,
      nome: 'Muamba Tradicional',
      descricao: 'Galinha do mato cozinhada em óleo de palma com quiabos e especiarias angolanas.',
      preco: 8500,
      imagem_url: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=600',
      categoria: 'Pratos',
      rating: 4.9,
      badge: 'Mais Pedido'
    },
    {
      id: 2,
      nome: 'Mufete Premium',
      descricao: 'Peixe grelhado servido com feijão de óleo de palma, batata e farofa.',
      preco: 12200,
      imagem_url: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=600',
      categoria: 'Pratos',
      rating: 4.8
    },
    {
      id: 3,
      nome: 'Frango Grelhado',
      descricao: 'Frango completo grelhado na brasa com molho piri-piri e legumes da época.',
      preco: 6000,
      imagem_url: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?q=80&w=600',
      categoria: 'Pratos',
      rating: 4.7
    },
    {
      id: 4,
      nome: 'Grelhado PetiSko',
      descricao: 'Mix de carnes premium grelhadas na brasa com molho especial da casa.',
      preco: 15000,
      imagem_url: 'https://images.unsplash.com/photo-1544025162-d76538253773?q=80&w=600',
      categoria: 'Pratos',
      rating: 5.0
    },
    {
      id: 5,
      nome: 'Coca-Cola 350ml',
      descricao: 'Refrigerante gelado, perfeito para acompanhar qualquer refeição.',
      preco: 1200,
      imagem_url: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=600',
      categoria: 'Bebidas',
      rating: 4.5
    },
    {
      id: 6,
      nome: 'Sumo de Múcua',
      descricao: 'Sumo natural de baobab angolano, refrescante e cheio de vitaminas.',
      preco: 1500,
      imagem_url: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=600',
      categoria: 'Bebidas',
      rating: 4.6
    },
    {
      id: 7,
      nome: 'Gelado Chocolate',
      descricao: 'Sobremesa premium com cacau selecionado e uma textura cremosa irresistível.',
      preco: 1800,
      imagem_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=600',
      categoria: 'Sobremesas',
      rating: 4.9
    },
    {
      id: 8,
      nome: 'Pizza Grande',
      descricao: 'Pizza familiar de mussarela com ingredientes frescos e massa crocante.',
      preco: 8500,
      imagem_url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=600',
      categoria: 'Pratos',
      rating: 4.7
    }
  ];

  produtosFiltrados: Produto[] = [];
  produtosFavoritos: Produto[] = [];

  private favoritosIds: Set<number> = new Set();

  constructor(
    public themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarProdutos();
      // Recuperar favoritos salvos para não perder ao atualizar a página
    const favsSalvos = localStorage.getItem('favoritos');
    if (favsSalvos) {
      this.produtosFavoritos = JSON.parse(favsSalvos);
      this.produtosFavoritos.forEach(p => this.favoritosIds.add(p.id));

    }
  }

  // ----- CARREGAR PRODUTOS (mock – substituir por HTTP call) -----
  carregarProdutos(): void {
    this.loading = true;
    // Simula delay de rede
    setTimeout(() => {
      this.categoria = 'Todos'; 
      this.produtosFiltrados = [...this.todosProdutos];
      this.loading = false;
    }, 500);
  }

  // ----- FILTRO -----
  filtrarProdutos(): void {
    let lista = [...this.todosProdutos];

    if (this.categoria !== 'Todos') {
      lista = lista.filter(p => p.categoria === this.categoria);
    }

    if (this.pesquisa.trim()) {
      const q = this.pesquisa.toLowerCase().trim();
      lista = lista.filter(p =>
        p.nome.toLowerCase().includes(q) ||
        p.descricao.toLowerCase().includes(q)
      );
    }

    this.produtosFiltrados = lista;
  }

  // ----- NAVEGAÇÃO -----
  mudarTela(tela: string): void {
    this.telaAtiva = tela;
    // Remove o navigate se preferes manter tudo numa única rota
    // this.router.navigate([`/${tela}`]);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  // ----- CARRINHO -----
  toggleCarrinho(): void {
    this.mostrarCarrinho = !this.mostrarCarrinho;
  }

  adicionarCarrinho(produto: Produto): void {
    this.carrinho.push({ ...produto });
    // Abre o carrinho automaticamente ao adicionar
    if (!this.mostrarCarrinho) {
      this.mostrarCarrinho = true;
    }
  }

  removerItem(index: number): void {
    this.carrinho.splice(index, 1);
  }

  totalCarrinho(): number {
    return this.carrinho.reduce((acc, item) => acc + item.preco, 0);
  }

  // ----- FAVORITOS -----
  isFavorito(id: number): boolean {
    return this.favoritosIds.has(id);
  }

  toggleFavorito(produto: Produto): void {
    if (this.favoritosIds.has(produto.id)) {
      this.favoritosIds.delete(produto.id);
      this.produtosFavoritos = this.produtosFavoritos.filter(p => p.id !== produto.id);
    } else {
      this.favoritosIds.add(produto.id);
      this.produtosFavoritos.push(produto);
    }
    localStorage.setItem('favoritos', JSON.stringify(this.produtosFavoritos));
  }

  // ----- CHECKOUT -----
  finalizarPedido(): void {
    if (this.carrinho.length === 0) return;
      // Simulação de finalização
      const novoPedido = {
        id: Math.floor(Math.random() * 100000),
        data: new Date().toLocaleDateString(),
        items: [...this.carrinho],
        total: this.totalCarrinho()
      };

      const pedidosExistentes = JSON.parse(localStorage.getItem('pedidos') || '[]');
      pedidosExistentes.push(novoPedido);
      localStorage.setItem('pedidos', JSON.stringify(pedidosExistentes));

      alert('Pedido finalizado com sucesso! Poderá acompanhá-lo na aba Pedidos.');
      this.carrinho = [];
      this.mostrarCarrinho = false;
  }

  confirmarPedido(): void {
    // Lógica de envio do pedido para o backend
    console.log('Pedido confirmado! Morada:', this.morada, ' | Pagamento:', this.pagamento);
    this.carrinho = [];
    this.mostrarCarrinho = false;
    this.mostrarCheckout = false;
  }

  togglePerfilMenu(): void {
    this.mostrarPerfilMenu = !this.mostrarPerfilMenu;
  }

}