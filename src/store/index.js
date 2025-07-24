import { create } from 'zustand'

export const useThemeStore = create((set) => ({
  isDarkMode: false,
  toggleTheme: () => set((state) => {
    const newMode = !state.isDarkMode
    // Update the document class for Tailwind dark mode
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    // Store in localStorage
    localStorage.setItem('theme-mode', newMode ? 'dark' : 'light')
    return { isDarkMode: newMode }
  }),
  setTheme: (isDark) => set(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light')
    return { isDarkMode: isDark }
  }),
  initTheme: () => {
    const stored = localStorage.getItem('theme-mode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored ? stored === 'dark' : prefersDark
    
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    set({ isDarkMode: isDark })
  }
}))

export const useStudyStore = create((set, get) => ({
  // Study progress
  studyProgress: {
    flashcards: {},
    quizzes: {},
    totalStudied: 0,
    streak: 0,
    lastStudyDate: null,
  },
  
  // Quiz state
  currentQuiz: null,
  quizResults: [],
  
  // Flashcard state
  currentFlashcardIndex: 0,
  studiedFlashcards: new Set(),
  
  // Actions
  updateStudyProgress: (type, id, correct = null) => set((state) => {
    const newProgress = { ...state.studyProgress }
    
    if (type === 'flashcard') {
      newProgress.flashcards[id] = true
    } else if (type === 'quiz') {
      newProgress.quizzes[id] = { correct, timestamp: Date.now() }
    }
    
    newProgress.totalStudied += 1
    newProgress.lastStudyDate = new Date().toISOString()
    
    return { studyProgress: newProgress }
  }),
  
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),
  
  addQuizResult: (result) => set((state) => ({
    quizResults: [...state.quizResults, result]
  })),
  
  setCurrentFlashcardIndex: (index) => set({ currentFlashcardIndex: index }),
  
  markFlashcardStudied: (id) => set((state) => {
    const newStudied = new Set(state.studiedFlashcards)
    newStudied.add(id)
    return { studiedFlashcards: newStudied }
  }),
  
  resetFlashcards: () => set({
    currentFlashcardIndex: 0,
    studiedFlashcards: new Set()
  })
}))

export const useDataStore = create((set) => ({
  // Data state
  flashcards: [],
  quizzes: [],
  summaries: [],
  glossary: [],
  isLoading: false,
  error: null,
  
  // Actions
  setData: (type, data) => set((state) => ({
    [type]: data
  })),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  setError: (error) => set({ error }),
  
  // Load data from JSON files
  loadData: async () => {
    set({ isLoading: true, error: null })
    
    try {
      const [flashcardsRes, quizzesRes, summariesRes, glossaryRes] = await Promise.all([
        fetch('/data/flashcards.json'),
        fetch('/data/quizzes.json'),
        fetch('/data/resumenes.json'),
        fetch('/data/glosario.json')
      ])
      
      if (!flashcardsRes.ok || !quizzesRes.ok || !summariesRes.ok || !glossaryRes.ok) {
        throw new Error('Error loading data files')
      }
      
      const [flashcards, quizzes, summaries, glossary] = await Promise.all([
        flashcardsRes.json(),
        quizzesRes.json(),
        summariesRes.json(),
        glossaryRes.json()
      ])
      
      set({
        flashcards,
        quizzes,
        summaries,
        glossary,
        isLoading: false
      })
    } catch (error) {
      console.error('Error loading data:', error)
      set({
        error: 'Error cargando los datos. Por favor, verifica que los archivos JSON estén disponibles.',
        isLoading: false
      })
    }
  }
}))
