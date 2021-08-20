// GetterLink.js
import React from 'react'

export const GetterLink = ({ className, theme }) => {
  const backgroundColor =
    theme === 'dark' ? 'var(--theme-light)' : 'var(--theme-dark)'
  const color = theme === 'dark' ? 'var(--theme-dark)' : 'white'

  return (
    <a
      href="https://gitter.im/micronautfw/"
      aria-label="Micronaut Gitter Channel"
      title="Micronaut Gitter Channel"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        backgroundColor,
      }}
      className={className}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        width="2em"
        height="2em"
        viewBox="0 0 256 256"
      >
        <path
          d="M83.914 62.873h12.525v82.661H83.914V62.873zm76.149 20.039h12.524v62.622h-12.524V82.912zm-50.599 0h12.524v110.466h-12.524V82.912zm25.049 0h12.525v110.466h-12.525V82.912z"
          fill={color}
        />
      </svg>
    </a>
  )
}
export default GetterLink
