import { app, shell, BrowserWindow, ipcMain, powerSaveBlocker  } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

import { exec } from 'child_process'
import { getUser, handleUpdateUser } from './store'
import { UserClass } from '../models/user'
import soundPlay from 'sound-play'
import path from 'path'


let mainWindow: BrowserWindow | null = null

const playSound = async (): Promise<void> => {
  try {
    const soundPath = path.join(app.getAppPath(), 'resources', 'coin-sound.mp3');
    await soundPlay.play(soundPath);
    console.log('Som reproduzido com sucesso!');
  } catch (error) {
    console.error('Erro ao reproduzir o som:', error);
  }
}

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      backgroundThrottling: false,
    }
  })

  const id = powerSaveBlocker.start('prevent-app-suspension')
  console.log({ powerStarted: powerSaveBlocker.isStarted(id)})
  mainWindow.webContents.openDevTools()

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('update-user', (_event, data: { class: UserClass; level: string }) => {
    handleUpdateUser(data)
  })

  ipcMain.on('get-user', (event) => {
    event.returnValue = getUser()
  })

  ipcMain.on('play-sound', (event, data) => {
    playSound()
  })


  ipcMain.on('get-client-level', async (event) => {
    try {
      const level = await getLevelFromWindowTitle()
      event.returnValue = level
      console.log(`Level: ${level}`)
    } catch (err) {
      console.error(err)
      event.returnValue = null
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

 
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

const getLevelFromWindowTitle = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    exec(
      'powershell "Get-Process | Where-Object {$_.ProcessName -eq \'MainMU\'} | Select-Object MainWindowTitle"',
      (err, stdout, stderr) => {
        if (err) {
          reject(err)
          return
        }

        if (stderr) {
          reject(new Error(stderr))
          return
        }

        const title = stdout.trim()
        if (title) {
          // Analisa o título para extrair o valor do Level
          const levelMatch = title.match(/Level:\s*(\d+)/)
          if (levelMatch && levelMatch[1]) {
            resolve(parseInt(levelMatch[1], 10)) // Converte para inteiro
          } else {
            reject(new Error('Valor do Level não encontrado.'))
          }
        } else {
          reject(new Error('Janela não encontrada.'))
        }
      }
    )
  })
}


