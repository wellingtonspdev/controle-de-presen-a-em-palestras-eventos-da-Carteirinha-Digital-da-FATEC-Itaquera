import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Event, AttendanceRecord, Certificate, UserMode } from '../types'
import { initialEvents } from '../mocks/events'
import { initialAttendance } from '../mocks/attendance'
import { currentStudent, mockStudents } from '../mocks/students'

interface AppState {
  userMode: UserMode
  events: Event[]
  attendance: AttendanceRecord[]
  toast: { message: string; type: 'success' | 'error' | 'info'; id: number } | null
}

interface AppContextType {
  state: AppState
  setUserMode: (mode: UserMode) => void
  addEvent: (event: Omit<Event, 'id' | 'checkInStatus' | 'checkOutStatus' | 'currentQrToken' | 'qrType'>) => void
  openCheckIn: (eventId: string) => void
  closeCheckIn: (eventId: string) => void
  openCheckOut: (eventId: string) => void
  closeCheckOut: (eventId: string) => void
  refreshQrToken: (eventId: string) => void
  registerCheckIn: (eventId: string) => void
  registerCheckOut: (eventId: string) => void
  simulateNextStudent: (eventId: string) => void
  getEventAttendance: (eventId: string) => AttendanceRecord[]
  getStudentAttendance: (eventId: string) => AttendanceRecord | undefined
  getConfirmedAttendees: (eventId: string) => AttendanceRecord[]
  getCertificates: () => Certificate[]
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
  resetDemo: () => void
}

const STORAGE_KEY = 'presenca-demo-state'

function generateQrToken(eventId: string, qrType: string): string {
  return `attendance://event/${eventId}/${qrType}/token-${Date.now()}`
}

function getInitialState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      return { ...parsed, toast: null }
    }
  } catch {}
  return {
    userMode: null,
    events: initialEvents,
    attendance: initialAttendance,
    toast: null,
  }
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(getInitialState)

  useEffect(() => {
    const { toast, ...toSave } = state
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }, [state])

  useEffect(() => {
    if (state.toast) {
      const timer = setTimeout(() => {
        setState(prev => ({ ...prev, toast: null }))
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [state.toast])

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setState(prev => ({ ...prev, toast: { message, type, id: Date.now() } }))
  }, [])

  const setUserMode = useCallback((mode: UserMode) => {
    setState(prev => ({ ...prev, userMode: mode }))
  }, [])

  const addEvent = useCallback((event: Omit<Event, 'id' | 'checkInStatus' | 'checkOutStatus' | 'currentQrToken' | 'qrType'>) => {
    const newEvent: Event = {
      ...event,
      id: `evt-${Date.now()}`,
      checkInStatus: 'closed',
      checkOutStatus: 'closed',
      currentQrToken: '',
      qrType: null,
    }
    setState(prev => ({ ...prev, events: [...prev.events, newEvent] }))
  }, [])

  const updateEvent = useCallback((eventId: string, updates: Partial<Event>) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === eventId ? { ...e, ...updates } : e),
    }))
  }, [])

  const openCheckIn = useCallback((eventId: string) => {
    const token = generateQrToken(eventId, 'check-in')
    updateEvent(eventId, {
      checkInStatus: 'open',
      currentQrToken: token,
      qrType: 'check-in',
      status: 'Em andamento',
    })
    showToast('Check-in aberto!', 'success')
  }, [updateEvent, showToast])

  const closeCheckIn = useCallback((eventId: string) => {
    updateEvent(eventId, {
      checkInStatus: 'finished',
      currentQrToken: '',
      qrType: null,
    })
    showToast('Check-in encerrado.', 'info')
  }, [updateEvent, showToast])

  const openCheckOut = useCallback((eventId: string) => {
    const token = generateQrToken(eventId, 'check-out')
    updateEvent(eventId, {
      checkOutStatus: 'open',
      currentQrToken: token,
      qrType: 'check-out',
    })
    showToast('Check-out aberto!', 'success')
  }, [updateEvent, showToast])

  const closeCheckOut = useCallback((eventId: string) => {
    updateEvent(eventId, {
      checkOutStatus: 'finished',
      currentQrToken: '',
      qrType: null,
      status: 'Encerrado',
    })
    showToast('Check-out encerrado. Evento finalizado.', 'info')
  }, [updateEvent, showToast])

  const refreshQrToken = useCallback((eventId: string) => {
    setState(prev => {
      const event = prev.events.find(e => e.id === eventId)
      if (!event || !event.qrType) return prev
      const token = generateQrToken(eventId, event.qrType)
      return {
        ...prev,
        events: prev.events.map(e =>
          e.id === eventId ? { ...e, currentQrToken: token } : e
        ),
      }
    })
  }, [])

  const registerCheckIn = useCallback((eventId: string) => {
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    setState(prev => {
      const existing = prev.attendance.find(
        a => a.eventId === eventId && a.studentId === currentStudent.id
      )
      if (existing) return prev

      const record: AttendanceRecord = {
        id: `att-${Date.now()}`,
        eventId,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        studentRa: currentStudent.ra,
        checkInTime: time,
        checkOutTime: null,
        status: 'checked-in',
      }
      return { ...prev, attendance: [...prev.attendance, record] }
    })
  }, [])

  const registerCheckOut = useCallback((eventId: string) => {
    const now = new Date()
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`

    setState(prev => ({
      ...prev,
      attendance: prev.attendance.map(a =>
        a.eventId === eventId && a.studentId === currentStudent.id
          ? { ...a, checkOutTime: time, status: 'confirmed' as const }
          : a
      ),
    }))
  }, [])

  const simulateNextStudent = useCallback((eventId: string) => {
    setState(prev => {
      const eventAttendance = prev.attendance.filter(a => a.eventId === eventId)
      const usedStudentIds = new Set(eventAttendance.map(a => a.studentId))

      const nextStudent = mockStudents.find(s => !usedStudentIds.has(s.id))
      if (!nextStudent) return prev

      const event = prev.events.find(e => e.id === eventId)
      if (!event) return prev

      const now = new Date()
      const baseMinutes = now.getMinutes()
      const entryTime = `${now.getHours().toString().padStart(2, '0')}:${(baseMinutes + eventAttendance.length).toString().padStart(2, '0')}`

      const isCheckOutOpen = event.checkOutStatus === 'open'
      const exitTime = isCheckOutOpen
        ? `${(now.getHours() + 2).toString().padStart(2, '0')}:${(baseMinutes + eventAttendance.length + 1).toString().padStart(2, '0')}`
        : null

      const record: AttendanceRecord = {
        id: `att-sim-${Date.now()}`,
        eventId,
        studentId: nextStudent.id,
        studentName: nextStudent.name,
        studentRa: nextStudent.ra,
        checkInTime: entryTime,
        checkOutTime: exitTime,
        status: isCheckOutOpen ? 'confirmed' : 'checked-in',
      }

      return { ...prev, attendance: [...prev.attendance, record] }
    })
  }, [])

  const getEventAttendance = useCallback((eventId: string): AttendanceRecord[] => {
    return state.attendance.filter(a => a.eventId === eventId)
  }, [state.attendance])

  const getStudentAttendance = useCallback((eventId: string): AttendanceRecord | undefined => {
    return state.attendance.find(
      a => a.eventId === eventId && a.studentId === currentStudent.id
    )
  }, [state.attendance])

  const getConfirmedAttendees = useCallback((eventId: string): AttendanceRecord[] => {
    return state.attendance.filter(a => a.eventId === eventId && a.status === 'confirmed')
  }, [state.attendance])

  const getCertificates = useCallback((): Certificate[] => {
    const confirmed = state.attendance.filter(
      a => a.studentId === currentStudent.id && a.status === 'confirmed'
    )

    return confirmed.map(a => {
      const event = state.events.find(e => e.id === a.eventId)
      if (!event) return null

      const code = `FATEC-${event.id.toUpperCase().replace('EVT-', '')}-${event.date.replace(/-/g, '')}`

      return {
        id: `cert-${a.eventId}`,
        code,
        eventId: a.eventId,
        eventTitle: event.title,
        eventDate: event.date,
        workload: event.workload,
        studentName: currentStudent.name,
        studentRa: currentStudent.ra,
        issuedAt: new Date().toISOString(),
      } as Certificate
    }).filter(Boolean) as Certificate[]
  }, [state.attendance, state.events])

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState({
      userMode: null,
      events: initialEvents,
      attendance: [],
      toast: { message: 'Demonstração resetada com sucesso!', type: 'info', id: Date.now() },
    })
  }, [])

  const value: AppContextType = {
    state,
    setUserMode,
    addEvent,
    openCheckIn,
    closeCheckIn,
    openCheckOut,
    closeCheckOut,
    refreshQrToken,
    registerCheckIn,
    registerCheckOut,
    simulateNextStudent,
    getEventAttendance,
    getStudentAttendance,
    getConfirmedAttendees,
    getCertificates,
    showToast,
    resetDemo,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextType {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
