"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/30 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">Algo salió mal</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Ha ocurrido un error al cargar este componente. Por favor, intenta recargar la página.
          </p>
          <pre className="bg-white dark:bg-gray-800 p-4 rounded text-sm overflow-auto max-h-40 text-red-600 dark:text-red-400">
            {this.state.error?.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Recargar página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
