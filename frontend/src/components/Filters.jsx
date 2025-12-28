function Filters({ categories, transactionTypes, filters, onFilterChange }) {
  const handleCategoryChange = (e) => {
    onFilterChange({
      ...filters,
      category: e.target.value
    })
  }

  const handleTransactionTypeChange = (e) => {
    onFilterChange({
      ...filters,
      transactionType: e.target.value
    })
  }

  const handleReset = () => {
    onFilterChange({
      category: '',
      transactionType: ''
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-semibold mb-4 sm:mb-0">Фильтры</h2>
        {(filters.category || filters.transactionType) && (
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Сбросить фильтры
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Категория
          </label>
          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              bg-white"
          >
            <option value="">Все категории</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип транзакции
          </label>
          <select
            value={filters.transactionType}
            onChange={handleTransactionTypeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              bg-white"
          >
            <option value="">Все типы</option>
            {transactionTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default Filters

