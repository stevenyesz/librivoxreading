import { TimelineEntry } from 'echogarden/dist/utilities/Timeline.d.js'

export type SaveRecord = (
  type: string,
  arrayBuffer: ArrayBuffer,
  paragraphText: string
) => Promise<{ transcript: string; wordTimeline: TimelineEntry[] }>

export type FetchLibrivoxParagraph = (
  bookTitle: string,
  paragraphId: number
) => Promise<{ paragraphText: string; audioSrc: string }>
