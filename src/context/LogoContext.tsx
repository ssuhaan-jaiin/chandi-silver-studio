'use client'

import { createContext, useContext, useRef, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

type LogoContextType = {
  navLogoRef: React.RefObject<HTMLDivElement | null>
  navLogoVisible: boolean
  showNavLogo: () => void
}

const LogoContext = createContext<LogoContextType>({
  navLogoRef: { current: null },
  navLogoVisible: false,
  showNavLogo: () => {},
})

export function LogoProvider({ children }: { children: React.ReactNode }) {
  const navLogoRef = useRef<HTMLDivElement | null>(null)
  const pathname = usePathname()

  // Non-home pages skip the intro animation — logo always visible
  const [navLogoVisible, setNavLogoVisible] = useState(pathname !== '/')

  useEffect(() => {
    if (pathname !== '/') {
      setNavLogoVisible(true)
    } else {
      setNavLogoVisible(false)
    }
  }, [pathname])

  return (
    <LogoContext.Provider
      value={{ navLogoRef, navLogoVisible, showNavLogo: () => setNavLogoVisible(true) }}
    >
      {children}
    </LogoContext.Provider>
  )
}

export function useLogoContext() {
  return useContext(LogoContext)
}
