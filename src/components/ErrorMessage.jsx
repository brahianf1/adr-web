import { ExclamationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const ErrorMessage = ({ message, onRetry, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-red-200 dark:border-red-800 max-w-md w-full ${className}`}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <ExclamationCircleIcon className="w-6 h-6 text-red-500" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Error
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {message}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span>Reintentar</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default ErrorMessage
