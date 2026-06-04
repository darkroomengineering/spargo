import Link from 'next/link'
import s from './footer.module.scss'

export function Footer() {
  return (
    <footer className={s.footer}>
      <div className="layout-block">
        <h2>
          <a href="mailto:hi@darkroom.engineering">mail</a>
          <Link href="/contact">contact</Link>
          <a>twitter</a>
        </h2>
      </div>
    </footer>
  )
}
