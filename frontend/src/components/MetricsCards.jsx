function MetricsCards({ data }) {
  // Вычисление метрик
  const totalRecords = data.length
  
  const averageScore = data.length > 0
    ? (data.reduce((sum, item) => sum + (item.score || 0), 0) / data.length).toFixed(1)
    : 0

  const totalTime = data.reduce((sum, item) => sum + (item.time_min || 0), 0)
  const averageTime = data.length > 0
    ? (totalTime / data.length).toFixed(0)
    : 0

  const uniqueStudents = new Set(data.map(item => item.student)).size

  const metrics = [
    {
      title: 'Всего записей',
      value: totalRecords,
      icon: '📊',
      color: 'bg-blue-500'
    },
    {
      title: 'Средний балл',
      value: averageScore,
      icon: '⭐',
      color: 'bg-green-500'
    },
    {
      title: 'Среднее время (мин)',
      value: averageTime,
      icon: '⏱️',
      color: 'bg-purple-500'
    },
    {
      title: 'Уникальных студентов',
      value: uniqueStudents,
      icon: '👥',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">{metric.title}</p>
              <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            </div>
            <div className={`${metric.color} rounded-full p-3 text-2xl`}>
              {metric.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MetricsCards

