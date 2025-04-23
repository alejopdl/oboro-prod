import { Product } from '../types/product'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Produto Teste 1',
    price: 99.99,
    size: 'M',
    images: ['/images/produto-1.jpg'],
    soldOut: false,
    description: 'Descrição do produto teste 1',
    category: 'Camisetas'
  },
  {
    id: '2',
    name: 'Produto Teste 2',
    price: 149.99,
    size: 'G',
    images: ['/images/produto-2.jpg'],
    soldOut: true,
    description: 'Descrição do produto teste 2',
    category: 'Calças'
  },
  {
    id: '3',
    name: 'Produto Teste 3',
    price: 79.99,
    size: 'P',
    images: ['/images/produto-3.jpg'],
    soldOut: false,
    description: 'Descrição do produto teste 3',
    category: 'Acessórios'
  }
]
