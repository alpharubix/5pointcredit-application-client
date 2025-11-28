import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/shadcn-io/dropzone'

import { useState } from 'react'
import { Button } from './components/ui/button'

const App = () => {
  const [files, setFiles] = useState<File[] | undefined>()
  const handleDrop = (files: File[]) => {
    console.log(files)
    setFiles(files)
  }

  return (
    <>
      <div className='flex justify-center items-center h-screen'>
        <div>
          <Dropzone
            accept={{ 'image/*': [] }}
            maxFiles={10}
            maxSize={1024 * 1024 * 10}
            minSize={1024}
            onDrop={handleDrop}
            onError={console.error}
            src={files}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
            <div>
              {files && (
                <Button
                  className=''
                  variant='default'
                  onClick={() => console.log(files)}
                >
                  Send File
                </Button>
              )}
            </div>
          </Dropzone>
        </div>
      </div>
    </>
  )
}
export default App
