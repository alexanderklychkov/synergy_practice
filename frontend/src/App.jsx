import { useState, useEffect } from 'react'
import FileUploader from './components/FileUploader'
import Dashboard from './components/Dashboard'
import MetricsCards from './components/MetricsCards'
import Filters from './components/Filters'
import DataTable from './components/DataTable'
import axios from 'axios'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function App() {
  const [data, setData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [filters, setFilters] = useState({
    course: '',
    activityType: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Загрузка тестовых данных при монтировании
  useEffect(() => {
    loadSampleData()
  }, [])

  // Применение фильтров
  useEffect(() => {
    let filtered = [...data]
    
    if (filters.course) {
      filtered = filtered.filter(item => item.course === filters.course)
    }
    
    if (filters.activityType) {
      filtered = filtered.filter(item => item.activity_type === filters.activityType)
    }
    
    setFilteredData(filtered)
  }, [data, filters])

  const loadSampleData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`${API_URL}/api/sample-data?count=100`)
      setData(response.data)
    } catch (err) {
      setError('Ошибка при загрузке данных: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (fileData) => {
    setLoading(true)
    setError(null)
    try {
      setData(fileData)
    } catch (err) {
      setError('Ошибка при обработке данных: ' + err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const courses = [...new Set(data.map(item => item.course))].filter(Boolean)
  const activityTypes = [...new Set(data.map(item => item.activity_type))].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Educational Data Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Визуализация учебных данных</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="mb-6">
          <FileUploader onUpload={handleFileUpload} loading={loading} />
        </div>

        {loading && data.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Загрузка данных...</p>
          </div>
        ) : data.length > 0 ? (
          <>
            <MetricsCards data={filteredData} />
            
            <div className="mt-6">
              <Filters
                courses={courses}
                activityTypes={activityTypes}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            <div className="mt-6">
              <Dashboard data={filteredData} />
            </div>

            <div className="mt-6">
              <DataTable data={filteredData} />
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Загрузите CSV файл или используйте тестовые данные</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

