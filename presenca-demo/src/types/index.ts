export type CheckpointStatus = 'closed' | 'open' | 'finished'

export interface Event {
  id: string
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  workload: string
  speaker: string
  status: string
  checkInStatus: CheckpointStatus
  checkOutStatus: CheckpointStatus
  currentQrToken: string
  qrType: 'check-in' | 'check-out' | null
}

export interface Student {
  id: string
  name: string
  ra: string
  course: string
}

export interface AttendanceRecord {
  id: string
  eventId: string
  studentId: string
  studentName: string
  studentRa: string
  checkInTime: string | null
  checkOutTime: string | null
  status: 'not-registered' | 'checked-in' | 'confirmed'
}

export interface Certificate {
  id: string
  code: string
  eventId: string
  eventTitle: string
  eventDate: string
  workload: string
  studentName: string
  studentRa: string
  issuedAt: string
}

export type UserMode = 'aluno' | 'secretaria' | null
