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
    category: '',
    transactionType: ''
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
    
    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category)
    }
    
    if (filters.transactionType) {
      filtered = filtered.filter(item => item.transaction_type === filters.transactionType)
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

  const categories = [...new Set(data.map(item => item.category))].filter(Boolean)
  const transactionTypes = [...new Set(data.map(item => item.transaction_type))].filter(Boolean)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">FinTech Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Визуализация финансовых транзакций</p>
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
                categories={categories}
                transactionTypes={transactionTypes}
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

