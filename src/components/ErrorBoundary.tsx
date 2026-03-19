import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught:', error, info.componentStack)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-svh bg-gradient-to-b from-primary-50 to-accent-50 flex flex-col items-center justify-center px-4 sm:px-6">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-100/80 flex items-center justify-center mx-auto mb-5 sm:mb-6">
              <span className="text-2xl sm:text-3xl" aria-hidden="true">!</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-primary-700/80 text-sm sm:text-base mb-6 sm:mb-8">
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={this.handleReset}
              className="w-full py-3.5 sm:py-4 px-6 bg-primary-600 hover:bg-primary-700 hover:shadow-xl active:scale-95 text-white font-semibold rounded-2xl text-base sm:text-lg shadow-lg shadow-primary-200 transition-[transform,background-color,box-shadow] duration-150"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
