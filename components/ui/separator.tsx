"use client"

import * as React from "react"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cn } from "@/lib/utils"

const Separator = React.forwardRef(
  function SeparatorComponent(
    { className, orientation, decorative, ...props }: React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root>,
    ref: React.ForwardedRef<React.ElementRef<typeof SeparatorPrimitive.Root>>
  ) {
    return (
      <SeparatorPrimitive.Root
        ref={ref}
        decorative={decorative ?? true}
        orientation={orientation ?? "horizontal"}
        className={cn(
          "shrink-0 bg-[var(--border-subtle)]",
          (orientation ?? "horizontal") === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...props}
      />
    )
  }
)
Separator.displayName = "Separator"

export { Separator }
