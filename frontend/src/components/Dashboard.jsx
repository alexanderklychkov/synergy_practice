import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

function Dashboard({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
        Нет данных для отображения графиков
      </div>
    )
  }

  // Подготовка данных для Bar Chart: сумма по категориям
  const categoryAmounts = {}
  
  data.forEach(item => {
    const category = item.category || 'Не указано'
    if (!categoryAmounts[category]) {
      categoryAmounts[category] = 0
    }
    categoryAmounts[category] += item.amount || 0
  })

  const categories = Object.keys(categoryAmounts)
  const amounts = categories.map(category => categoryAmounts[category])

  const barData = {
    labels: categories,
    datasets: [
      {
        label: 'Сумма (руб.)',
        data: amounts,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }
    ]
  }

  // Подготовка данных для Line Chart: сумма транзакций по дням
  const dateAmounts = {}
  
  data.forEach(item => {
    const date = item.date || ''
    if (date) {
      if (!dateAmounts[date]) {
        dateAmounts[date] = 0
      }
      dateAmounts[date] += item.amount || 0
    }
  })

  const sortedDates = Object.keys(dateAmounts).sort()
  const amountsByDate = sortedDates.map(date => dateAmounts[date])

  const lineData = {
    labels: sortedDates.slice(-30), // Последние 30 дней
    datasets: [
      {
        label: 'Сумма транзакций (руб.)',
        data: amountsByDate.slice(-30),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  // Подготовка данных для Pie Chart: распределение по типам транзакций
  const transactionTypeCounts = {}
  
  data.forEach(item => {
    const type = item.transaction_type || 'Не указано'
    transactionTypeCounts[type] = (transactionTypeCounts[type] || 0) + 1
  })

  const transactionTypes = Object.keys(transactionTypeCounts)
  const typeCounts = transactionTypes.map(type => transactionTypeCounts[type])

  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)'
  ]

  const pieData = {
    labels: transactionTypes,
    datasets: [
      {
        label: 'Количество',
        data: typeCounts,
        backgroundColor: colors.slice(0, transactionTypes.length),
        borderColor: 'rgba(255, 255, 255, 1)',
        borderWidth: 2
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      }
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Графики и визуализация</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Сумма по категориям</h3>
          <div className="h-64">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Распределение по типам транзакций</h3>
          <div className="h-64">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Сумма транзакций по дням (последние 30 дней)</h3>
        <div className="h-64">
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

