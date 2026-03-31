import * as Headless from '@headlessui/react'
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom'
import React, { forwardRef } from 'react'

export type LinkProps = RouterLinkProps & {
  children: React.ReactNode
  className?: string
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { children, ...props },
  ref
) {
  return (
    <Headless.DataInteractive>
      <RouterLink {...props} ref={ref}>
        {children}
      </RouterLink>
    </Headless.DataInteractive>
  )
})
