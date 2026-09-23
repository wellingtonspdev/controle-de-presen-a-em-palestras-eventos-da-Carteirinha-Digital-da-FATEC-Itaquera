import { Routes, Route, Navigate } from 'react-router-dom'
import { Toast } from './components/Toast'
import { DemoSelector } from './screens/demo/DemoSelector'
import { AlunoHome } from './screens/aluno/AlunoHome'
import { AlunoEventos } from './screens/aluno/AlunoEventos'
import { AlunoScanner } from './screens/aluno/AlunoScanner'
import { AlunoCertificados } from './screens/aluno/AlunoCertificados'
import { AlunoCertificadoView } from './screens/aluno/AlunoCertificadoView'
import { SecretariaHome } from './screens/secretaria/SecretariaHome'
import { SecretariaEventos } from './screens/secretaria/SecretariaEventos'
import { SecretariaNovoEvento } from './screens/secretaria/SecretariaNovoEvento'
import { SecretariaGerenciarEvento } from './screens/secretaria/SecretariaGerenciarEvento'
import { CertificadoVerificar } from './screens/certificado/CertificadoVerificar'

export default function App() {
  return (
    <>
      <Toast />
      <Routes>
        <Route path="/" element={<Navigate to="/demo" replace />} />
        <Route path="/demo" element={<DemoSelector />} />
        <Route path="/aluno" element={<AlunoHome />} />
        <Route path="/aluno/eventos" element={<AlunoEventos />} />
        <Route path="/aluno/eventos/scanner" element={<AlunoScanner />} />
        <Route path="/aluno/certificados" element={<AlunoCertificados />} />
        <Route path="/aluno/certificados/:id" element={<AlunoCertificadoView />} />
        <Route path="/secretaria" element={<SecretariaHome />} />
        <Route path="/secretaria/eventos" element={<SecretariaEventos />} />
        <Route path="/secretaria/eventos/novo" element={<SecretariaNovoEvento />} />
        <Route path="/secretaria/eventos/:id" element={<SecretariaGerenciarEvento />} />
        <Route path="/certificado/verificar/:codigo" element={<CertificadoVerificar />} />
        <Route path="*" element={<Navigate to="/demo" replace />} />
      </Routes>
    </>
  )
}
