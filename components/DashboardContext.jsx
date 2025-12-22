'use client'

import { createContext, useContext } from 'react'

const Ctx = createContext({ bookings: [] })

export function DashboardProvider({ value, children }) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useDashboard() {
  return useContext(Ctx)
}
