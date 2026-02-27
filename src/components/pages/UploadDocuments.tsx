import { useState } from 'react'
import type { DragEvent } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Upload, FileText, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import bankNames from '@/data/bankNames.json'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

type DocumentType = {
  key: string
  label: string
  description: string
}

const documentTypes: DocumentType[] = [
  { key: 'gst', label: 'GSTR-3b', description: 'GST Return Document' },
  { key: 'itr', label: 'ITR', description: 'Income Tax Return' },
  { key: 'cibilScore', label: 'CIBIL Score', description: 'Credit Report' },
  {
    key: 'bankStatement',
    label: 'Bank Statement',
    description: 'Latest 6 months',
  },
  { key: 'kyc', label: 'KYC', description: 'Identity Verification' },
]

const UploadDocuments = () => {
  const [selectedDocType, setSelectedDocType] = useState<string | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  // Bank Statement Form State
  const [bankStatementData, setBankStatementData] = useState({
    entityName: '',
    pan: '',
    companyType: '',
    bankName: '',
    accountType: '',
    accountNumber: '',
    ccodLimit: '',
    ccodCurrency: 'INR',
    keywords: '',
    loanRef: '',
  })

  const handleBankStatementChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setBankStatementData((prev) => ({ ...prev, [name]: value }))
  }

  const validateFile = (file: File): boolean => {
    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed')
      return false
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File size must be less than 10MB')
      return false
    }
    return true
  }

  const handleFileUpload = (file: File) => {
    if (validateFile(file)) {
      setUploadedFile(file)
      toast.success('Document uploaded successfully')
    }
  }

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFileUpload(files[0])
    }
  }

  const handleSubmit = async () => {
    if (!uploadedFile || !selectedDocType) {
      toast.error('Please upload a document')
      return
    }

    try {
      const formData = new FormData()
      formData.append('documentType', selectedDocType)
      formData.append('file', uploadedFile)

      // Replace with your actual API endpoint
      const response = await fetch('/api/upload-document', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      toast.success('Document submitted successfully!')
      setSelectedDocType(null)
      setUploadedFile(null)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to submit document. Please try again.')
    }
  }

  const handleBack = () => {
    setSelectedDocType(null)
    setUploadedFile(null)
  }

  const selectedDoc = documentTypes.find((d) => d.key === selectedDocType)

  return (
    <div className='min-h-screen'>
      <div className='container mx-auto px-4 py-12'>
        <div className='mb-8 flex'>
          <Link
            to='/'
            className='text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2'
          >
            <ArrowLeft className='w-4 h-4' />
            Home
          </Link>
        </div>

        <div className='max-w-5xl mx-auto'>
          {!selectedDocType ? (
            <>
              <div className='mb-12 text-center'>
                <h1 className='text-4xl font-bold bg-clip-text mb-3'>
                  Upload Document
                </h1>
                <p className='text-muted-foreground text-lg'>
                  Select the document type you want to upload
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {documentTypes.map((doc) => (
                  <button
                    key={doc.key}
                    onClick={() => setSelectedDocType(doc.key)}
                    className={cn(
                      'group relative overflow-hidden',
                      'rounded-2xl border-2 border-border bg-card p-8',
                      'hover:border-primary hover:bg-primary/5 hover:shadow-xl',
                      'transition-all duration-300 cursor-pointer',
                      'min-h-[180px] flex flex-col items-center justify-center text-center',
                    )}
                  >
                    <div className='space-y-4'>
                      <div className='mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform'>
                        <FileText className='w-8 h-8 text-primary' />
                      </div>
                      <div>
                        <h3 className='font-semibold text-xl mb-2'>
                          {doc.label}
                        </h3>
                        <p className='text-sm text-muted-foreground'>
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className='mb-4'>
                <button
                  onClick={handleBack}
                  className='text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-2'
                >
                  <ArrowLeft className='w-4 h-4' />
                  Change Document Type
                </button>
              </div>

              {selectedDocType === 'bankStatement' ? (
                <div className='bg-white rounded-lg shadow-sm border border-border p-8 text-left'>
                  <h2 className='text-[#1a237e] font-bold text-xl mb-6 uppercase'>
                    Analyse Single Bank Statement
                  </h2>

                  <div className='mb-6'>
                    <p className='text-sm'>
                      <span className='text-red-600 font-bold'>* Note:-</span>{' '}
                      Do not refresh or click on the menu/back button, while
                      request is in progress.
                    </p>
                    <div className='h-px bg-slate-200 mt-2' />
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6'>
                    <div className='space-y-1'>
                      <Label className='text-xs text-gray-400 font-normal'>
                        Entity Name
                      </Label>
                      <Input
                        name='entityName'
                        placeholder='Entity Name'
                        value={bankStatementData.entityName}
                        onChange={handleBankStatementChange}
                        className='h-10 border-slate-200'
                      />
                    </div>

                    <div className='space-y-1'>
                      <Label className='text-xs text-gray-400 font-normal'>
                        PAN
                      </Label>
                      <Input
                        name='pan'
                        placeholder='PAN'
                        value={bankStatementData.pan}
                        onChange={handleBankStatementChange}
                        className='h-10 border-slate-200'
                      />
                    </div>

                    <div className='space-y-1'>
                      <Label className='text-xs text-gray-400 font-normal'>
                        Company Type<span className='text-red-500'>*</span>
                      </Label>
                      <select
                        name='companyType'
                        value={bankStatementData.companyType}
                        onChange={handleBankStatementChange}
                        className='w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-ring'
                      >
                        <option value=''>Select Company Type</option>
                        <option value='Proprietorship'>Proprietorship</option>
                        <option value='Partnership'>Partnership</option>
                        <option value='Pvt Ltd'>Pvt Ltd</option>
                        <option value='Public Ltd'>Public Ltd</option>
                      </select>
                    </div>

                    <div className='space-y-1'>
                      <Label className='text-xs text-gray-400 font-normal'>
                        Bank Name<span className='text-red-500'>*</span>
                      </Label>
                      <select
                        name='bankName'
                        value={bankStatementData.bankName}
                        onChange={handleBankStatementChange}
                        className='w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-ring'
                      >
                        <option value=''>Select Bank</option>
                        {bankNames.map((bank) => (
                          <option key={bank.srNo} value={bank.bankName}>
                            {bank.bankName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className='space-y-1'>
                      <Label className='text-xs text-gray-400 font-normal'>
                        Account Type<span className='text-red-500'>*</span>
                      </Label>
                      <select
                        name='accountType'
                        value={bankStatementData.accountType}
                        onChange={handleBankStatementChange}
                        className='w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-ring'
                      >
                        <option value=''>Select Account Type</option>
                        <option value='Savings'>Savings</option>
                        <option value='Current'>Current</option>
                        <option value='OD'>OD</option>
                        <option value='CC'>CC</option>
                      </select>
                    </div>

                    <div className='space-y-1'>
                      <Label className='text-xs text-gray-400 font-normal'>
                        Account Number<span className='text-red-500'>*</span>
                      </Label>
                      <Input
                        name='accountNumber'
                        placeholder='Account Number'
                        value={bankStatementData.accountNumber}
                        onChange={handleBankStatementChange}
                        className='h-10 border-slate-200'
                      />
                    </div>

                    <div className='space-y-1'>
                      <Label className='text-xs text-gray-400 font-normal'>
                        CC/OD Limit
                      </Label>
                      <div className='flex gap-2'>
                        <Input
                          name='ccodLimit'
                          placeholder='CC / OD Limit'
                          value={bankStatementData.ccodLimit}
                          onChange={handleBankStatementChange}
                          className='h-10 border-slate-200 flex-1'
                        />
                        <select
                          name='ccodCurrency'
                          value={bankStatementData.ccodCurrency}
                          onChange={handleBankStatementChange}
                          className='w-24 h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-ring text-gray-500'
                        >
                          <option value='INR'>INR</option>
                        </select>
                      </div>
                    </div>

                    <div className='space-y-1'>
                      <Label className='text-xs text-gray-400 font-normal'>
                        Keywords for Inhouse
                      </Label>
                      <select
                        name='keywords'
                        value={bankStatementData.keywords}
                        onChange={handleBankStatementChange}
                        className='w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-hidden focus:ring-2 focus:ring-ring'
                      >
                        <option value=''>Select Keywords for Inhouse</option>
                        <option value='keyword1'>Keyword 1</option>
                      </select>
                    </div>

                    <div />

                    <div className='space-y-1'>
                      <Label className='text-xs text-gray-400 font-normal flex items-center gap-1'>
                        Loan Ref. No/Application Id{' '}
                        <span className='text-gray-400 font-normal'>
                          (Optional)
                        </span>
                      </Label>
                      <Input
                        name='loanRef'
                        placeholder='Loan Ref. No/Application Id'
                        value={bankStatementData.loanRef}
                        onChange={handleBankStatementChange}
                        className='h-10 border-slate-200'
                      />
                    </div>
                  </div>

                  <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-8'>
                    <div className='space-y-2'>
                      <input
                        type='file'
                        id='bank-file-upload'
                        className='hidden'
                        onChange={(e) => handleFileChange(e.target.files)}
                        multiple
                      />
                      <label
                        htmlFor='bank-file-upload'
                        className='inline-flex items-center gap-2 px-4 py-2 border border-[#1a237e] text-[#1a237e] rounded-md hover:bg-slate-50 cursor-pointer transition-colors text-sm font-medium'
                      >
                        <Upload className='w-4 h-4' />
                        Upload
                      </label>
                      <p className='text-[10px] text-gray-600 font-bold'>
                        Note:- You can add upto 12 files
                      </p>

                      {uploadedFile && (
                        <div className='mt-2 p-2 bg-slate-50 border border-border rounded-md flex items-center justify-between'>
                          <span className='text-xs truncate max-w-[200px]'>
                            {uploadedFile.name}
                          </span>
                          <CheckCircle2 className='w-4 h-4 text-green-500' />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='mt-12'>
                    <Button
                      onClick={handleSubmit}
                      className='bg-[#9fa8da] hover:bg-[#7986cb] text-white px-8 h-10 rounded-md flex items-center gap-2 transition-colors'
                      disabled={!uploadedFile}
                    >
                      <CheckCircle2 className='w-4 h-4' />
                      Submit
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className='mb-8 text-center'>
                    <h1 className='text-4xl font-bold bg-clip-text mb-3'>
                      Upload {selectedDoc?.label}
                    </h1>
                    <p className='text-muted-foreground text-lg'>
                      Drag and drop or click to upload PDF (Max 10MB)
                    </p>
                  </div>

                  <div className='max-w-2xl mx-auto'>
                    <input
                      type='file'
                      id='file-upload'
                      accept='.pdf'
                      onChange={(e) => handleFileChange(e.target.files)}
                      className='hidden'
                    />

                    <label
                      htmlFor='file-upload'
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={cn(
                        'block cursor-pointer transition-all duration-300',
                        'rounded-3xl border-2 border-dashed p-16',
                        'hover:border-primary hover:bg-primary/5 hover:shadow-xl',
                        'min-h-[400px] flex flex-col items-center justify-center',
                        isDragging &&
                          'border-primary bg-primary/10 scale-[1.02] shadow-2xl',
                        uploadedFile
                          ? 'border-primary bg-primary/5 shadow-lg'
                          : 'border-border bg-card',
                      )}
                    >
                      <div className='text-center space-y-6'>
                        {uploadedFile ? (
                          <>
                            <div className='mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center'>
                              <CheckCircle2 className='w-10 h-10 text-primary' />
                            </div>
                            <div>
                              <h3 className='font-semibold text-2xl mb-3'>
                                File Uploaded
                              </h3>
                              <div className='flex items-center justify-center gap-3 text-muted-foreground'>
                                <FileText className='w-5 h-5' />
                                <span className='text-lg'>
                                  {uploadedFile.name}
                                </span>
                              </div>
                              <p className='text-sm text-muted-foreground mt-2'>
                                {(uploadedFile.size / 1024 / 1024).toFixed(2)}{' '}
                                MB
                              </p>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                              Click to upload a different file
                            </p>
                          </>
                        ) : (
                          <>
                            <div className='mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center'>
                              <Upload className='w-10 h-10 text-muted-foreground' />
                            </div>
                            <div>
                              <h3 className='font-semibold text-2xl mb-3'>
                                Drop your PDF here
                              </h3>
                              <p className='text-muted-foreground text-lg'>
                                or click to browse
                              </p>
                            </div>
                            <p className='text-sm text-muted-foreground'>
                              Maximum file size: 10MB
                            </p>
                          </>
                        )}
                      </div>
                    </label>

                    <div className='mt-8 flex justify-center'>
                      <Button
                        onClick={handleSubmit}
                        size='lg'
                        className='h-14 px-16 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all'
                        disabled={!uploadedFile}
                      >
                        <Upload className='mr-3 h-6 w-6' />
                        Submit Document
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default UploadDocuments
