import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  HiDocument, 
  HiMagnifyingGlass
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

  // Ref for content area to scroll to
  const contentRef = useRef(null)
  const topPaginationRef = useRef(null)

  // Get unique topics
  const topics = [...new Set(summaries.map(summary => summary.topic))].sort()

  // Professional page change handler with smooth scroll
  const handlePageChange = (newPage, scrollToContent = false) => {
    setCurrentPage(newPage)
    
    // Scroll to top pagination when changing page from bottom pagination (professional UX)
    if (scrollToContent && topPaginationRef.current) {
      setTimeout(() => {
        topPaginationRef.current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        })
      }, 100) // Small delay to ensure content is updated
    }
  }

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

        {/* Top Pagination - Minimal design for quick access */}
        <div ref={topPaginationRef}>
          {totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center space-x-3 py-2 mb-6"
            >
              <button
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                ← Anterior
              </button>
              
              <span className="text-sm text-gray-600 dark:text-gray-400 font-medium px-3">
                {currentPage} / {totalPages}
              </span>
              
              <button
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente →
              </button>
            </motion.div>
          )}
        </div>

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
        <div ref={contentRef}>
          {Object.keys(summariesByTopic).length > 0 && (
            <motion.div
              key={currentPage} // Key change triggers smooth re-render
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-8"
            >
              {Object.entries(summariesByTopic).map(([topic, topicSummaries], topicIndex) => (
                <div key={topic}>
                  {/* Topic Header */}
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-2 h-8 bg-primary-600 rounded-full"></div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {topic}
                      </h2>
                    </div>
                  </div>

                  {/* Summaries Grid - Simplified animation */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {topicSummaries.map((summary, index) => (
                      <div
                        key={summary.id}
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
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Pagination Controls - Original design restored with professional scroll behavior */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 my-8"
          >
            {/* Previous Page */}
            <button
              onClick={() => handlePageChange(currentPage - 1, true)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
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
                    onClick={() => handlePageChange(pageNumber, true)}
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
              onClick={() => handlePageChange(currentPage + 1, true)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Summaries
