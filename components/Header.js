import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import BLOG from '@/blog.config'
import { useLocale } from '@/lib/locale'
import { IoSunnyOutline, IoMoonSharp } from 'react-icons/io5'

const NavBar = () => {
  const locale = useLocale()
  const links = [
    { id: 0, name: locale.NAV.INDEX, to: BLOG.path || '/', show: true },
    { id: 1, name: locale.NAV.ABOUT, to: '/about', show: BLOG.showAbout },
    { id: 2, name: locale.NAV.SEARCH, to: '/search', show: true },
    { id: 3, name: locale.NAV.RSS, to: '/feed', show: false },
  ]
  const [isDark, setIsDark] = useState(BLOG.appearance === 'dark');
  const toggle = () => {
    document.documentElement.classList.toggle('dark')
    setIsDark(!isDark)
  }

  return (
    <div className="flex-shrink-0">
      <ul className="flex flex-row">
        {links.map(
          link =>
            link.show && (
              <li
                key={link.id}
                className="block ml-4 nav text-gray-400 hover:text-black dark:hover:text-gray-50"
              >
                <Link href={link.to}>
                  <a>{link.name}</a>
                </Link>
              </li>
            )
        )}
        <li className="block ml-4 nav text-gray-400">
          {
            isDark
              ? (<IoMoonSharp onClick={toggle} className="w-5 h-5 cursor-pointer hover:text-hover-dark" />)
              : (<IoSunnyOutline onClick={toggle} className="w-6 h-6 -mt-0.5 cursor-pointer hover:text-hover-light" />)
          }
        </li>
      </ul>
    </div>
  )
}

const Header = ({ navBarTitle, fullWidth }) => {
  const useSticky = !BLOG.autoCollapsedNavBar
  const navRef = useRef(null)
  const sentinalRef = useRef([])
  const handler = ([entry]) => {
    if (navRef && navRef.current && useSticky) {
      if (!entry.isIntersecting && entry !== undefined) {
        navRef.current?.classList.add('sticky-nav-full')
      } else {
        navRef.current?.classList.remove('sticky-nav-full')
      }
    } else {
      navRef.current?.classList.add('remove-sticky')
    }
  }
  useEffect(() => {
    const obvserver = new window.IntersectionObserver(handler)
    obvserver.observe(sentinalRef.current)

    return () => {
      if (sentinalRef.current) obvserver.unobserve(sentinalRef.current)
    }
  }, [sentinalRef.current])

  return (
    <>
      <div className="observer-element h-4 md:h-12" ref={sentinalRef}></div>
      <div
        className={`sticky-nav m-auto w-full h-6 flex flex-row justify-between items-center mb-2 md:mb-12 py-8 bg-opacity-60 ${!fullWidth ? 'max-w-3xl px-4' : 'px-4 md:px-24'
          }`}
        id="sticky-nav"
        ref={navRef}
      >
        <div className="flex items-center text-black dark:text-gray-50">
          <Link href="/">
            <a aria-label={BLOG.title}>
              🐳 {BLOG.title}
            </a>
          </Link>
          {navBarTitle
            ? (
              <p className="ml-2 font-medium text-day dark:text-night header-name">
                {navBarTitle}
              </p>
            )
            : (
              <p className="ml-2 font-medium text-day dark:text-night header-name">
                {BLOG.title},{' '}
                <span className="font-normal">{BLOG.description}</span>
              </p>
            )}
        </div>
        <NavBar />
      </div>
    </>
  )
}

export default Header
