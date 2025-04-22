import { Client } from "@notionhq/client"
import { config } from "@/data/config"

// Initialize the Notion client with the API key from environment variables
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

/**
 * Fetches all products from the Notion database
 */
export async function getAllProducts() {
  try {
    const response = await notion.databases.query({
      database_id: config.notionDatabaseId,
      sorts: [
        {
          property: "Name",
          direction: "ascending",
        },
      ],
    })

    return response.results.map(formatProductFromNotion)
  } catch (error) {
    console.error("Error fetching products from Notion:", error)
    return []
  }
}

/**
 * Fetches a single product by ID from the Notion database
 */
export async function getProductById(id) {
  try {
    const response = await notion.pages.retrieve({
      page_id: id,
    })

    return formatProductFromNotion(response)
  } catch (error) {
    console.error(`Error fetching product with ID ${id} from Notion:`, error)
    return null
  }
}

/**
 * Formats a Notion page object into a product object
 */
function formatProductFromNotion(notionPage) {
  const properties = notionPage.properties

  // Extract the product ID from the Notion page ID
  const id = notionPage.id.replace(/-/g, "")

  // Extract product name
  const name = properties.Name?.title?.[0]?.plain_text || "Unnamed Product"

  // Extract product price
  const price = properties.Price?.number || 0

  // Extract product description
  const description = properties.Description?.rich_text?.[0]?.plain_text || ""

  // Extract product image URLs (can be multiple)
  const images = properties.Images?.files?.map(
    (file) => file.file?.url || file.external?.url || "/images/placeholder.jpg",
  ) || ["/images/placeholder.jpg"]

  // Extract product category
  const category = properties.Category?.select?.name || "Uncategorized"

  // Extract product stock status
  const inStock = properties.InStock?.checkbox || false

  // Extract product size if available
  const size = properties.Size?.select?.name || ""

  return {
    id,
    name,
    price,
    description,
    images,
    category,
    inStock,
    size,
    createdTime: notionPage.created_time,
    lastEditedTime: notionPage.last_edited_time,
  }
}

/**
 * Searches products by query string
 */
export async function searchProducts(query) {
  try {
    const allProducts = await getAllProducts()

    if (!query) return allProducts

    const searchTerm = query.toLowerCase()

    return allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm),
    )
  } catch (error) {
    console.error("Error searching products:", error)
    return []
  }
}

/**
 * Filters products by category
 */
export async function filterProductsByCategory(category) {
  try {
    const allProducts = await getAllProducts()

    if (!category || category === "All") return allProducts

    return allProducts.filter((product) => product.category.toLowerCase() === category.toLowerCase())
  } catch (error) {
    console.error("Error filtering products by category:", error)
    return []
  }
}
