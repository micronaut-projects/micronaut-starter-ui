// TwitterLink.js
import React from 'react'

export const TwitterLink = ({ className, theme }) => {
  const backgroundColor =
    theme === 'dark' ? 'var(--theme-light)' : 'var(--theme-dark)'
  const fill = theme === 'dark' ? 'var(--theme-dark)' : 'white'

  return (
    <a
      href="https://twitter.com/micronautfw"
      aria-label="Micronaut X Account"
      title="Micronaut X Account"
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
            viewBox="-50 -28.5 356 256"
            width="32px"
        >
            <path
                d="M178.57 127.15 290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66"
                style={{fill: fill}}
            />
        </svg>
    </a>
  )
}
export default TwitterLink
