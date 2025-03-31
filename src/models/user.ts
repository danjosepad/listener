export enum UserClass {
  BK = 'Blade Knight',
  SM = 'Soul Master',
  ELF = 'Elf',
  MG = 'Magic Gladiator',
  DL = 'Dark Lord'
}

export interface User {
  class: UserClass
  level: number
}
