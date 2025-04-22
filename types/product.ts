export interface Product {
  id: string
  name: string
  price: number
  size: string
  images: string[]
  locked?: boolean
  soldOut?: boolean
}
