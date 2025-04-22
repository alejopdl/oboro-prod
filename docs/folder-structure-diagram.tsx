"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, Folder, FileText, Code } from "lucide-react"

interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  description?: string
}

export default function FolderStructureDiagram() {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    root: true,
    pages: true,
    components: true,
    lib: true,
    data: true,
    public: true,
  })

  const fileStructure: FileNode = {
    name: "root",
    type: "folder",
    children: [
      {
        name: "pages",
        type: "folder",
        description: "Next.js pages directory containing routes",
        children: [
          {
            name: "index.js",
            type: "file",
            description: "Homepage with featured products and hero section",
          },
          {
            name: "productos.js",
            type: "file",
            description: "Products listing page with filtering and search",
          },
          {
            name: "producto",
            type: "folder",
            description: "Dynamic product pages",
            children: [
              {
                name: "[id].js",
                type: "file",
                description: "Dynamic product detail page",
              },
            ],
          },
          {
            name: "api",
            type: "folder",
            description: "API routes for data fetching",
            children: [
              {
                name: "productos.js",
                type: "file",
                description: "API endpoint for fetching all products",
              },
              {
                name: "producto",
                type: "folder",
                children: [
                  {
                    name: "[id].js",
                    type: "file",
                    description: "API endpoint for fetching a single product",
                  },
                ],
              },
            ],
          },
          {
            name: "_app.js",
            type: "file",
            description: "Custom App component with global providers",
          },
          {
            name: "_document.js",
            type: "file",
            description: "Custom Document component for HTML structure",
          },
        ],
      },
      {
        name: "components",
        type: "folder",
        description: "Reusable UI components",
        children: [
          {
            name: "Navbar.jsx",
            type: "file",
            description: "Navigation bar component with search and theme toggle",
          },
          {
            name: "Footer.jsx",
            type: "file",
            description: "Footer component with links and social media",
          },
          {
            name: "ProductCard.jsx",
            type: "file",
            description: "Card component for displaying product previews",
          },
          {
            name: "ProductGrid.jsx",
            type: "file",
            description: "Grid layout for displaying multiple product cards",
          },
          {
            name: "ProductDetail.jsx",
            type: "file",
            description: "Detailed product view with images and information",
          },
          {
            name: "theme-provider.tsx",
            type: "file",
            description: "Theme provider for dark/light mode",
          },
        ],
      },
      {
        name: "lib",
        type: "folder",
        description: "Utility functions and API clients",
        children: [
          {
            name: "notion.js",
            type: "file",
            description: "Notion API client and data formatting utilities",
          },
        ],
      },
      {
        name: "data",
        type: "folder",
        description: "Data configuration and constants",
        children: [
          {
            name: "config.js",
            type: "file",
            description: "Site configuration including Notion database ID",
          },
        ],
      },
      {
        name: "styles",
        type: "folder",
        description: "CSS and styling files",
        children: [
          {
            name: "globals.css",
            type: "file",
            description: "Global styles and Tailwind CSS imports",
          },
        ],
      },
      {
        name: "public",
        type: "folder",
        description: "Static assets",
        children: [
          {
            name: "images",
            type: "folder",
            description: "Image assets",
            children: [
              { name: "hero-background.jpg", type: "file" },
              { name: "about-image.jpg", type: "file" },
              { name: "placeholder.jpg", type: "file" },
            ],
          },
          { name: "favicon.ico", type: "file" },
        ],
      },
      {
        name: ".env.local.example",
        type: "file",
        description: "Example environment variables file",
      },
      {
        name: "next.config.js",
        type: "file",
        description: "Next.js configuration",
      },
      {
        name: "tailwind.config.js",
        type: "file",
        description: "Tailwind CSS configuration",
      },
      {
        name: "package.json",
        type: "file",
        description: "Project dependencies and scripts",
      },
    ],
  }

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [path]: !prev[path],
    }))
  }

  const renderFileTree = (node: FileNode, path = "", level = 0) => {
    const currentPath = path ? `${path}/${node.name}` : node.name
    const isExpanded = expandedFolders[currentPath]

    return (
      <div key={currentPath} style={{ marginLeft: `${level * 20}px` }}>
        <div
          className={`flex items-center py-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded px-2 ${node.type === "folder" ? "cursor-pointer" : ""}`}
          onClick={() => node.type === "folder" && toggleFolder(currentPath)}
        >
          {node.type === "folder" ? (
            <>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 mr-1 text-gray-500" />
              ) : (
                <ChevronRight className="h-4 w-4 mr-1 text-gray-500" />
              )}
              <Folder className="h-4 w-4 mr-2 text-blue-500" />
            </>
          ) : node.name.endsWith(".js") ||
            node.name.endsWith(".jsx") ||
            node.name.endsWith(".ts") ||
            node.name.endsWith(".tsx") ? (
            <Code className="h-4 w-4 mr-2 text-yellow-500" />
          ) : (
            <FileText className="h-4 w-4 mr-2 text-gray-500" />
          )}
          <span className="text-sm">{node.name}</span>
        </div>

        {node.description && (
          <div className="text-xs text-gray-500 dark:text-gray-400 ml-11 mb-1">{node.description}</div>
        )}

        {node.type === "folder" && isExpanded && node.children && (
          <div>{node.children.map((child) => renderFileTree(child, currentPath, level + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 my-6 bg-white dark:bg-gray-900 shadow-sm">
      <h3 className="text-lg font-medium mb-4">Project Folder Structure</h3>
      <div className="overflow-auto max-h-[500px]">{renderFileTree(fileStructure)}</div>
    </div>
  )
}
