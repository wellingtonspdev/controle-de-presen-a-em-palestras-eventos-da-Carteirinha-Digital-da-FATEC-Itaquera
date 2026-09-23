import { Student } from '../types'

export const mockStudents: Student[] = [
  { id: 'std-001', name: 'Ana Souza', ra: '123456', course: 'ADS' },
  { id: 'std-002', name: 'Bruno Lima', ra: '456789', course: 'ADS' },
  { id: 'std-003', name: 'Carlos Santos', ra: '987654', course: 'GE' },
  { id: 'std-004', name: 'Diana Oliveira', ra: '234567', course: 'ADS' },
  { id: 'std-005', name: 'Eduardo Costa', ra: '345678', course: 'GE' },
  { id: 'std-006', name: 'Fernanda Reis', ra: '567890', course: 'ADS' },
  { id: 'std-007', name: 'Gabriel Martins', ra: '678901', course: 'ADS' },
  { id: 'std-008', name: 'Helena Ferreira', ra: '789012', course: 'GE' },
  { id: 'std-009', name: 'Igor Pereira', ra: '890123', course: 'ADS' },
  { id: 'std-010', name: 'Julia Almeida', ra: '901234', course: 'ADS' },
]

export const currentStudent: Student = {
  id: 'std-current',
  name: 'Wellington Siqueira Porto',
  ra: '1234567',
  course: 'Análise e Desenvolvimento de Sistemas',
}
