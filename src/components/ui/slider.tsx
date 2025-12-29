import * as React from "react"
import { clsx } from "clsx"

interface SliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: number
  onValueChange: (value: number) => void
  min?: number
  max?: number
  step?: number
}

export function Slider({ value, onValueChange, className, min = 0, max = 100, step = 1, ...props }: SliderProps) {
  return (
    <div className={clsx("relative flex w-full touch-none select-none items-center", className)}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onValueChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-gray-700 accent-blue-600 dark:accent-blue-500"
        {...props}
      />
    </div>
  )
}

