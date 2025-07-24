import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  PlayIcon, 
  ArrowPathIcon, 
  CheckIcon, 
  XMarkIcon,
  TrophyIcon,
  FunnelIcon,
  ArrowsUpDownIcon,
  ClipboardDocumentListIcon
} from '@heroicons/react/24/outline'
import { toast } from 'react-toastify'
import { useDataStore, useStudyStore } from '../store'
import LoadingSpinner from '../components/LoadingSpinner'

const Quizzes = () => {
  const { quizzes } = useDataStore()
  const { updateStudyProgress } = useStudyStore()

  const [currentQuiz, setCurrentQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [quizResults, setQuizResults] = useState([])
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [filteredQuizzes, setFilteredQuizzes] = useState([])
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [isShuffled, setIsShuffled] = useState(true)
  const [shuffleOptions, setShuffleOptions] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentAnswerIsCorrect, setCurrentAnswerIsCorrect] = useState(false)

  // Get unique topics and difficulties
  const topics = [...new Set(quizzes.map(quiz => quiz.topic))].sort()
  const difficulties = [...new Set(quizzes.map(quiz => quiz.difficulty))].sort()

  // Filter quizzes based on topic and difficulty
  useEffect(() => {
    let filtered = quizzes.filter(quiz => {
      const topicMatch = selectedTopic === 'all' || quiz.topic === selectedTopic
      const difficultyMatch = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty
      return topicMatch && difficultyMatch
    })

    setFilteredQuizzes(filtered)
  }, [quizzes, selectedTopic, selectedDifficulty])

  // Function to shuffle options for each question
  const shuffleQuizOptions = (quiz) => {
    if (!shuffleOptions) return quiz
    
    return quiz.map(question => {
      const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5)
      return {
        ...question,
        options: shuffledOptions
      }
    })
  }

  const startQuiz = () => {
    if (filteredQuizzes.length === 0) {
      toast.info('No hay preguntas disponibles con los filtros seleccionados', {
        autoClose: 3000
      })
      return
    }
    
    // Start with the filtered quizzes
    let quizToProcess = [...filteredQuizzes]
    
    // Apply question shuffling if enabled
    if (isShuffled) {
      quizToProcess = quizToProcess.sort(() => Math.random() - 0.5)
    }
    
    // Apply option shuffling if enabled
    const processedQuiz = shuffleQuizOptions(quizToProcess)
    
    setCurrentQuiz(processedQuiz)
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setShowResult(false)
    setQuizResults([])
    setIsQuizActive(true)
    setIsTransitioning(false)
    setCurrentAnswerIsCorrect(false)
  }

  const selectAnswer = (answer) => {
    if (showResult) return // Prevent selection after result is shown
    
    setSelectedAnswer(answer)
    
    // Immediate result showing - no need to confirm
    const currentQuestion = currentQuiz[currentQuestionIndex]
    const isCorrect = answer === currentQuestion.correct_option
    
    const result = {
      question: currentQuestion.question,
      selectedAnswer: answer,
      correctAnswer: currentQuestion.correct_option,
      isCorrect,
      topic: currentQuestion.topic,
      difficulty: currentQuestion.difficulty
    }

    setQuizResults([...quizResults, result])
    setShowResult(true)
    setIsTransitioning(true)
    setCurrentAnswerIsCorrect(isCorrect)
    
    // Update study progress
    updateStudyProgress('quiz', currentQuestion.id, isCorrect)
    
    // Auto-advance after showing result (like Duolingo/Kahoot)
    // Use different timing based on correctness: more time for incorrect answers to read the correct one
    const delayTime = isCorrect ? 1500 : 3000 // 1.5s for correct, 3s for incorrect
    
    setTimeout(() => {
      setIsTransitioning(false)
      if (currentQuestionIndex < currentQuiz.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer('')
        setShowResult(false)
      } else {
        finishQuiz()
      }
    }, delayTime)
  }

  // Remove the old submitAnswer function since we don't need it anymore
  const submitAnswer = () => {
    // This function is no longer needed with instant selection
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer('')
      setShowResult(false)
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = () => {
    setIsQuizActive(false)
    setIsTransitioning(false)
    const correctCount = quizResults.filter(r => r.isCorrect).length
    const totalQuestions = quizResults.length
    const percentage = Math.round((correctCount / totalQuestions) * 100)
    
    // Results are shown clearly in the completion screen, no need for toast
  }

  const resetQuiz = () => {
    setCurrentQuiz(null)
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setShowResult(false)
    setQuizResults([])
    setIsQuizActive(false)
    setIsTransitioning(false)
    setCurrentAnswerIsCorrect(false)
  }

  const restartQuiz = () => {
    // Reset and start a fresh quiz with new shuffling
    resetQuiz()
    // Small delay to ensure state is reset, then start new quiz
    setTimeout(() => startQuiz(), 100)
  }

  const restartCurrentQuiz = () => {
    // Restart quiz without exiting quiz mode (no flicker)
    let processedQuiz = [...filteredQuizzes]
    
    // Apply shuffling if enabled
    if (isShuffled) {
      processedQuiz = processedQuiz.sort(() => Math.random() - 0.5)
    }

    // Shuffle options for each question if enabled
    if (shuffleOptions) {
      processedQuiz = processedQuiz.map(question => ({
        ...question,
        options: [...question.options].sort(() => Math.random() - 0.5)
      }))
    }
    
    // Reset quiz state without changing isQuizActive
    setCurrentQuiz(processedQuiz)
    setCurrentQuestionIndex(0)
    setSelectedAnswer('')
    setShowResult(false)
    setQuizResults([])
    setIsTransitioning(false)
    setCurrentAnswerIsCorrect(false)
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

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400'
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  if (!quizzes.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  // Quiz Results View
  if (!isQuizActive && quizResults.length > 0) {
    const correctCount = quizResults.filter(r => r.isCorrect).length
    const totalQuestions = quizResults.length
    const percentage = Math.round((correctCount / totalQuestions) * 100)

    return (
      <div className="min-h-screen p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <TrophyIcon className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              ¡Quiz Completado!
            </h1>
            
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {correctCount} de {totalQuestions} respuestas correctas
            </p>
          </motion.div>

          {/* Results Details */}
          <div className="space-y-4 mb-8">
            {quizResults.map((result, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`card p-6 border-l-4 ${
                  result.isCorrect 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                    : 'border-red-500 bg-red-50 dark:bg-red-900/10'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    result.isCorrect ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {result.isCorrect ? (
                      <CheckIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XMarkIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      {result.question}
                    </h3>
                    
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-600 dark:text-gray-400">Tu respuesta:</span>{' '}
                        <span className={result.isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {result.selectedAnswer}
                        </span>
                      </p>
                      
                      {!result.isCorrect && (
                        <p>
                          <span className="text-gray-600 dark:text-gray-400">Respuesta correcta:</span>{' '}
                          <span className="text-green-600 dark:text-green-400">
                            {result.correctAnswer}
                          </span>
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(result.difficulty)}`}>
                        {capitalizeFirst(result.difficulty)}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {result.topic}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={startQuiz}
              className="w-full sm:w-auto btn-primary flex items-center justify-center space-x-2"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Nuevo Quiz</span>
            </button>
            
            <button
              onClick={resetQuiz}
              className="w-full sm:w-auto btn-secondary flex items-center justify-center space-x-2"
            >
              <span>Volver al inicio</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Active Quiz View - Fullscreen without site header
  if (isQuizActive && currentQuiz) {
    const currentQuestion = currentQuiz[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100

    return (
      <div className="fixed inset-0 bg-gray-50 dark:bg-gray-900 z-50 flex flex-col overflow-hidden">
        {/* Quiz Header */}
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-sm flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={resetQuiz}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            Pregunta {currentQuestionIndex + 1} de {currentQuiz.length}
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={restartCurrentQuiz}
              className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              title={`Reiniciar quiz${isShuffled || shuffleOptions ? ' con configuración actual' : ''}`}
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>
        
        {/* Full-width Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 flex-shrink-0">
          <div
            className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Question Card - Positioned higher, not centered */}
        <div className="flex-1 flex items-start justify-center p-4 pt-8">
          <div className="w-full max-w-4xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              key={currentQuestionIndex} // Re-animate on question change
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden relative"
            >
              {/* Transition Progress Bar - At the top of the card */}
              <AnimatePresence>
                {isTransitioning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-0 left-0 right-0 w-full bg-yellow-100 dark:bg-yellow-900/30 overflow-hidden rounded-t-2xl z-10"
                  >
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ 
                        duration: currentAnswerIsCorrect ? 1.5 : 3.0, 
                        ease: 'linear' 
                      }}
                      className="h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500"
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                {/* Header */}
                <div className="p-6 sm:p-8 pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                      {capitalizeFirst(currentQuestion.difficulty)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {currentQuestion.topic}
                    </span>
                  </div>
                  
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                </div>
                
                {/* Options Area - No scroll, natural spacing */}
                <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                  <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === option
                  const isCorrect = option === currentQuestion.correct_option
                  const showCorrectAnswer = showResult && isCorrect
                  const showWrongAnswer = showResult && isSelected && !isCorrect
                  
                  return (
                    <motion.button
                      key={`${currentQuestionIndex}-${index}`} // Add question index to key
                      onClick={() => selectAnswer(option)}
                      disabled={showResult}
                      className={`w-full p-3 sm:p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                        showCorrectAnswer
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                          : showWrongAnswer
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          : isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-102 active:scale-98'}`}
                      whileHover={!showResult ? { scale: 1.02 } : {}}
                      whileTap={!showResult ? { scale: 0.98 } : {}}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-6 h-6 min-w-6 min-h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                          showCorrectAnswer
                            ? 'border-green-500 bg-green-500'
                            : showWrongAnswer
                            ? 'border-red-500 bg-red-500'
                            : isSelected
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {showCorrectAnswer && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <CheckIcon className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                          {showWrongAnswer && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.2 }}
                            >
                              <XMarkIcon className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                          {isSelected && !showResult && (
                            <CheckIcon className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <span className="font-medium flex-1 text-sm sm:text-base break-words leading-relaxed">{option}</span>
                      </div>
                    </motion.button>
                  )
                })}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz Start View
  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz de Administración
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
            Pon a prueba tus conocimientos con preguntas de opción múltiple
          </p>
          
          {/* Start Quiz Button */}
          <div className="flex justify-center">
            <button
              onClick={startQuiz}
              disabled={filteredQuizzes.length === 0}
              className="px-8 py-4 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center space-x-2"
            >
              <PlayIcon className="w-6 h-6" />
              <span>Comenzar Quiz</span>
            </button>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
          className="card mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Configuración del Quiz
          </h2>
          
          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
          </div>

          {/* Modern Toggle Options */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
              Opciones de Mezcla
            </h3>
            
            <div className="space-y-4">
              {/* Shuffle Questions Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                    <ArrowsUpDownIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Mezclar preguntas
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Cambia el orden de las preguntas en cada ronda
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isShuffled}
                    onChange={() => setIsShuffled(!isShuffled)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 dark:border-gray-600 peer-checked:bg-primary-600 hover:bg-gray-300 dark:hover:bg-gray-600 peer-checked:hover:bg-primary-700"></div>
                </label>
              </div>

              {/* Shuffle Options Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                    <ArrowsUpDownIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Mezclar opciones
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Cambia el orden de las respuestas para evitar memorización
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={shuffleOptions}
                    onChange={() => setShuffleOptions(!shuffleOptions)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300 dark:border-gray-600 peer-checked:bg-blue-600 hover:bg-gray-300 dark:hover:bg-gray-600 peer-checked:hover:bg-blue-700"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-primary-600 dark:text-primary-400">
                {filteredQuizzes.length}
              </span> preguntas disponibles con los filtros seleccionados
            </p>
          </div>
        </motion.div>

        {/* Quiz Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {[
            { label: 'Total de preguntas', value: quizzes.length, icon: ClipboardDocumentListIcon },
            { label: 'Temas disponibles', value: topics.length, icon: FunnelIcon },
            { label: 'Niveles de dificultad', value: difficulties.length, icon: TrophyIcon }
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="card text-center"
              >
                <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}

export default Quizzes
