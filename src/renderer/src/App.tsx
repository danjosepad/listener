import { UserClass } from '../../models/user'
import * as React from 'react'
import { colors, shouldPlaySound } from './utils'
import { FaSave } from "react-icons/fa";
import { IoPlayCircle } from "react-icons/io5";
import { IoStopCircle } from "react-icons/io5";
import CountUp from './components/CountUp'
import ElasticSlider from './components/Slider';
import Threads from './components/Threads';
import { FaRegQuestionCircle } from "react-icons/fa";
import Tooltip from './components/Tooltip';

function App(): JSX.Element {

  const [interval, setIntervalValue] = React.useState<NodeJS.Timeout | null>(null)

  const [level, setLevel] = React.useState(1)
  const [userClass, setUserClass] = React.useState(UserClass.MG)
  const [volume, setVolume] = React.useState(100)

  const [isEditingClass, setIsEditingClass] = React.useState(false)
  const [isEditingLevel, setIsEditingLevel] = React.useState(false)

  const [userLiveLevel, setUserLiveLevel] = React.useState(1)
  const [hasSoundAlreadyPlayed, setHasSoundAlreadyPlayed] = React.useState({
    level: 1,
    played: false,
  })

  const [lateGameReset, setLateGameReset] = React.useState(false)

  // Add ref to track latest state
  const hasSoundAlreadyPlayedRef = React.useRef(hasSoundAlreadyPlayed)

  // Update ref when state changes
  React.useEffect(() => {
    hasSoundAlreadyPlayedRef.current = hasSoundAlreadyPlayed
  }, [hasSoundAlreadyPlayed])

  const [isRunning, setIsRunning] = React.useState(false)

  const handleVolumeChange = (value: number): void => {

    setVolume(Math.round(value))

    window.electron.ipcRenderer.send('update-data', {
      type: 'volume',
      data: Math.round(value)
    })
  }

  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    setUserClass(event.target.value as UserClass)

    window.electron.ipcRenderer.send('update-data', {
      type: 'class',
      data: event.target.value as UserClass
    })
    setIsEditingClass(false)
  }

  const handleUpdateLevel = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setLevel(Number(event.target.value))
  }

  const handleSaveLevel = (): void => {
    window.electron.ipcRenderer.send('update-data', {
      type: 'level',
      data: level
    })
    setIsEditingLevel(false)
  }

  const handleLevel = React.useCallback((): void => {
    const newLevel = window.electron.ipcRenderer.sendSync('get-client-level')
    const currentState = hasSoundAlreadyPlayedRef.current

    if (newLevel !== null) {
      setUserLiveLevel(newLevel)

      // Only update hasSoundAlreadyPlayed if the level has changed
      if (currentState.level !== newLevel) {
        setHasSoundAlreadyPlayed({
          level: newLevel,
          played: false
        })
      }

      if (
        shouldPlaySound(newLevel, userClass, level, currentState.level, lateGameReset) &&
        !currentState.played &&
        currentState.level !== newLevel
      ) {
        window.electron.ipcRenderer.send('play-sound', volume)
        setHasSoundAlreadyPlayed({
          level: newLevel,
          played: true
        })
      }
    }
  }, [userClass, level, volume])

  const handleOnStart = (): void => {
    setIsRunning(true)
  }

  const handleOnStop = (): void => {
    setIsRunning(false)
    if (interval) {
      clearInterval(interval)
      setIntervalValue(null)
    }
  }

  const handleLateGameReset = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setLateGameReset(event.target.checked)
    
    window.electron.ipcRenderer.send('update-data', {
      type: 'lateGameReset',
      data: event.target.checked
    })
  }

  React.useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => handleLevel(), 1500);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRunning])

  React.useEffect(() => {
    const user = window.electron.ipcRenderer.sendSync('get-user')

    if (user) {
      setUserClass(user.class)
      setLevel(user.level)
      setVolume(user.volume)
      setLateGameReset(user.lateGameReset)
    }
  }, [])

  console.log({ lateGameReset })

  return (
    <>
      <div className="w-svw p-10 max-w-[80%]">

        <ElasticSlider
          startingValue={1}
          defaultValue={volume}
          onChange={handleVolumeChange}
          maxValue={100}
          className='w-full mb-10'
        />

        <div className='flex items-center gap-2 mb-10'>
          <input type="checkbox" id="late-game-reset" checked={lateGameReset} onChange={handleLateGameReset} className='w-5 h-5' />
          <label htmlFor="late-game-reset">Late Game Reset</label>
          <Tooltip content="Path considerando Lvl 10 para Devias, 30 para LT7 e 106/120  para Icarus">
            <FaRegQuestionCircle className='text-sm cursor-pointer' />
          </Tooltip>
        </div>

        <div className='flex justify-between items-start gap-2 w-full flex-wrap'>
          <div className='flex flex-col items-start gap-2'>
            <label htmlFor="classe" className='text-sm'>Classe:</label>
            {isEditingClass ? (
              <select onChange={handleSelect} onBlur={handleSelect} onInput={handleSelect} className='bg-gray-50 border max-w-30 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"' value={userClass}>
                <option value="BK">Black Knight</option>
                <option value="SM">Soul Master</option>
                <option value="ELF">Elf</option>
                <option value="DL">Dark Lord</option>
                <option value="MG">Magic Gladiator</option>
              </select>
            ) : (
              <button className='flex items-center gap-2' onClick={() => setIsEditingClass(true)}>
                <strong className='text-md  font-bold'>{userClass}</strong>
                <FaSave className='text-sm cursor-pointer' />
              </button>
            )}
          </div>

          <div className='flex flex-col items-end gap-2'>
            <label htmlFor="nivel" className='text-sm'>Nível máximo de Reset:</label>
            {isEditingLevel ? (
              <div className='flex items-center gap-2'>
                <input
                  type="text"
                  id="nivel"
                  value={level}
                  min="1"
                  max="999"
                  className="bg-gray-50 border max-w-20 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  onChange={handleUpdateLevel}
                />
                <FaSave className='text-sm cursor-pointer' onClick={handleSaveLevel} />
              </div>
            ) : (
              <button className='flex items-center gap-2' onClick={() => setIsEditingLevel(true)}>
                <strong className='text-md  font-bold'>{level}</strong>
                <FaSave className='text-sm cursor-pointer' />
              </button>
            )}
          </div>
        </div>


        <div className='flex flex-col justify-center items-center gap-2 mt-5'>
          <span className='text-sm'>Seu nível atual é:</span>
          <CountUp to={userLiveLevel} className='text-2xl font-bold' />
        </div>
      </div>

      <button className='w-full flex justify-center items-center mt-6' onClick={isRunning ? handleOnStop : handleOnStart}>
        {isRunning ? (
          <div className='w-svw flex flex-col justify-center items-center'>
            <IoStopCircle className=' text-[5rem] cursor-pointer text-center hover:text-[5.5rem] transition-all duration-300' />

            <Threads
              amplitude={3}
              distance={0}
              color={colors[userClass]}
            />
          </div>
        ) : (
          <IoPlayCircle className=' text-[5rem] cursor-pointer text-center hover:text-[5.5rem] transition-all duration-300' />
        )}
      </button>
    </>
  )
}

export default App
