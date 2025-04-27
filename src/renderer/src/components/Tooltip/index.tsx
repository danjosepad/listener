import React from 'react'

interface TooltipProps {
  children: React.ReactNode
  content: React.ReactNode | string
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function Tooltip({ children, content, position = 'top' }: TooltipProps): JSX.Element {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  }

  return (
    <div className="relative inline-block group">
      {children}
      <div className={`
        absolute ${positionClasses[position]}
        hidden group-hover:block
        px-2 py-1 text-sm text-white
        bg-gray-800 rounded-lg
        whitespace-nowrap
        transition-opacity duration-150
        z-50
      `}>
        {content}
      </div>
    </div>
  )
}
