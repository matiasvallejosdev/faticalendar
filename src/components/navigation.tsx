"use client"

import { Calendar, CalendarDays, CalendarRange, CalendarClock } from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/hooks/redux"
import { setView } from "@/store/viewSlice"
import type { ViewType } from "@/store/viewSlice"

export function Navigation() {
  const view = useAppSelector((state) => state.view.currentView)
  const dispatch = useAppDispatch()

  const viewOrder: ViewType[] = ["month", "year", "decade", "life"]

  const handleViewChange = (newView: ViewType) => {
    dispatch(setView(newView))
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex space-x-2">
        <button
          onClick={() => handleViewChange("month")}
          className={`h-10 px-4 rounded-md border border-vintage-green flex items-center ${
            view === "month" ? "bg-vintage-green text-vintage-cream" : "bg-transparent text-vintage-green"
          }`}
        >
          <Calendar className="h-5 w-5 mr-2" />
          Month
        </button>
        <button
          onClick={() => handleViewChange("year")}
          className={`h-10 px-4 rounded-md border border-vintage-green flex items-center ${
            view === "year" ? "bg-vintage-green text-vintage-cream" : "bg-transparent text-vintage-green"
          }`}
        >
          <CalendarDays className="h-5 w-5 mr-2" />
          Year
        </button>
        <button
          onClick={() => handleViewChange("decade")}
          className={`h-10 px-4 rounded-md border border-vintage-green flex items-center ${
            view === "decade" ? "bg-vintage-green text-vintage-cream" : "bg-transparent text-vintage-green"
          }`}
        >
          <CalendarRange className="h-5 w-5 mr-2" />
          Decade
        </button>
        <button
          onClick={() => handleViewChange("life")}
          className={`h-10 px-4 rounded-md border border-vintage-green flex items-center ${
            view === "life" ? "bg-vintage-green text-vintage-cream" : "bg-transparent text-vintage-green"
          }`}
        >
          <CalendarClock className="h-5 w-5 mr-2" />
          Life
        </button>
      </div>
    </div>
  )
}
