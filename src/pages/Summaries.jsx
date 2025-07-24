import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  HiDocument, 
  HiFunnel, 
  HiMagnifyingGlass,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleLeft,
  HiChevronDoubleRight
} from 'react-icons/hi2'
import { useDataStore } from '../store'
import LoadingSpinner from '../components/LoadingSpinner'

const Summaries = () => {
  const { summaries } = useDataStore()
  const [filteredSummaries, setFilteredSummaries] = useState([])
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)

  // Get unique topics
  const topics = [...new Set(summaries.map(summary => summary.topic))].sort()

  // Filter summaries and reset pagination when filters change
  useEffect(() => {
    let filtered = summaries.filter(summary => {
      const topicMatch = selectedTopic === 'all' || summary.topic === selectedTopic
      const searchMatch = searchTerm === '' || 
        summary.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        summary.topic.toLowerCase().includes(searchTerm.toLowerCase())
      return topicMatch && searchMatch
    })

    setFilteredSummaries(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [summaries, selectedTopic, searchTerm])

  // Calculate pagination
  const totalPages = Math.ceil(filteredSummaries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentSummaries = filteredSummaries.slice(startIndex, endIndex)

  // Group current summaries by topic
  const summariesByTopic = currentSummaries.reduce((acc, summary) => {
    if (!acc[summary.topic]) {
      acc[summary.topic] = []
    }
    acc[summary.topic].push(summary)
    return acc
  }, {})

  if (!summaries.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Resúmenes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Accede a resúmenes organizados por temas para repasar rápidamente los conceptos clave.
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Buscar en resúmenes
              </label>
              <div className="relative">
                <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por contenido o tema..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Topic Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filtrar por tema
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todos los temas ({summaries.length})</option>
                {topics.map(topic => {
                  const count = summaries.filter(s => s.topic === topic).length
                  return (
                    <option key={topic} value={topic}>
                      {topic} ({count})
                    </option>
                  )
                })}
              </select>
            </div>

            {/* Items per page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Por página
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  const value = Number(e.target.value)
                  setItemsPerPage(value)
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value={3}>3 resúmenes</option>
                <option value={6}>6 resúmenes</option>
                <option value={9}>9 resúmenes</option>
                <option value={12}>12 resúmenes</option>
                <option value={Math.max(filteredSummaries.length, 1)}>Todos ({filteredSummaries.length})</option>
              </select>
            </div>
          </div>

          {/* Results info and pagination info */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando <span className="font-semibold text-primary-600 dark:text-primary-400">
                {Math.min(startIndex + 1, filteredSummaries.length)}-{Math.min(endIndex, filteredSummaries.length)}
              </span> de {filteredSummaries.length} resúmenes
              {searchTerm && (
                <span> para "{searchTerm}"</span>
              )}
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Página {currentPage} de {totalPages}
              </p>
            )}
          </div>
        </motion.div>

        {/* No Results */}
        {filteredSummaries.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <HiDocument className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No se encontraron resúmenes
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? `No hay resúmenes que coincidan con "${searchTerm}"`
                : 'Ajusta los filtros para ver los resúmenes disponibles'
              }
            </p>
            <button
              onClick={() => {
                setSearchTerm('')
                setSelectedTopic('all')
              }}
              className="btn-primary"
            >
              Limpiar filtros
            </button>
          </motion.div>
        )}

        {/* Summaries by Topic */}
        {Object.keys(summariesByTopic).length > 0 && (
          <div className="space-y-8">
            {Object.entries(summariesByTopic).map(([topic, topicSummaries], topicIndex) => (
              <motion.div
                key={topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: topicIndex * 0.1 }}
              >
                {/* Topic Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {topic}
                    </h2>
                  </div>
                </div>

                {/* Summaries Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {topicSummaries.map((summary, index) => (
                    <motion.div
                      key={summary.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (topicIndex * 0.1) + (index * 0.05) }}
                      className="card group hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <HiDocument className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                        </div>
                        
                        <div className="flex-1">
                          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                            {searchTerm ? (
                              // Highlight search term
                              summary.summary.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => 
                                part.toLowerCase() === searchTerm.toLowerCase() ? (
                                  <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">
                                    {part}
                                  </mark>
                                ) : part
                              )
                            ) : (
                              summary.summary
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 my-8"
          >
            {/* First Page */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronDoubleLeft className="w-5 h-5" />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                let pageNumber
                if (totalPages <= 5) {
                  pageNumber = index + 1
                } else if (currentPage <= 3) {
                  pageNumber = index + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index
                } else {
                  pageNumber = currentPage - 2 + index
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNumber
                        ? 'bg-primary-600 text-white'
                        : 'border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              })}
            </div>

            {/* Next Page */}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <HiChevronDoubleRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Summary Stats */}
        {filteredSummaries.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Estadísticas de Resúmenes
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  label: 'Total de resúmenes',
                  value: summaries.length,
                  icon: HiDocument
                },
                {
                  label: 'Temas cubiertos',
                  value: topics.length,
                  icon: HiFunnel
                },
                {
                  label: 'Resúmenes filtrados',
                  value: filteredSummaries.length,
                  icon: HiMagnifyingGlass
                }
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="text-center">
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Summaries
