import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import Layout from './components/Layout'
import Home from './pages/Home'
import Flashcards from './pages/Flashcards'
import Quizzes from './pages/Quizzes'
import Summaries from './pages/Summaries'
import Glossary from './pages/Glossary'
import NotFound from './pages/NotFound'
import { useDataStore, useThemeStore } from './store'

function App() {
  const loadData = useDataStore((state) => state.loadData)
  const initTheme = useThemeStore((state) => state.initTheme)

  useEffect(() => {
    // Load data on app start
    loadData()
    
    // Initialize theme
    initTheme()
  }, [loadData, initTheme])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/summaries" element={<Summaries />} />
        <Route path="/glossary" element={<Glossary />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}

export default App
