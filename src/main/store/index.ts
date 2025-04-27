import Store from 'electron-store'
import { User, UserClass } from '../../models/user'

type StoreType = User & {
  volume: number
  lateGameReset: boolean
  lastSelectedUser: string | null
}

const defaultUser: StoreType = {
  class: UserClass.MG,
  level: 1,
  volume: 50,
  lateGameReset: false,
  lastSelectedUser: null
}

export const store = new Store({
  defaults: defaultUser
})

export const handleUpdateData = (type: 'class' | 'level' | 'lateGameReset' | 'lastSelectedUser', data: UserClass | number | boolean | string): void => {
  store.set(type, data)
}

export const handleUpdateUser = (data: { class: UserClass; level: string }): void => {
  store.set('class', data.class)
  store.set('level', data.level)
}

export const getUser = (): StoreType => {
  return {
    class: store.get('class') as UserClass,
    level: store.get('level') as number,
    volume: store.get('volume') as number,
    lateGameReset: store.get('lateGameReset') as boolean,
    lastSelectedUser: store.get('lastSelectedUser') as string | null
  }
}

const storeController = {
  handleUpdateUser,
  getUser
}

export default storeController
