'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid'

interface OptionProps {
  value: string | number
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

type SelectChangeHandler =
  | ((value: string | number) => void)
  | ((e: React.ChangeEvent<HTMLSelectElement>) => void)
  | ((eventLike: { target: { value: string | number } }) => void)

interface SelectProps {
  id?: string
  value?: string | number
  defaultValue?: string | number
  onChange?: SelectChangeHandler
  placeholder?: string
  className?: string
  children: React.ReactNode
  disabled?: boolean
}

export function Select({
  id,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select option',
  className,
  children,
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = useState(false)
  const [dropUp, setDropUp] = useState(false)
  const [internalValue, setInternalValue] = useState<string | number | undefined>(
    value ?? defaultValue
  )
  const ref = useRef<HTMLDivElement>(null)

  // close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // detect dropdown direction (up/down)
  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const dropdownHeight = 200 // approximate dropdown height
      setDropUp(spaceBelow < dropdownHeight)
    }
  }, [open])

  // collect options
  const optionElements = useMemo(
    () =>
      React.Children.toArray(children).filter(
        React.isValidElement
      ) as React.ReactElement<OptionProps>[],
    [children]
  )

  // derive selected label directly
  const effectiveValue = value ?? internalValue
  const selectedOption = optionElements.find((opt) => opt.props.value === effectiveValue)
  const selectedLabel = selectedOption ? String(selectedOption.props.children) : null

  const handleSelect = (selectedValue: string | number) => {
    if (value === undefined) setInternalValue(selectedValue)

    if (onChange) {
      const eventLike = {
        target: { value: selectedValue },
      } as unknown as React.ChangeEvent<HTMLSelectElement>

      try {
        (onChange as any)(eventLike)
      } catch {
        (onChange as any)(selectedValue)
      }
    }

    setOpen(false)
  }

  const selectedValue = value ?? internalValue

  return (
    <div ref={ref} className={clsx('relative w-full', className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={clsx(
          'flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-left text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500',
          'dark:bg-gray-800 dark:border-gray-700 dark:text-white',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <span
          className={clsx(
            selectedLabel ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'
          )}
        >
          {selectedLabel || placeholder}
        </span>
        <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
      </button>

      {open && (
        <div
          className={clsx(
            'absolute z-20 w-full rounded-md border border-gray-200 bg-white shadow-lg dark:bg-gray-800 dark:border-gray-700',
            dropUp ? 'bottom-full mb-1' : 'top-full mt-1'
          )}
        >
          {optionElements.map((opt) => {
            const selected = opt.props.value === selectedValue
            return (
              <div
                key={opt.props.value}
                onClick={() => !opt.props.disabled && handleSelect(opt.props.value)}
                className={clsx(
                  'flex items-center justify-between px-3 py-2 text-sm transition-colors',
                  opt.props.disabled
                    ? 'cursor-not-allowed opacity-50 text-gray-400 dark:text-gray-500'
                    : 'cursor-pointer',
                  selected && !opt.props.disabled
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-600/40 dark:text-white'
                    : !opt.props.disabled &&
                    'text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700'
                )}
              >
                <span>{opt.props.children}</span>
                {selected && (
                  <CheckIcon className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function Option({ children }: OptionProps) {
  return <>{children}</>
}
