import { UserClass } from "src/models/user"

const defaultLevelInterval = [70, 120, 180]
const improvedLevelInterval = [46, 80, 120]

const classes = {
    MG: improvedLevelInterval,
    DL: improvedLevelInterval,
    ELF: defaultLevelInterval,
    SM: defaultLevelInterval,
    BK: defaultLevelInterval
}

export const shouldPlaySound = (level: number, userClass: UserClass, maxResetLevel: number): boolean => {
    const interval = [...classes[userClass], Number(maxResetLevel)]
    return interval.includes(level)
}
