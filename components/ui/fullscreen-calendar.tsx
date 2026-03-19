"use client"

import React from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  parse,
  startOfToday,
  startOfWeek,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
} from "date-fns"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Separator } from "@/components/ui/separator"

export type CalendarEvent = {
  id: string
  name: string
  time: string
  datetime: string
  course?: string
}

export type CalendarData = {
  day: Date
  events: CalendarEvent[]
}

export function FullScreenCalendar({ data }: { data: CalendarData[] }) {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState<Date>(today)
  const [currentMonth, setCurrentMonth] = React.useState<string>(
    format(today, "MMM-yyyy")
  )
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"))
  }

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
        <div className="flex flex-auto">
          <div className="flex items-center gap-4">
            <div className="hidden w-20 flex-col items-center justify-center rounded-lg border border-border-subtle bg-bg-elevated p-0.5 md:flex">
              <h1 className="p-1 text-xs uppercase text-text-secondary">
                {format(today, "MMM")}
              </h1>
              <div className="flex w-full items-center justify-center rounded-lg border border-border-subtle bg-bg-base p-0.5 text-lg font-bold">
                <span>{format(today, "d")}</span>
              </div>
            </div>

            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-text-primary">
                {format(firstDayCurrentMonth, "MMMM, yyyy")}
              </h2>
              <p className="text-sm text-text-secondary">
                {format(firstDayCurrentMonth, "MMM d, yyyy")} -{" "}
                {format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <div className="inline-flex w-full -space-x-px rounded-lg shadow-sm shadow-black/5 md:w-auto rtl:space-x-reverse">
            <button
              type="button"
              onClick={previousMonth}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center border border-border-subtle bg-bg-base text-text-secondary shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10",
                "hover:bg-bg-elevated"
              )}
              aria-label="Navigate to previous month"
            >
              <ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToToday}
              className={cn(
                "inline-flex h-9 flex-1 items-center justify-center border-t border-b border-border-subtle bg-bg-base px-3 text-sm font-medium text-text-primary shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 md:w-auto"
              )}
            >
              Today
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className={cn(
                "inline-flex h-9 w-9 items-center justify-center border border-border-subtle bg-bg-base text-text-secondary shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10",
                "hover:bg-bg-elevated"
              )}
              aria-label="Navigate to next month"
            >
              <ChevronRightIcon size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
          <Separator orientation="horizontal" className="block w-full md:hidden" />
        </div>
      </div>

      <div className="lg:flex lg:flex-auto lg:flex-col min-h-0">
        <div className="grid grid-cols-7 border border-border-subtle text-center text-xs font-semibold leading-6 lg:flex-none">
          <div className="border-r border-border-subtle py-2.5">Sun</div>
          <div className="border-r border-border-subtle py-2.5">Mon</div>
          <div className="border-r border-border-subtle py-2.5">Tue</div>
          <div className="border-r border-border-subtle py-2.5">Wed</div>
          <div className="border-r border-border-subtle py-2.5">Thu</div>
          <div className="border-r border-border-subtle py-2.5">Fri</div>
          <div className="py-2.5">Sat</div>
        </div>

        <div className="flex text-xs leading-6 lg:flex-auto min-h-0">
          <div className="hidden w-full border-x border-border-subtle lg:grid lg:grid-cols-7 lg:grid-rows-5">
            {days.map((day, dayIdx) => (
              <FullScreenCalendarDay
                key={dayIdx}
                data={data}
                day={day}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                firstDayCurrentMonth={firstDayCurrentMonth}
                dayIndex={dayIdx}
              />
            ))}
          </div>

          <div className="isolate grid w-full grid-cols-7 grid-rows-5 border-x border-border-subtle lg:hidden">
            {days.map((day, dayIdx) => (
              <FullScreenCalendarDay
                key={dayIdx}
                data={data}
                day={day}
                selectedDay={selectedDay}
                setSelectedDay={setSelectedDay}
                firstDayCurrentMonth={firstDayCurrentMonth}
                dayIndex={dayIdx}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function hashStringToIndex(value: string, modulo: number) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  const normalized = Math.abs(hash)
  return normalized % modulo
}

function eventPillClasses(eventName: string) {
  const idx = hashStringToIndex(eventName, 4)
  const base =
    "rounded-md px-1.5 py-0.5 text-[10px] font-medium truncate w-full"

  switch (idx) {
    case 1:
      return `${base} bg-[rgba(245,158,11,0.12)] text-[#fbbf24]`
    case 2:
      return `${base} bg-[rgba(16,185,129,0.12)] text-[#34d399]`
    case 3:
      return `${base} bg-[rgba(239,68,68,0.12)] text-[#f87171]`
    case 0:
    default:
      return `${base} bg-[rgba(99,102,241,0.15)] text-[#818cf8]`
  }
}

function FullScreenCalendarDay({
  day,
  selectedDay,
  setSelectedDay,
  firstDayCurrentMonth,
  dayIndex,
  data,
}: {
  day: Date
  selectedDay: Date
  setSelectedDay: React.Dispatch<React.SetStateAction<Date>>
  firstDayCurrentMonth: Date
  dayIndex: number
  data: CalendarData[]
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [hoveredEvent, setHoveredEvent] = React.useState<{
    id: string
    name: string
    time: string
    datetime: string
    course?: string
  } | null>(null)
  const [tooltipPos, setTooltipPos] = React.useState({ x: 0, y: 0 })

  const dayEntry = data.find((d) => isSameDay(d.day, day))
  const dayEvents = dayEntry?.events ?? []
  const dateKey = format(day, "yyyy-MM-dd")

  function formatFullDate(datetime: string) {
    const d = new Date(datetime)
    if (Number.isNaN(d.getTime())) return datetime
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  function priorityBadgeInlineStyle(priority: string): React.CSSProperties {
    if (priority === "high") {
      return {
        background: "rgba(239,68,68,0.12)",
        color: "#f87171",
        borderRadius: "20px",
        padding: "2px 8px",
        fontSize: "10px",
        display: "inline-block",
        marginTop: "4px",
      }
    }

    if (priority === "medium") {
      return {
        background: "rgba(245,158,11,0.12)",
        color: "#fbbf24",
        borderRadius: "20px",
        padding: "2px 8px",
        fontSize: "10px",
        display: "inline-block",
        marginTop: "4px",
      }
    }

    if (priority === "low") {
      return {
        background: "rgba(16,185,129,0.12)",
        color: "#34d399",
        borderRadius: "20px",
        padding: "2px 8px",
        fontSize: "10px",
        display: "inline-block",
        marginTop: "4px",
      }
    }

    return {
      background: "rgba(99,102,241,0.12)",
      color: "#818cf8",
      borderRadius: "20px",
      padding: "2px 8px",
      fontSize: "10px",
      display: "inline-block",
      marginTop: "4px",
    }
  }

  function renderEventPill(event: CalendarEvent) {
    return (
      <div
        key={event.id}
        className={eventPillClasses(event.name)}
        onMouseEnter={(e) => {
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
          setTooltipPos({ x: rect.left, y: rect.top })
          setHoveredEvent(event)
        }}
        onMouseLeave={() => setHoveredEvent(null)}
      >
        {event.name}
      </div>
    )
  }

  const mobileCell = (
    <button
      type="button"
      onClick={() => setSelectedDay(day)}
      key={dayIndex}
      className={cn(
        isEqual(day, selectedDay) &&
          !isToday(day) &&
          "font-semibold text-white",
        (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
        "flex h-14 flex-col border-b border-r border-border-subtle px-3 py-2 transition duration-150 hover:bg-[rgba(255,255,255,0.03)] focus:z-10"
      )}
    >
      <time
        dateTime={dateKey}
        className={cn(
          "ml-auto flex size-6 items-center justify-center rounded-full text-xs",
          (isEqual(day, selectedDay) || isToday(day)) &&
            "bg-[#6366f1] text-white"
        )}
      >
        {format(day, "d")}
      </time>
      {dayEvents.length > 0 && (
        <div className="mt-1.5 flex w-full flex-col gap-1">
          {dayEvents.slice(0, 1).map((event) => renderEventPill(event))}
          {dayEvents.length > 1 && (
            <div className="text-[10px] text-text-secondary">
              + {dayEvents.length - 1} more
            </div>
          )}
        </div>
      )}
    </button>
  )

  const colStartClasses = ["", "col-start-2", "col-start-3", "col-start-4", "col-start-5", "col-start-6", "col-start-7"]

  const desktopCell = (
    <div
      key={dayIndex}
      onClick={() => setSelectedDay(day)}
      className={cn(
        dayIndex === 0 && colStartClasses[getDay(day)],
        !isEqual(day, selectedDay) &&
          !isToday(day) &&
          !isSameMonth(day, firstDayCurrentMonth) &&
          "bg-[rgba(255,255,255,0.02)] text-text-secondary",
        "relative flex flex-col border-b border-r border-border-subtle transition duration-150 hover:bg-[rgba(255,255,255,0.03)] focus:z-10"
      )}
    >
      <header className="flex items-center justify-between p-2.5">
        <button
          type="button"
          className={cn(
            isEqual(day, selectedDay) && "text-white",
            !isEqual(day, selectedDay) &&
              !isToday(day) &&
              isSameMonth(day, firstDayCurrentMonth) &&
              "text-text-primary",
            !isEqual(day, selectedDay) &&
              !isToday(day) &&
              !isSameMonth(day, firstDayCurrentMonth) &&
              "text-text-secondary",
            isEqual(day, selectedDay) &&
              isToday(day) &&
              "border-none bg-[#6366f1]",
            isEqual(day, selectedDay) && !isToday(day) && "bg-text-primary",
            (isEqual(day, selectedDay) || isToday(day)) && "font-semibold",
            "flex h-7 w-7 items-center justify-center rounded-full text-xs"
          )}
        >
          <time dateTime={dateKey}>{format(day, "d")}</time>
        </button>
      </header>
      <div className="flex-1 p-2.5">
        {dayEvents.length > 0 &&
          dayEvents.slice(0, 1).map((event) => (
            renderEventPill(event)
          ))}
        {dayEvents.length > 1 && (
          <div className="text-[10px] text-text-secondary">
            + {dayEvents.length - 1} more
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {isDesktop ? desktopCell : mobileCell}
      {hoveredEvent && (
        <div
          style={{
            position: "fixed",
            left: tooltipPos.x,
            top: tooltipPos.y + 28,
            zIndex: 9999,
            pointerEvents: "none",
            background: "#13131f",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "8px",
            padding: "10px 14px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
            width: "200px",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.9)",
              marginBottom: "6px",
            }}
          >
            {hoveredEvent.name}
          </div>
          {hoveredEvent.course && (
            <div
              style={{
                fontSize: "11px",
                color: "rgba(255,255,255,0.45)",
                marginBottom: "4px",
              }}
            >
              {hoveredEvent.course}
            </div>
          )}
          <div
            style={{
              display: "inline-block",
              fontSize: "10px",
              padding: "2px 8px",
              borderRadius: "20px",
              marginBottom: "6px",
              ...(hoveredEvent.time === "high"
                ? {
                    background: "rgba(239,68,68,0.12)",
                    color: "#f87171",
                  }
                : hoveredEvent.time === "low"
                  ? {
                      background: "rgba(16,185,129,0.12)",
                      color: "#34d399",
                    }
                  : {
                      background: "rgba(245,158,11,0.12)",
                      color: "#fbbf24",
                    }),
            }}
          >
            {hoveredEvent.time || "medium"}
          </div>
          <div
            style={{
              fontSize: "11px",
              color: "rgba(255,255,255,0.25)",
              display: "block",
            }}
          >
            {new Date(hoveredEvent.datetime).toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </div>
      )}
    </>
  )
}

