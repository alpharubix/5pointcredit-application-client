import { Toaster as Sonner } from '@/components/ui/sonner'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CreateCustomer from './components/pages/CreateCustomer'
import NotFound from './components/pages/NotFound'
import Index from './components/pages/Index';
import UploadDocuments from './components/pages/UploadDocuments'

const App = () => (
  <BrowserRouter>
    <Sonner richColors  position='top-center'/>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/create-customer" element={<CreateCustomer />} />
      <Route path="/upload-pdf" element={<UploadDocuments />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
)

export default App
