function Filters({ courses, activityTypes, filters, onFilterChange }) {
  const handleCourseChange = (e) => {
    onFilterChange({
      ...filters,
      course: e.target.value
    })
  }

  const handleActivityTypeChange = (e) => {
    onFilterChange({
      ...filters,
      activityType: e.target.value
    })
  }

  const handleReset = () => {
    onFilterChange({
      course: '',
      activityType: ''
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-xl font-semibold mb-4 sm:mb-0">Фильтры</h2>
        {(filters.course || filters.activityType) && (
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
            Курс
          </label>
          <select
            value={filters.course}
            onChange={handleCourseChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              bg-white"
          >
            <option value="">Все курсы</option>
            {courses.map((course, index) => (
              <option key={index} value={course}>
                {course}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Тип активности
          </label>
          <select
            value={filters.activityType}
            onChange={handleActivityTypeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
              bg-white"
          >
            <option value="">Все типы</option>
            {activityTypes.map((type, index) => (
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

