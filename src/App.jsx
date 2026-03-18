import { useState, useEffect } from 'react'
import { loadGame, saveGame, clearGame } from './utils/storage'
import { LanguageProvider } from './i18n/LanguageContext'
import HomeScreen from './screens/HomeScreen'
import SetupScreen from './screens/SetupScreen'
import DrawScreen from './screens/DrawScreen'
import ResultsScreen from './screens/ResultsScreen'
import GameIdeaButton from './components/GameIdeaButton'
import LanguageToggle from './components/LanguageToggle'

const INITIAL_STATE = {
  phase: 'home',
  participants: [],
  pin: '',
  assignments: {},
  drawn: [],
  pool: [],
}

export default function App() {
  const [game, setGame] = useState(() => {
    const saved = loadGame()
    return {
      ...INITIAL_STATE,
      _hasSave: !!(saved && (saved.phase === 'draw' || saved.phase === 'results')),
    }
  })

  useEffect(() => {
    if (game.phase === 'draw' || game.phase === 'results') {
      saveGame(game)
    }
  }, [game])

  const hasSavedGame = game._hasSave

  function handleNewGame() {
    const saved = loadGame()
    setGame({
      ...INITIAL_STATE,
      phase: 'setup-pin',
      _hasSave: !!(saved && (saved.phase === 'draw' || saved.phase === 'results')),
    })
  }

  function handlePinSet(pinValue) {
    setGame((prev) => ({ ...prev, phase: 'setup-players', pin: pinValue }))
  }

  function handleBackToPin() {
    setGame((prev) => ({ ...prev, phase: 'setup-pin' }))
  }

  function handleContinue() {
    const saved = loadGame()
    if (saved) setGame(saved)
  }

  function handleStartDraw(participants, pin) {
    clearGame()
    setGame({
      ...INITIAL_STATE,
      phase: 'draw',
      participants,
      pin,
      assignments: {},
      drawn: [],
      pool: [...participants],
      _hasSave: false,
    })
  }

  function handleAccept(person, recipient, swapAssignments) {
    setGame((prev) => {
      const newAssignments = swapAssignments
        ? { ...swapAssignments, [person]: recipient }
        : { ...prev.assignments, [person]: recipient }
      const newPool = swapAssignments
        ? prev.pool.filter((p) => p !== recipient && p !== person)
        : prev.pool.filter((p) => p !== recipient)
      const newDrawn = [...prev.drawn, person]
      return {
        ...prev,
        assignments: newAssignments,
        pool: newPool,
        drawn: newDrawn,
      }
    })
  }

  function handleComplete() {
    setGame((prev) => ({ ...prev, phase: 'results' }))
  }

  function handleRemovePlayer(name) {
    setGame((prev) => {
      let participants = prev.participants.filter((p) => p !== name)
      let pool = prev.pool.filter((p) => p !== name)
      const assignments = { ...prev.assignments }
      let drawn = [...prev.drawn]

      for (const giver of Object.keys(assignments)) {
        if (assignments[giver] === name) {
          delete assignments[giver]
          const idx = drawn.indexOf(giver)
          if (idx !== -1) drawn.splice(idx, 1)
        }
      }

      if (prev._fromResults) {
        let changed = true
        while (changed) {
          changed = false
          const undrawn = participants.filter((p) => !drawn.includes(p))
          for (const p of undrawn) {
            const canDraw = pool.filter((r) => r !== p)
            if (canDraw.length === 0) {
              participants = participants.filter((x) => x !== p)
              pool = pool.filter((x) => x !== p)
              for (const giver of Object.keys(assignments)) {
                if (assignments[giver] === p) {
                  delete assignments[giver]
                  const idx = drawn.indexOf(giver)
                  if (idx !== -1) drawn.splice(idx, 1)
                }
              }
              changed = true
            }
          }
        }
      }

      return { ...prev, participants, pool, assignments, drawn }
    })
  }

  function handleAddPlayer(name) {
    setGame((prev) => ({
      ...prev,
      participants: [...prev.participants, name],
      pool: [...prev.pool, name],
    }))
  }

  function handleAddPlayers(newNames) {
    setGame((prev) => ({
      ...prev,
      phase: 'draw',
      participants: [...prev.participants, ...newNames],
      pool: [...prev.pool, ...newNames],
      _fromResults: true,
    }))
  }

  function handleReset() {
    clearGame()
    setGame({ ...INITIAL_STATE, _hasSave: false })
  }

  function handleGoHome() {
    const saved = loadGame()
    setGame({
      ...INITIAL_STATE,
      _hasSave: !!(saved && (saved.phase === 'draw' || saved.phase === 'results')),
    })
  }

  let screen
  switch (game.phase) {
    case 'home':
      screen = (
        <HomeScreen
          onNewGame={handleNewGame}
          onContinue={handleContinue}
          onReset={handleReset}
          hasSavedGame={hasSavedGame}
        />
      )
      break
    case 'setup-pin':
      screen = <SetupScreen key="setup-pin" step="pin" onPinSet={handlePinSet} onStart={handleStartDraw} onBack={handleGoHome} onBackToPin={handleBackToPin} />
      break
    case 'setup-players':
      screen = <SetupScreen key="setup-players" step="players" pin={game.pin} onPinSet={handlePinSet} onStart={handleStartDraw} onBack={handleGoHome} onBackToPin={handleBackToPin} />
      break
    case 'draw':
      screen = (
        <DrawScreen
          game={game}
          onAccept={handleAccept}
          onComplete={handleComplete}
          onAddPlayer={handleAddPlayer}
          onRemovePlayer={handleRemovePlayer}
          onBack={handleGoHome}
        />
      )
      break
    case 'results':
      screen = (
        <ResultsScreen
          game={game}
          onBack={handleGoHome}
          onAddPlayers={handleAddPlayers}
        />
      )
      break
    default:
      screen = null
  }

  return (
    <LanguageProvider>
      {screen}
      <GameIdeaButton />
      <LanguageToggle />
    </LanguageProvider>
  )
}
