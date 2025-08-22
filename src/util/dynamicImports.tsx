import React, { Suspense, Component, ReactNode } from "react"
import { CircularProgress, Box, Typography, Button } from "@mui/material"
import { PageFallback } from "../components/metadata/Page"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Dynamic import error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={3}
          textAlign="center"
        >
          <Typography variant="h6" color="error" gutterBottom>
            Failed to load component
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {this.state.error?.message}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => this.setState({ hasError: false })}
            sx={{ mt: 2 }}
          >
            Retry
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}

interface DynamicImportOptions {
  fallback?: ReactNode
  errorFallback?: ReactNode
}

export function createDynamicImport<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: DynamicImportOptions = {},
) {
  const { fallback = <PageFallback />, errorFallback } = options

  const LazyComponent = React.lazy(importFn)

  return function DynamicComponent(props: React.ComponentProps<T>) {
    return (
      <ErrorBoundary fallback={errorFallback}>
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      </ErrorBoundary>
    )
  }
}

// Predefined loading components for different use cases
export const LoadingSpinner = () => (
  <Box display="flex" justifyContent="center" p={3}>
    <CircularProgress />
  </Box>
)

export const LoadingSkeleton = () => (
  <Box p={2}>
    <Box height={20} bgcolor="grey.300" borderRadius={1} mb={1} />
    <Box height={16} bgcolor="grey.200" borderRadius={1} mb={1} />
    <Box height={16} bgcolor="grey.200" borderRadius={1} width="80%" />
  </Box>
)
