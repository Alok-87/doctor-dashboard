'use client';

import * as Headless from '@headlessui/react';
import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Link } from './link';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { Tooltip } from './Tooltip';

/* --------------------------------------------
   Style definitions with dark mode support
--------------------------------------------- */
const styles = {
  base: [
    'relative isolate inline-flex items-center justify-center font-semibold transition-all duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  solid: [
    'border border-transparent',
    'before:absolute before:inset-0 before:-z-10 before:rounded-[calc(var(--radius-lg)-1px)] before:shadow-sm',
    'data-disabled:before:shadow-none data-disabled:after:shadow-none',
  ],
  outline: [
    'border text-gray-900 border-gray-300 hover:bg-gray-50',
    'dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-800',
  ],
  plain: [
    'border-transparent text-gray-700 hover:bg-gray-100',
    'dark:text-gray-200 dark:hover:bg-gray-800',
  ],
  colors: {
    blue: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus-visible:ring-blue-400',
    red: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 dark:focus-visible:ring-red-400',
    gray: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600 dark:focus-visible:ring-gray-500',
    white: 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50 focus-visible:ring-gray-400 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 dark:focus-visible:ring-gray-300',
    green: 'bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600 dark:focus-visible:ring-green-400',
  },
};

/* ---------------- Types ---------------- */
type ButtonProps = (
  | { color?: keyof typeof styles.colors; outline?: never; plain?: never }
  | { color?: never; outline: true; plain?: never }
  | { color?: never; outline?: never; plain: true }
) & {
  className?: string;
  children?: React.ReactNode;
  iconOnly?: boolean;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
  gap?: string;
  fullWidth?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  tooltip?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
} & (
    | ({ href?: never } & Omit<Headless.ButtonProps, 'as' | 'className'>)
    | ({ href: string } & Omit<React.ComponentPropsWithoutRef<typeof Link>, 'className'>)
  );

/* ---------------- Component ---------------- */
export const Button = forwardRef(function Button(
  {
    color,
    outline,
    plain,
    className,
    children,
    iconOnly = false,
    prefixIcon,
    suffixIcon,
    gap = 'gap-2',
    fullWidth = false,
    loading = false,
    size = 'md',
    rounded = 'md',
    tooltip,
    ...props
  }: ButtonProps,
  ref: React.ForwardedRef<HTMLElement>
) {
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-5 py-3 text-lg',
  };

  const roundings = {
    none: 'rounded-none',
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    full: 'rounded-full',
  };

  const classes = clsx(
    className,
    styles.base,
    outline
      ? styles.outline
      : plain
        ? styles.plain
        : clsx(styles.solid, styles.colors[color ?? 'blue']),
    sizeStyles[size],
    roundings[rounded],
    fullWidth && 'w-full',
    iconOnly && 'p-2 aspect-square'
  );

  const content = (
    <div className={clsx('flex flex-row items-center justify-center', gap)}>
      {loading && <ArrowPathIcon className="animate-spin h-5 w-5 text-white dark:text-gray-200" />}
      {!loading && prefixIcon && !iconOnly && (
        <span className="flex items-center">{prefixIcon}</span>
      )}
      {!iconOnly && !loading && <span>{children}</span>}
      {!loading && suffixIcon && !iconOnly && (
        <span className="flex items-center">{suffixIcon}</span>
      )}
      {iconOnly && !loading && (
        <span className="flex items-center">{prefixIcon || suffixIcon}</span>
      )}
    </div>
  );

  const btnElement =
    typeof props.href === 'string' ? (
      <Link
        {...props}
        className={classes}
        ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        onClick={props.onClick}
      >
        <TouchTarget>{content}</TouchTarget>
      </Link>
    ) : (
      <Headless.Button
        {...props}
        className={clsx(classes, 'cursor-pointer')}
        ref={ref}
        onClick={props.onClick}
      >
        <TouchTarget>{content}</TouchTarget>
      </Headless.Button>
    );

  return iconOnly && tooltip ? (
    <Tooltip content={tooltip}>{btnElement}</Tooltip>
  ) : (
    btnElement
  );
});

/* ---------------- TouchTarget ---------------- */
export function TouchTarget({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        className="absolute top-1/2 left-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 pointer-fine:hidden"
        aria-hidden="true"
      />
      {children}
    </>
  );
}
