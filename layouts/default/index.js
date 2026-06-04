import { CustomHead } from 'components/custom-head'
import { ReactLenis as Lenis, useLenis } from 'lenis/react'
import cn from 'clsx'
import Router from 'next/router'
import { useEffect } from 'react'
import s from './layout.module.scss'

export function Layout({
  seo = { title: '', description: '', image: '', keywords: '' },
  children,
  theme = 'light',
  className,
}) {
  const lenis = useLenis()

  useEffect(() => {
    function onHashChangeStart(url) {
      url = '#' + url.split('#').pop()
      lenis.scrollTo(url)
    }

    Router.events.on('hashChangeStart', onHashChangeStart)

    return () => {
      Router.events.off('hashChangeStart', onHashChangeStart)
    }
  }, [lenis])

  return (
    <>
      <CustomHead {...seo} />
      <Lenis root>
        <div className={cn(`theme-${theme}`, s.layout, className)}>
          <main className={s.main}>{children}</main>
        </div>
      </Lenis>
    </>
  )
}
