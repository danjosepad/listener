import Store from 'electron-store'
import { User, UserClass } from '../../models/user'

type StoreType = User & {
  volume: number
}

const defaultUser: StoreType = {
  class: UserClass.MG,
  level: 1,
  volume: 50,
}

export const store = new Store({
  defaults: defaultUser
})

export const handleUpdateData = (type: 'class' | 'level', data: UserClass | number): void => {
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
    volume: store.get('volume') as number
  }
}

const storeController = {
  handleUpdateUser,
  getUser
}

export default storeController
