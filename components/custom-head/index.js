import Head from 'next/head'

// Replaces @studio-freight/compono's CustomHead with next/head.
export function CustomHead({ title, description, image, keywords } = {}) {
  const keywordsContent = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords

  return (
    <Head>
      {title && <title>{title}</title>}
      {description && <meta name="description" content={description} />}
      {keywordsContent && <meta name="keywords" content={keywordsContent} />}
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
    </Head>
  )
}
