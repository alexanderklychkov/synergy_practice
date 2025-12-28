import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function FileUploader({ onUpload, loading }) {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Пожалуйста, выберите CSV файл')
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Пожалуйста, выберите файл')
      return
    }

    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      onUpload(response.data)
      setFile(null)
      // Сброс input
      const fileInput = document.getElementById('file-input')
      if (fileInput) fileInput.value = ''
    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка при загрузке файла: ' + err.message)
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Загрузка CSV файла</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <label className="flex-1">
          <input
            id="file-input"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
            disabled={uploading || loading}
          />
        </label>
        
        <button
          onClick={handleUpload}
          disabled={!file || uploading || loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
            disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors
            font-medium"
        >
          {uploading ? 'Загрузка...' : 'Загрузить'}
        </button>
      </div>

      {file && (
        <p className="mt-2 text-sm text-gray-600">
          Выбран файл: <span className="font-medium">{file.name}</span>
        </p>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded text-sm">
          {error}
        </div>
      )}
    </div>
  )
}

export default FileUploader

