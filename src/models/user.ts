export enum UserClass {
  BK = 'BK',
  SM = 'SM',
  ELF = 'Elf',
  MG = 'MG',
  DL = 'DL'
}

export interface User {
  class: UserClass
  level: number
}
