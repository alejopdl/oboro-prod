import React from 'react'

const Link = ({ children, href }: { children: React.ReactNode; href: string }) => (
  <a href={href}>{children}</a>
)

export default Link
