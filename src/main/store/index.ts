import Store from 'electron-store'
import { User, UserClass } from '../../models/user'

console.log('ACCESS')
const defaultUser: User = {
  class: UserClass.MG,
  level: 1
}

export const store = new Store({
  defaults: defaultUser
})

export const handleUpdateUser = (data: { class: UserClass; level: string }): void => {
  store.set('class', data.class)
  store.set('level', data.level)
}

export const getUser = (): User => {
  return {
    class: store.get('class') as UserClass,
    level: store.get('level') as number
  }
}

const storeController = {
  handleUpdateUser,
  getUser
}

export default storeController
