import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  HiBookOpen, 
  HiMagnifyingGlass, 
  HiBars3BottomLeft, 
  HiBars3BottomRight,
  HiChevronLeft,
  HiChevronRight,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiViewColumns,
  HiQueueList,
  HiAdjustmentsHorizontal
} from 'react-icons/hi2'
import { useDataStore } from '../store'
import LoadingSpinner from '../components/LoadingSpinner'

const Glossary = () => {
  const { glossary } = useDataStore()
  const [filteredGlossary, setFilteredGlossary] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' or 'desc'
  
  // Pagination and view states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [viewMode, setViewMode] = useState('comfortable') // 'compact' or 'comfortable'

  // Filter and sort glossary, reset pagination when filters change
  useEffect(() => {
    let filtered = glossary.filter(entry => 
      entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.definition.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Sort alphabetically
    filtered.sort((a, b) => {
      const compareResult = a.term.localeCompare(b.term, 'es', { sensitivity: 'base' })
      return sortOrder === 'asc' ? compareResult : -compareResult
    })

    setFilteredGlossary(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [glossary, searchTerm, sortOrder])

  // Calculate pagination
  const totalPages = Math.ceil(filteredGlossary.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTerms = filteredGlossary.slice(startIndex, endIndex)

  // Group current terms by first letter (for comfortable view)
  const glossaryByLetter = currentTerms.reduce((acc, entry) => {
    const firstLetter = entry.term.charAt(0).toUpperCase()
    if (!acc[firstLetter]) {
      acc[firstLetter] = []
    }
    acc[firstLetter].push(entry)
    return acc
  }, {})

  const letters = Object.keys(glossaryByLetter).sort()

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const scrollToLetter = (letter) => {
    const element = document.getElementById(`letter-${letter}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (!glossary.length) {
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
            Glosario
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Consulta definiciones de términos importantes de administración organizados alfabéticamente.
          </p>
        </motion.div>

        {/* Search and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card mb-8"
        >
          {/* Main controls row */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4 mb-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar términos o definiciones..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Controls group */}
            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('comfortable')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'comfortable'
                      ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="Vista cómoda"
                >
                  <HiQueueList className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('compact')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'compact'
                      ? 'bg-white dark:bg-gray-600 text-primary-600 dark:text-primary-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                  title="Vista compacta"
                >
                  <HiViewColumns className="w-5 h-5" />
                </button>
              </div>

              {/* Sort Control */}
              <button
                onClick={handleSortToggle}
                className="flex items-center space-x-2 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {sortOrder === 'asc' ? (
                  <HiBars3BottomLeft className="w-5 h-5" />
                ) : (
                  <HiBars3BottomRight className="w-5 h-5" />
                )}
                <span>{sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</span>
              </button>
            </div>
          </div>

          {/* Second row with pagination controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            {/* Items per page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Términos por página
              </label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value))
                  setCurrentPage(1)
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value={6}>6 términos</option>
                <option value={12}>12 términos</option>
                <option value={18}>18 términos</option>
                <option value={24}>24 términos</option>
                <option value={Math.max(filteredGlossary.length, 1)}>Todos ({filteredGlossary.length})</option>
              </select>
            </div>

            {/* Page info */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Mostrando <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {Math.min(startIndex + 1, filteredGlossary.length)}-{Math.min(endIndex, filteredGlossary.length)}
                </span> de {filteredGlossary.length} términos
                {totalPages > 1 && (
                  <span className="block mt-1">
                    Página {currentPage} de {totalPages}
                  </span>
                )}
              </div>
            </div>

            {/* Quick stats */}
            <div className="flex items-end justify-end">
              <div className="text-sm text-gray-500 dark:text-gray-400 text-right">
                <span className="font-semibold text-primary-600 dark:text-primary-400">
                  {Object.keys(glossaryByLetter).length}
                </span> letras en esta página
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alphabet Navigation - Updated for pagination */}
        {!searchTerm && filteredGlossary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Navegación alfabética:
              </p>
              <div className="flex flex-wrap gap-2">
                {/* Show all available letters from filtered glossary */}
                {[...new Set(filteredGlossary.map(entry => entry.term.charAt(0).toUpperCase()))].sort().map(letter => {
                  // Find which page contains this letter
                  const letterIndex = filteredGlossary.findIndex(entry => entry.term.charAt(0).toUpperCase() === letter)
                  const targetPage = Math.floor(letterIndex / itemsPerPage) + 1
                  
                  return (
                    <button
                      key={letter}
                      onClick={() => setCurrentPage(targetPage)}
                      className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                        Object.keys(glossaryByLetter).includes(letter)
                          ? 'bg-primary-600 text-white'
                          : 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/30'
                      }`}
                      title={`Ir a página ${targetPage} (Letra ${letter})`}
                    >
                      {letter}
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* No Results */}
        {filteredGlossary.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <HiBookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No se encontraron términos
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm 
                ? `No hay términos que coincidan con "${searchTerm}"`
                : 'Ajusta los filtros para ver los términos disponibles'
              }
            </p>
            <button
              onClick={() => setSearchTerm('')}
              className="btn-primary"
            >
              Limpiar búsqueda
            </button>
          </motion.div>
        )}

        {/* Glossary Entries */}
        {currentTerms.length > 0 && (
          <>
            {viewMode === 'comfortable' ? (
              /* Comfortable View - Grouped by letters */
              <div className="space-y-8">
                {Object.keys(glossaryByLetter).sort().map((letter, letterIndex) => (
                  <motion.div
                    key={letter}
                    id={`letter-${letter}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: letterIndex * 0.05 }}
                  >
                    {/* Letter Header */}
                    {!searchTerm && (
                      <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
                          <span className="text-2xl font-bold text-white">{letter}</span>
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Letra {letter}
                          </h2>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {glossaryByLetter[letter].length} términos
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Terms */}
                    <div className="space-y-4">
                      {glossaryByLetter[letter].map((entry, index) => (
                        <motion.div
                          key={`${entry.term}-${index}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (letterIndex * 0.05) + (index * 0.02) }}
                          className="card group hover:shadow-xl transition-all duration-300"
                        >
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                              <HiBookOpen className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                                {searchTerm ? (
                                  // Highlight search term in title
                                  entry.term.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => 
                                    part.toLowerCase() === searchTerm.toLowerCase() ? (
                                      <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">
                                        {part}
                                      </mark>
                                    ) : part
                                  )
                                ) : (
                                  entry.term
                                )}
                              </h3>
                              
                              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                                {searchTerm ? (
                                  // Highlight search term in definition
                                  entry.definition.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => 
                                    part.toLowerCase() === searchTerm.toLowerCase() ? (
                                      <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">
                                        {part}
                                      </mark>
                                    ) : part
                                  )
                                ) : (
                                  entry.definition
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
            ) : (
              /* Compact View - Grid layout */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {currentTerms.map((entry, index) => (
                  <motion.div
                    key={`${entry.term}-${index}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="card group hover:shadow-xl transition-all duration-300 h-full"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <HiBookOpen className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                          {searchTerm ? (
                            // Highlight search term in title
                            entry.term.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => 
                              part.toLowerCase() === searchTerm.toLowerCase() ? (
                                <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">
                                  {part}
                                </mark>
                              ) : part
                            )
                          ) : (
                            entry.term
                          )}
                        </h3>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 line-clamp-4">
                        {searchTerm ? (
                          // Highlight search term in definition
                          entry.definition.split(new RegExp(`(${searchTerm})`, 'gi')).map((part, i) => 
                            part.toLowerCase() === searchTerm.toLowerCase() ? (
                              <mark key={i} className="bg-yellow-200 dark:bg-yellow-800/50 px-1 rounded">
                                {part}
                              </mark>
                            ) : part
                          )
                        ) : (
                          entry.definition
                        )}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
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
              title="Primera página"
            >
              <HiChevronDoubleLeft className="w-5 h-5" />
            </button>

            {/* Previous Page */}
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Página anterior"
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
              title="Página siguiente"
            >
              <HiChevronRight className="w-5 h-5" />
            </button>

            {/* Last Page */}
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Última página"
            >
              <HiChevronDoubleRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Glossary Stats */}
        {filteredGlossary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-primary-900/10 dark:to-secondary-900/10 rounded-2xl p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Estadísticas del Glosario
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {[
                {
                  label: 'Total de términos',
                  value: glossary.length,
                  icon: HiBookOpen
                },
                {
                  label: 'Términos filtrados',
                  value: filteredGlossary.length,
                  icon: HiMagnifyingGlass
                },
                {
                  label: 'Modo de vista',
                  value: viewMode === 'comfortable' ? 'Cómodo' : 'Compacto',
                  icon: viewMode === 'comfortable' ? HiQueueList : HiViewColumns
                },
                {
                  label: 'Páginas totales',
                  value: totalPages,
                  icon: HiAdjustmentsHorizontal
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

export default Glossary
