// DiscordLink.js
import React from 'react'
import DiscordIcon from '@material-ui/icons/QuestionAnswer'

export const DiscordLink = ({ className, theme }) => {
  const backgroundColor = theme === 'dark' ? 'var(--theme-dark)' : 'white'

  return (
    <a
    href="https://discord.com/channels/1121511613250412714/1122324729756385300"
    aria-label="Micronaut Discord Channel"
    title="Micronaut Discord Channel"
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{ backgroundColor }}
    >
      <DiscordIcon />
    </a>
  )
}
export default DiscordLink
