import { useEffect, useRef, useState } from "react"
import { prefetchModule } from "../../util/prefetch"

interface UsePrefetchOnVisibleOptions {
  prefetchFn: () => Promise<any>
  prefetchKey: string
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}

export function usePrefetchOnVisible({
  prefetchFn,
  prefetchKey,
  threshold = 0.1,
  rootMargin = "100px",
  triggerOnce = true,
}: UsePrefetchOnVisibleOptions) {
  const elementRef = useRef<HTMLElement>(null)
  const [hasPrefetched, setHasPrefetched] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element || hasPrefetched) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            prefetchModule(prefetchFn, prefetchKey)
              .then(() => {
                setHasPrefetched(true)
                console.debug(`Prefetched on visibility: ${prefetchKey}`)
              })
              .catch((error) => {
                console.warn(
                  `Failed to prefetch on visibility ${prefetchKey}:`,
                  error,
                )
              })

            if (triggerOnce) {
              observer.unobserve(element)
            }
          }
        })
      },
      {
        threshold,
        rootMargin,
      },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [
    prefetchFn,
    prefetchKey,
    threshold,
    rootMargin,
    triggerOnce,
    hasPrefetched,
  ])

  return { elementRef, hasPrefetched }
}
