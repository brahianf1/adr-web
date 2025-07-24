import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  ArrowPathIcon, 
  CheckIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  XMarkIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowUturnDownIcon,
  ArrowUturnUpIcon
} from '@heroicons/react/24/outline'
import { useDataStore, useStudyStore } from '../store'
import LoadingSpinner from '../components/LoadingSpinner'

const Flashcards = () => {
  const { flashcards } = useDataStore()
  const { 
    currentFlashcardIndex, 
    studiedFlashcards,
    setCurrentFlashcardIndex,
    markFlashcardStudied,
    resetFlashcards,
    updateStudyProgress
  } = useStudyStore()

  const [isFlipped, setIsFlipped] = useState(false)
  const [showInstructions, setShowInstructions] = useState(() => {
    // Check if user has already learned how to use flashcards
    const hasSeenInstructions = localStorage.getItem('flashcards-instructions-seen')
    return !hasSeenInstructions
  })
  const [flipCount, setFlipCount] = useState(0)
  const [filteredCards, setFilteredCards] = useState([])
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [isShuffled, setIsShuffled] = useState(true)
  const [isStudyMode, setIsStudyMode] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  // Get unique topics and difficulties
  const topics = [...new Set(flashcards.map(card => card.topic))].sort()
  const difficulties = [...new Set(flashcards.map(card => card.difficulty))].sort()

  // Filter and shuffle cards
  useEffect(() => {
    let filtered = flashcards.filter(card => {
      const topicMatch = selectedTopic === 'all' || card.topic === selectedTopic
      const difficultyMatch = selectedDifficulty === 'all' || card.difficulty === selectedDifficulty
      return topicMatch && difficultyMatch
    })

    if (isShuffled) {
      filtered = [...filtered].sort(() => Math.random() - 0.5)
    }

    setFilteredCards(filtered)
    setCurrentFlashcardIndex(0)
    setIsFlipped(false)
  }, [flashcards, selectedTopic, selectedDifficulty, isShuffled, setCurrentFlashcardIndex])

  const currentCard = filteredCards[currentFlashcardIndex]
  const totalCards = filteredCards.length
  const studiedCount = filteredCards.filter(card => studiedFlashcards.has(card.id)).length

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    
    // Count flips for onboarding
    if (showInstructions) {
      const newFlipCount = flipCount + 1
      setFlipCount(newFlipCount)
      
      // Hide instructions after 3 flips
      if (newFlipCount >= 3) {
        setShowInstructions(false)
        localStorage.setItem('flashcards-instructions-seen', 'true')
      }
    }
    
    if (!isFlipped && currentCard && !studiedFlashcards.has(currentCard.id)) {
      markFlashcardStudied(currentCard.id)
      updateStudyProgress('flashcard', currentCard.id)
    }
  }

  const handleNext = () => {
    if (currentFlashcardIndex < totalCards - 1) {
      setIsFlipped(false) // Reset immediately before changing
      setCurrentFlashcardIndex(currentFlashcardIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentFlashcardIndex > 0) {
      setIsFlipped(false) // Reset immediately before changing
      setCurrentFlashcardIndex(currentFlashcardIndex - 1)
    }
  }

  // Keyboard controls for desktop navigation
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Only handle keyboard events if not typing in an input field
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'SELECT' || event.target.tagName === 'TEXTAREA') {
        return
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          if (currentFlashcardIndex > 0) {
            handlePrevious()
          }
          break
        case 'ArrowRight':
          event.preventDefault()
          if (currentFlashcardIndex < totalCards - 1) {
            handleNext()
          }
          break
        case 'ArrowUp':
        case 'ArrowDown':
          event.preventDefault()
          handleFlip()
          break
        case ' ': // Spacebar as alternative to flip
          event.preventDefault()
          handleFlip()
          break
        default:
          break
      }
    }

    // Add event listener
    window.addEventListener('keydown', handleKeyPress)

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [currentFlashcardIndex, totalCards, isFlipped, handleNext, handlePrevious, handleFlip]) // Dependencies to ensure handlers have current values

  const handleReset = () => {
    resetFlashcards()
    setIsFlipped(false)
    setCurrentFlashcardIndex(0)
    
    // Si el modo aleatorio está activo, reordenar las tarjetas
    if (isShuffled) {
      setFilteredCards(prevCards => [...prevCards].sort(() => Math.random() - 0.5))
    }
  }

  const handleShuffle = () => {
    setIsShuffled(!isShuffled)
    // Toast removed for better UX - shuffle state is visible in button
  }

  const startStudyMode = () => {
    setIsStudyMode(true)
    setShowSettings(false)
    // Hide instructions in study mode for focused experience
    setShowInstructions(false)
    
    // Si el modo aleatorio está activo, reordenar las tarjetas al iniciar
    if (isShuffled) {
      setFilteredCards(prevCards => [...prevCards].sort(() => Math.random() - 0.5))
    }
  }

  const exitStudyMode = () => {
    setIsStudyMode(false)
  }

  // Touch gesture handlers for better mobile experience
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const [touchStartY, setTouchStartY] = useState(null)
  const [touchEndY, setTouchEndY] = useState(null)

  const minSwipeDistance = 50

  const onTouchStart = (e) => {
    setTouchEnd(null)
    setTouchEndY(null)
    setTouchStart(e.targetTouches[0].clientX)
    setTouchStartY(e.targetTouches[0].clientY)
  }

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
    setTouchEndY(e.targetTouches[0].clientY)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !touchStartY || !touchEndY) return
    
    const horizontalDistance = touchStart - touchEnd
    const verticalDistance = touchStartY - touchEndY
    const isLeftSwipe = horizontalDistance > minSwipeDistance
    const isRightSwipe = horizontalDistance < -minSwipeDistance
    const isUpSwipe = verticalDistance > minSwipeDistance
    const isDownSwipe = verticalDistance < -minSwipeDistance

    // Priorizar gestos horizontales para navegación
    if (Math.abs(horizontalDistance) > Math.abs(verticalDistance)) {
      if (isLeftSwipe && currentFlashcardIndex < totalCards - 1) {
        handleNext()
      }
      if (isRightSwipe && currentFlashcardIndex > 0) {
        handlePrevious()
      }
    } else {
      // Gestos verticales para marcar progreso (futuro: implementar dificultad)
      if (isUpSwipe) {
        // Marcar como fácil/sabida - por ahora solo flip
        if (!isFlipped) handleFlip()
      }
      if (isDownSwipe) {
        // Marcar como difícil - por ahora solo flip
        if (!isFlipped) handleFlip()
      }
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'fácil':
        return 'difficulty-easy'
      case 'medio':
        return 'difficulty-medium'
      case 'difícil':
        return 'difficulty-hard'
      default:
        return 'difficulty-easy'
    }
  }

  const capitalizeFirst = (text) => {
    if (!text) return text
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
  }

  if (!flashcards.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!totalCards) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <FunnelIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No hay flashcards para mostrar
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ajusta los filtros para ver las flashcards disponibles.
            </p>
            <button
              onClick={() => {
                setSelectedTopic('all')
                setSelectedDifficulty('all')
              }}
              className="btn-primary"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Study Mode - Fullscreen focused experience
  if (isStudyMode) {
    return (
      <div 
        className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex flex-col overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: 'none' }} // Disable all native touch behaviors on mobile
      >
        {/* Minimal Header */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm">
          <button
            onClick={exitStudyMode}
            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
          
          {/* Card counter */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              {currentFlashcardIndex + 1} / {totalCards}
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Cog6ToothIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Full-width Progress Bar - Completely separate component */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-3">
          <div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-3 transition-all duration-500 ease-out"
            style={{ width: `${((currentFlashcardIndex + 1) / totalCards) * 100}%` }}
          />
        </div>

        {/* Settings Panel (collapsible) */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Tema
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="all">Todos</option>
                      {topics.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Dificultad
                    </label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-primary-500"
                    >
                      <option value="all">Todas</option>
                      {difficulties.map(difficulty => (
                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleShuffle}
                    className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs rounded transition-colors ${
                      isShuffled 
                        ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <ArrowsUpDownIcon className="w-3 h-3" />
                    <span>Aleatorio</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded transition-colors"
                  >
                    <ArrowPathIcon className="w-3 h-3" />
                    <span>Reiniciar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Flashcard Area - Full swipe area */}
        <div className="flex-1 flex items-center justify-center p-4 w-full h-full">
          <motion.div
            key={currentCard?.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl"
          >
            <div 
              className={`flip-card h-80 sm:h-96 ${isFlipped ? 'flipped' : ''}`}
            >
              <div
                className="flip-card-inner w-full h-full cursor-pointer"
                onClick={handleFlip}
              >
                {/* Front */}
                <div className="flip-card-front absolute inset-0 w-full h-full">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl h-full relative p-6 sm:p-8">
                    {/* Header positioned absolutely to not affect centering */}
                    <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentCard?.difficulty)}`}>
                        {capitalizeFirst(currentCard?.difficulty)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {currentCard?.topic}
                      </span>
                    </div>
                    
                    {/* Content centered in full card */}
                    <div className="h-full flex items-center justify-center">
                      <h2 className="flashcard-content text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center leading-relaxed break-words hyphens-auto w-full px-2">
                        {currentCard?.question}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div className="flip-card-back absolute inset-0 w-full h-full">
                  <div className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl shadow-xl h-full relative p-6 sm:p-8 border-l-4 border-primary-500">
                    {/* Content centered in full card */}
                    <div className="h-full flex items-center justify-center">
                      <div className="flashcard-content text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 dark:text-gray-300 text-center leading-relaxed break-words hyphens-auto max-h-full overflow-y-auto w-full px-2">
                        {currentCard?.answer}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile-Optimized Navigation */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-4">
            {/* Left Side - Previous Button */}
            <button
              onClick={handlePrevious}
              disabled={currentFlashcardIndex === 0}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                currentFlashcardIndex === 0
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/30 active:scale-95'
              }`}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>

            {/* Center Actions */}
            <div className="flex items-center space-x-4">
              {/* Restart Button */}
              <button
                onClick={handleReset}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 active:scale-95 transition-all duration-200"
                title="Reiniciar flashcards"
              >
                <ArrowPathIcon className="w-5 h-5" />
              </button>

              {/* Center Action - Flip Indicator */}
              <div 
                onClick={handleFlip}
                className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full text-white cursor-pointer hover:shadow-lg active:scale-95 transition-all duration-200"
              >
                <motion.div
                  animate={{ 
                    rotateZ: isFlipped ? 180 : 0,
                    scale: isFlipped ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  {isFlipped ? (
                    <ArrowUturnDownIcon className="w-6 h-6" />
                  ) : (
                    <EyeIcon className="w-6 h-6" />
                  )}
                </motion.div>
              </div>
            </div>

            {/* Right Side - Next Button */}
            <button
              onClick={handleNext}
              disabled={currentFlashcardIndex === totalCards - 1}
              className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 ${
                currentFlashcardIndex === totalCards - 1
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-200 dark:hover:bg-primary-900/30 active:scale-95'
              }`}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Flashcards
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
            Estudia con tarjetas interactivas. Configura tus preferencias y comienza el modo de estudio enfocado.
          </p>
          
          {/* Keyboard Controls Hint */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
            <div className="flex items-center space-x-1">
              <span className="hidden sm:inline">Teclado:</span>
              <div className="flex items-center space-x-1">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">←</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">→</span>
                <span className="text-xs hidden sm:inline">navegar</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <div className="flex items-center space-x-1">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">↑</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">↓</span>
                <span className="text-xs hidden sm:inline">voltear</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono">Space</span>
              <span className="text-xs hidden sm:inline">voltear</span>
            </div>
          </div>
          
          {/* Study Mode Button */}
          <div className="flex justify-center">
            <button
              onClick={startStudyMode}
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Comenzar Estudio
            </button>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 shadow-lg"
        >
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tema
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todos los temas</option>
                {topics.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dificultad
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Todas las dificultades</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleShuffle}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  isShuffled 
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' 
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <ArrowsUpDownIcon className="w-4 h-4" />
                <span>Aleatorio</span>
              </button>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4" />
                <span>Reiniciar</span>
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tarjeta {currentFlashcardIndex + 1} de {totalCards} • 
              <span className="ml-1 text-primary-600 dark:text-primary-400 font-medium">
                {studiedCount} estudiadas
              </span>
            </div>
            
            <div className="w-full sm:w-48 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(studiedCount / totalCards) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Study Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalCards}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Tarjetas disponibles
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {studiedCount}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Ya estudiadas
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round((studiedCount / totalCards) * 100)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Progreso
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Flashcards
