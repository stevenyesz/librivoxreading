import { ElectronAPI } from '@electron-toolkit/preload'
import { SaveRecord, FetchLibrivoxParagraph } from '../shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      saveRecord: SaveRecord
      fetchLibrivoxParagraph: FetchLibrivoxParagraph
    }
  }
}
