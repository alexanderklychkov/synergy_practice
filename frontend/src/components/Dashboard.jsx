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

  // Подготовка данных для Bar Chart: средний балл по курсам
  const courseScores = {}
  const courseCounts = {}
  
  data.forEach(item => {
    const course = item.course || 'Не указано'
    if (!courseScores[course]) {
      courseScores[course] = 0
      courseCounts[course] = 0
    }
    courseScores[course] += item.score || 0
    courseCounts[course] += 1
  })

  const courses = Object.keys(courseScores)
  const averageScores = courses.map(course => 
    (courseScores[course] / courseCounts[course]).toFixed(1)
  )

  const barData = {
    labels: courses,
    datasets: [
      {
        label: 'Средний балл',
        data: averageScores,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1
      }
    ]
  }

  // Подготовка данных для Line Chart: активность по дням
  const dateActivity = {}
  
  data.forEach(item => {
    const date = item.date || ''
    if (date) {
      dateActivity[date] = (dateActivity[date] || 0) + 1
    }
  })

  const sortedDates = Object.keys(dateActivity).sort()
  const activityCounts = sortedDates.map(date => dateActivity[date])

  const lineData = {
    labels: sortedDates.slice(-30), // Последние 30 дней
    datasets: [
      {
        label: 'Количество активностей',
        data: activityCounts.slice(-30),
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  // Подготовка данных для Pie Chart: распределение по типам активностей
  const activityTypeCounts = {}
  
  data.forEach(item => {
    const type = item.activity_type || 'Не указано'
    activityTypeCounts[type] = (activityTypeCounts[type] || 0) + 1
  })

  const activityTypes = Object.keys(activityTypeCounts)
  const typeCounts = activityTypes.map(type => activityTypeCounts[type])

  const colors = [
    'rgba(59, 130, 246, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)'
  ]

  const pieData = {
    labels: activityTypes,
    datasets: [
      {
        label: 'Количество',
        data: typeCounts,
        backgroundColor: colors.slice(0, activityTypes.length),
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
          <h3 className="text-lg font-semibold mb-4">Средний балл по курсам</h3>
          <div className="h-64">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Распределение по типам активностей</h3>
          <div className="h-64">
            <Pie data={pieData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Активность по дням (последние 30 дней)</h3>
        <div className="h-64">
          <Line data={lineData} options={chartOptions} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

