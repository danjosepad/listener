import Versions from './components/Versions'

import { UserClass } from '../../models/user'
import React from 'react'

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [interval, setIntervalValue] = React.useState<NodeJS.Timeout | null>(null)

  const [level, setLevel] = React.useState(1)
  const [userClass, setUserClass] = React.useState(UserClass.MG)

  const [userLiveLevel, setUserLiveLevel] = React.useState(1)

  const [isRunning, setIsRunning] = React.useState(false)

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    console.log({ target: event.target.value })
    setUserClass(event.target.value as UserClass)
  }

  const handleUpdateLevel = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setLevel(Number(event.target.value))
  }

  const handleSaveData = (): void => {
    window.electron.ipcRenderer.send('update-user', {
      class: userClass,
      level: level.toString()
    })
  }

  const handleOnStart = (): void => {
    setIsRunning(true)
    setIntervalValue(setInterval(() => {
      window.electron.ipcRenderer.send('get-client-level')
    }, 1500))
  }

  const handleOnStop = (): void => {
    setIsRunning(false)
    if (interval) {
      clearInterval(interval)
      setIntervalValue(null)
    }
  }

  React.useEffect(() => {
    const user = window.electron.ipcRenderer.sendSync('get-user')

    if (user) {
      setUserClass(user.class)
      setLevel(user.level)
    }
  }, [])

  React.useEffect(() => {
    window.electron.ipcRenderer.on('update-live-level', (_event, data) => {
      setUserLiveLevel(data.level)
    })

    // return (): void => {
    //   clearInterval(interval)
    // }
  })

  return (
    <>
      <div>
        <label htmlFor="classe">Classe:</label>
        <select onChange={handleSelect} value={userClass}>
          <option value="BK">Black Knight</option>
          <option value="SM">Soul Master</option>
          <option value="DL">Dark Lord</option>
          <option value="MG">Magic Gladiator</option>
        </select>

        <br />
        <label htmlFor="nivel">Nível máximo de Reset:</label>
        <input
          type="number"
          id="nivel"
          value={level}
          min="10"
          max="999"
          onChange={handleUpdateLevel}
        />

        <button onClick={handleSaveData}>Salvar</button>

        <br />
        <strong>Seu nível atual é:</strong>
        <br />
        <h4>{userLiveLevel}</h4>

        <button id="iniciar" disabled={isRunning} onClick={handleOnStart}>
          Iniciar monitoramento
        </button>

        <button id="parar" disabled={!isRunning} onClick={handleOnStop}>
          Parar monitoramento
        </button>
      </div>
    </>
  )
}

export default App
