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

export const colors = {
    MG: [255, 0, 2],    // dark purple
    DL: [0, 0, 255],      // blue
    ELF: [255, 0, 255],     // pink
    SM: [255, 255, 0],    // yellow
    BK: [255, 0, 0],      // red
}

export const shouldPlaySound = (level: number, userClass: UserClass, maxResetLevel: number, lastTriggeredLevel: number): boolean => {
    const interval = [...classes[userClass], Number(maxResetLevel)]

    const nextTriggerLevel = interval.find(level => level > lastTriggeredLevel)

    return interval.includes(level) || nextTriggerLevel < level
}
