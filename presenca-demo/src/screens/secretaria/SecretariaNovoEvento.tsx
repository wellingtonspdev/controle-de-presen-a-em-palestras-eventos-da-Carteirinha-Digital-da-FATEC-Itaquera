import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../contexts/AppContext'
import { Header } from '../../components/Header'
import { Save } from 'lucide-react'
import styles from './SecretariaNovoEvento.module.css'

export function SecretariaNovoEvento() {
  const navigate = useNavigate()
  const { addEvent, showToast } = useApp()
  const [form, setForm] = useState({ title: '', description: '', date: '', startTime: '', endTime: '', location: 'Auditório FATEC Itaquera', workload: '2h', speaker: '', status: 'Programado' })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.date || !form.startTime || !form.endTime) { showToast('Preencha todos os campos obrigatórios.', 'error'); return }
    addEvent(form)
    showToast('Evento criado com sucesso!', 'success')
    navigate('/secretaria/eventos')
  }

  return (
    <div className={styles.page}>
      <Header title="Novo Evento" backTo="/secretaria/eventos" />
      <div className={styles.content}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}><label>Título *</label><input name="title" value={form.title} onChange={handleChange} placeholder="Título do evento" /></div>
          <div className={styles.field}><label>Descrição</label><textarea name="description" value={form.description} onChange={handleChange} placeholder="Descrição do evento" rows={3} /></div>
          <div className={styles.row}>
            <div className={styles.field}><label>Data *</label><input type="date" name="date" value={form.date} onChange={handleChange} /></div>
          </div>
          <div className={styles.row}>
            <div className={styles.field}><label>Horário inicial *</label><input type="time" name="startTime" value={form.startTime} onChange={handleChange} /></div>
            <div className={styles.field}><label>Horário final *</label><input type="time" name="endTime" value={form.endTime} onChange={handleChange} /></div>
          </div>
          <div className={styles.field}><label>Local</label><input name="location" value={form.location} onChange={handleChange} /></div>
          <div className={styles.row}>
            <div className={styles.field}><label>Carga horária</label><input name="workload" value={form.workload} onChange={handleChange} /></div>
            <div className={styles.field}><label>Palestrante</label><input name="speaker" value={form.speaker} onChange={handleChange} placeholder="Nome" /></div>
          </div>
          <button type="submit" className={styles.submitBtn}><Save size={18} /> Salvar evento</button>
        </form>
      </div>
    </div>
  )
}
