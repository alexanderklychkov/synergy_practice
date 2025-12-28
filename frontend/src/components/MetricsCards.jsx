function MetricsCards({ data }) {
  // Вычисление финансовых метрик
  const totalRecords = data.length
  
  const totalAmount = data.reduce((sum, item) => sum + (item.amount || 0), 0)
  const averageAmount = data.length > 0
    ? (totalAmount / data.length).toFixed(0)
    : 0

  const incomeAmount = data
    .filter(item => item.category === 'Доход' || item.category === 'Возврат' || item.category === 'Инвестиция')
    .reduce((sum, item) => sum + (item.amount || 0), 0)
  
  const expenseAmount = data
    .filter(item => item.category === 'Расход')
    .reduce((sum, item) => sum + (item.amount || 0), 0)

  const uniqueClients = new Set(data.map(item => item.client)).size

  const metrics = [
    {
      title: 'Всего транзакций',
      value: totalRecords,
      icon: '📊',
      color: 'bg-blue-500'
    },
    {
      title: 'Общая сумма',
      value: totalAmount.toLocaleString('ru-RU'),
      icon: '💰',
      color: 'bg-green-500'
    },
    {
      title: 'Средняя сумма',
      value: averageAmount.toLocaleString('ru-RU'),
      icon: '💵',
      color: 'bg-purple-500'
    },
    {
      title: 'Уникальных клиентов',
      value: uniqueClients,
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

