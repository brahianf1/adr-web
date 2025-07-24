import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  ArrowPathIcon, 
  CheckIcon,
  FunnelIcon,
  ArrowsUpDownIcon
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
  const [isShuffled, setIsShuffled] = useState(false)

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

  const handleReset = () => {
    resetFlashcards()
    setIsFlipped(false)
    // Toast removed for better UX - progress is visible in the interface
  }

  const handleShuffle = () => {
    setIsShuffled(!isShuffled)
    // Toast removed for better UX - shuffle state is visible in button
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
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Haz clic en la tarjeta para ver la respuesta. Navega con las flechas o los botones.
          </p>
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

        {/* Flashcard */}
        <motion.div
          key={currentCard?.id} // Force re-render when card changes
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className={`flip-card h-96 lg:h-[28rem] ${isFlipped ? 'flipped' : ''}`}>
            <div
              className="flip-card-inner w-full h-full cursor-pointer"
              onClick={handleFlip}
            >
              {/* Front */}
              <div className="flip-card-front absolute inset-0 w-full h-full">
                <div className="card h-full flex flex-col justify-center p-8 lg:p-12">
                  <div className="flex items-center justify-between mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentCard?.difficulty)}`}>
                      {currentCard?.difficulty}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {currentCard?.topic}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white text-center leading-relaxed">
                    {currentCard?.question}
                  </h2>
                  
                  {showInstructions && (
                    <div className="text-center mt-8">
                      <p className="text-gray-400 dark:text-gray-500 text-xs opacity-75">
                        Haz clic para ver la respuesta
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Back */}
              <div className="flip-card-back absolute inset-0 w-full h-full">
                <div className="card h-full flex flex-col justify-center p-8 lg:p-12">
                  <div className="flex items-center justify-between mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentCard?.difficulty)}`}>
                      {currentCard?.difficulty}
                    </span>
                    <div className="flex items-center space-x-2">
                      <CheckIcon className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {currentCard?.topic}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-lg lg:text-xl text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                    {currentCard?.answer}
                  </div>
                  
                  {showInstructions && (
                    <div className="text-center mt-8">
                      <p className="text-gray-400 dark:text-gray-500 text-xs opacity-75">
                        Haz clic para volver a la pregunta
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-4"
        >
          <button
            onClick={handlePrevious}
            disabled={currentFlashcardIndex === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span>Anterior</span>
          </button>

          <div className="text-center px-4">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {currentFlashcardIndex + 1} / {totalCards}
            </div>
          </div>

          <button
            onClick={handleNext}
            disabled={currentFlashcardIndex === totalCards - 1}
            className="flex items-center space-x-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
          >
            <span>Siguiente</span>
            <ArrowRightIcon className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default Flashcards
