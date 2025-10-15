import { FetchLibrivoxParagraph, SaveRecord } from '../../shared/types'
import * as Echogarden from 'echogarden/dist/api/API.js'
import {
  encodeRawAudioToWave,
  ensureRawAudio,
  getRawAudioDuration,
  trimAudioEnd,
  trimAudioStart
} from 'echogarden/dist/audio/AudioUtilities.js'

import { appDirectoryName } from '../../shared/constants'
import pkg from 'fs-extra'
const { outputFile } = pkg

import { homedir } from 'os'
import { createHash } from 'crypto'
import path from 'path'
import axios from 'axios'

export const generateParagraphHash = (text: string): string => {
  const hash = createHash('sha256')
  hash.update(text)
  return hash.digest('hex')
}

export const getRootDir = (): string => {
  return `${homedir()}/${appDirectoryName}`
}

export const saveRecord: SaveRecord = async (type, audiodata, paragraphText) => {
  console.log(type.split(';')[0])
  const rawAudio = await ensureRawAudio(Buffer.from(audiodata))
  // trim audio
  let trimmedSamples = trimAudioStart(rawAudio.audioChannels[0], 0, -50)
  trimmedSamples = trimAudioEnd(trimmedSamples, 0, -100)
  rawAudio.audioChannels[0] = trimmedSamples
  const duration = Math.round(getRawAudioDuration(rawAudio) * 1000)
  if (duration === 0) {
    throw new Error('models.recording.cannotDetectAnySound')
  }
  const rootDir = getRootDir()
  const hash = generateParagraphHash(paragraphText)
  const filename = `${hash}.wav`
  const filePath = path.join(rootDir, filename)

  await outputFile(filePath, encodeRawAudioToWave(rawAudio))
  const { transcript, wordTimeline } = await Echogarden.recognize(filePath, {
    engine: 'whisper',
    language: 'en'
  })

  return { transcript, wordTimeline }
}

export const fetchLibrivoxParagraph: FetchLibrivoxParagraph = async (booktitle, paragraphId) => {
  const url = `http://8.133.22.41:5050/librivox/paragraph?booktitle=${booktitle}&paragraphid=${paragraphId}`
  console.log(url)

  try {
    const response = await axios.get(url)
    console.log(response.data)
    if (response.status === 200) {
      return {
        paragraphText: response.data.text,
        audioSrc: response.data.mp3
      }
    }

    return {
      paragraphText: '',
      audioSrc: ''
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        paragraphText: '',
        audioSrc: ''
      }
    }

    return {
      paragraphText: '',
      audioSrc: ''
    }
  }
}
