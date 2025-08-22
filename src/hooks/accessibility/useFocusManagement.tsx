import { useEffect, useRef } from "react"

export function useFocusManagement() {
  const focusTrapRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLElement | null>(null)
  const lastFocusableRef = useRef<HTMLElement | null>(null)

  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ]

    return Array.from(
      container.querySelectorAll(focusableSelectors.join(",")),
    ) as HTMLElement[]
  }

  const setupFocusTrap = () => {
    if (!focusTrapRef.current) return

    const focusableElements = getFocusableElements(focusTrapRef.current)

    if (focusableElements.length === 0) return

    firstFocusableRef.current = focusableElements[0]
    lastFocusableRef.current = focusableElements[focusableElements.length - 1]

    // Focus the first element
    firstFocusableRef.current.focus()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab") return

    if (!firstFocusableRef.current || !lastFocusableRef.current) return

    if (event.shiftKey) {
      // Shift + Tab: move backwards
      if (document.activeElement === firstFocusableRef.current) {
        event.preventDefault()
        lastFocusableRef.current.focus()
      }
    } else {
      // Tab: move forwards
      if (document.activeElement === lastFocusableRef.current) {
        event.preventDefault()
        firstFocusableRef.current.focus()
      }
    }
  }

  useEffect(() => {
    const container = focusTrapRef.current
    if (!container) return

    container.addEventListener("keydown", handleKeyDown)

    return () => {
      container.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return {
    focusTrapRef,
    setupFocusTrap,
  }
}
