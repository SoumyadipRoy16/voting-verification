import * as React from "react"
import { cn } from "@/lib/utils"

interface StepsProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number
}

export function Steps({ currentStep, className, ...props }: StepsProps) {
  const children = React.Children.toArray(props.children)

  return (
    <div className={cn("flex w-full", className)} {...props}>
      {children.map((child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<StepProps>, {
            stepNumber: index + 1,
            isActive: currentStep === index + 1,
            isCompleted: currentStep > index + 1,
            isLast: index === children.length - 1,
          })
        }
        return child
      })}
    </div>
  )
}

interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  stepNumber?: number
  isActive?: boolean
  isCompleted?: boolean
  isLast?: boolean
}

export function Step({
  title,
  description,
  stepNumber,
  isActive,
  isCompleted,
  isLast,
  className,
  ...props
}: StepProps) {
  return (
    <div className={cn("flex flex-1", className)} {...props}>
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium",
            isActive && "border-primary bg-primary text-primary-foreground",
            isCompleted && "border-primary bg-primary text-primary-foreground",
            !isActive && !isCompleted && "border-muted-foreground text-muted-foreground",
          )}
        >
          {isCompleted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : (
            stepNumber
          )}
        </div>
        {!isLast && (
          <div
            className={cn("mt-2 h-[calc(100%-2rem)] w-0.5", isCompleted ? "bg-primary" : "bg-muted-foreground/30")}
          />
        )}
      </div>
      <div className="ml-4 mt-1 flex flex-col">
        <span
          className={cn(
            "text-sm font-medium",
            isActive && "text-foreground",
            isCompleted && "text-foreground",
            !isActive && !isCompleted && "text-muted-foreground",
          )}
        >
          {title}
        </span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
    </div>
  )
}

