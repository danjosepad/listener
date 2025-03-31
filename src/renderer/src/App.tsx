import Versions from './components/Versions'
import React from 'react'
import { UserClass } from '../../models/user'

function App(): JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  const [level, setLevel] = React.useState(1)
  const [userClass, setUserClass] = React.useState(UserClass.MG)

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setUserClass(event.target.value as UserClass)
  }

  const handleUpdateLevel = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setLevel(Number(event.target.value))
  }

  const handleSaveData = (): void => {
    handleUpdateUser({
      class: userClass,
      level: level.toString()
    })
  }

  return (
    <>
      <div>
        <label htmlFor="classe">Classe:</label>
        <select onSelect={handleSelect}>
          <option value="BK">Black Knight</option>
          <option value="SM">Soul Master</option>
          <option value="DL">Dark Lord</option>
          <option value="MG">Magic Gladiator</option>
        </select>

        <label htmlFor="nivel">Nível:</label>
        <input type="number" id="nivel" min="10" max="999" onChange={handleUpdateLevel} />

        <button onClick={handleSaveData}>Salvar</button>

        <strong>Seu nível atual é:</strong>
        <br />
        <h4 id="nivel-atual" />

        <button id="iniciar">Iniciar aviso</button>

        <button id="parar">Parar aviso</button>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
