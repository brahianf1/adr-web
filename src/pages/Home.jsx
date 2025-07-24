import { motion } from 'framer-motion'
import { 
  CreditCardIcon, 
  ClipboardDocumentListIcon, 
  DocumentIcon, 
  BookOpenIcon,
  ChartBarIcon,
  StarIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useDataStore, useStudyStore } from '../store'

const Home = () => {
  const { flashcards, quizzes, summaries, glossary } = useDataStore()
  const { studyProgress } = useStudyStore()

  const features = [
    {
      title: 'Flashcards',
      description: 'Estudia con tarjetas interactivas. Voltea las cartas para ver las respuestas.',
      icon: CreditCardIcon,
      href: '/flashcards',
      count: flashcards.length,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'
    },
    {
      title: 'Quizzes',
      description: 'Pon a prueba tus conocimientos con preguntas de opción múltiple.',
      icon: ClipboardDocumentListIcon,
      href: '/quizzes',
      count: quizzes.length,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20'
    },
    {
      title: 'Resúmenes',
      description: 'Accede a resúmenes organizados por temas para repasar rápidamente.',
      icon: DocumentIcon,
      href: '/summaries',
      count: summaries.length,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20'
    },
    {
      title: 'Glosario',
      description: 'Consulta definiciones de términos importantes de administración.',
      icon: BookOpenIcon,
      href: '/glossary',
      count: glossary.length,
      gradient: 'from-orange-500 to-orange-600',
      bgGradient: 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20'
    }
  ]

  const stats = [
    {
      label: 'Total estudiado',
      value: studyProgress.totalStudied,
      icon: ChartBarIcon,
      color: 'text-primary-600 dark:text-primary-400'
    },
    {
      label: 'Racha actual',
      value: studyProgress.streak,
      icon: StarIcon,
      color: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      label: 'Flashcards vistas',
      value: Object.keys(studyProgress.flashcards).length,
      icon: CreditCardIcon,
      color: 'text-blue-600 dark:text-blue-400'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-8 pb-16 lg:pt-16 lg:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-8"
            >
              <BookOpenIcon className="w-10 h-10 text-white" />
            </motion.div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              ADR <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Web</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Tu plataforma educativa para dominar la administración. 
              Estudia con flashcards, evalúate con quizzes y consulta resúmenes organizados.
            </p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link
                to="/flashcards"
                className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Comenzar a estudiar
              </Link>
              <Link
                to="/quizzes"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Tomar quiz
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      {studyProgress.totalStudied > 0 && (
        <section className="py-12 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-6"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center"
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
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
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Herramientas de estudio
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explora diferentes métodos de aprendizaje diseñados para maximizar tu comprensión y retención.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Link
                    to={feature.href}
                    className="block group"
                  >
                    <div className={`bg-gradient-to-br ${feature.bgGradient} rounded-2xl p-8 transition-all duration-300 group-hover:shadow-xl group-hover:scale-105 border border-gray-200/50 dark:border-gray-700/50`}>
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {feature.title}
                            </h3>
                            <span className={`px-3 py-1 bg-gradient-to-r ${feature.gradient} text-white text-sm font-semibold rounded-full`}>
                              {feature.count}
                            </span>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Recent Activity or Tips Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Consejos para estudiar mejor
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: ClockIcon,
                  title: 'Estudia con regularidad',
                  description: 'Dedica tiempo diario al estudio para mantener una rutina consistente.'
                },
                {
                  icon: StarIcon,
                  title: 'Usa técnicas activas',
                  description: 'Las flashcards y quizzes te ayudan a recordar mejor que la lectura pasiva.'
                },
                {
                  icon: ChartBarIcon,
                  title: 'Repasa constantemente',
                  description: 'Vuelve a repasar temas anteriores para reforzar tu memoria a largo plazo.'
                }
              ].map((tip, index) => {
                const Icon = tip.icon
                
                return (
                  <motion.div
                    key={tip.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
                  >
                    <Icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {tip.description}
                    </p>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
