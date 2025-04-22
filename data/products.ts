import type { Product } from "@/types/product"

// Traducir los nombres de los productos
export const products: Product[] = [
  {
    id: "1",
    name: "Buzo Negro con Detalle Rojo",
    price: 89,
    size: "Mediano (M)",
    images: [
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=600&h=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611042553365-9b101441c135?q=80&w=600&h=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600&h=600&auto=format&fit=crop",
    ],
    locked: false, // First product is always unlocked
    soldOut: true, // This product is sold out
  },
  {
    id: "2",
    name: "Remera Negra Esencial",
    price: 45,
    size: "Grande (L)",
    images: [
      "https://images.unsplash.com/photo-1618517351616-38fb9c5210c6?q=80&w=600&h=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?q=80&w=600&h=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=600&h=600&auto=format&fit=crop",
    ],
    locked: false, // Unlocked because previous product is sold out
  },
  {
    id: "3",
    name: "Buzo Negro con Detalle Azul",
    price: 95,
    size: "Grande (L)",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&h=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1609873814058-a8928924184a?q=80&w=600&h=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1593032580308-d4bafafc4f28?q=80&w=600&h=600&auto=format&fit=crop",
    ],
    locked: true,
  },
  {
    id: "4",
    name: "Remera Negra Premium con Logo",
    price: 55,
    size: "Pequeño (S)",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=600&h=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583744946564-b52d01e7f922?q=80&w=600&h=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&h=600&auto=format&fit=crop",
    ],
    locked: true,
    soldOut: false,
  },
  {
    id: "5",
    name: "Buzo Negro con Detalle Verde",
    price: 105,
    size: "Extra Grande (XL)",
    images: [
      "https://images.unsplash.com/photo-1578681994506-b8f463449011?q=80&w=600&h=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&h=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1565693413579-8a73ffa8de15?q=80&w=600&h=600&auto=format&fit=crop",
    ],
    locked: true,
  },
]
