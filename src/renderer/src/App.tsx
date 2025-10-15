import Versions from './components/Versions'
import { Mp3Player } from './components/Mp3player'
import { AudioRecorder } from 'react-audio-voice-recorder'
import { useEffect, useState } from 'react'
import { MediaCaption } from './components/MediaCaption'
import diff from 'diff-sequences'

function App(): React.JSX.Element {
  const [audioUrl, setAudioUrl] = useState<string>('')
  const [recordaudioUrl, setRecordaudioUrl] = useState<string>('')

  const [showRecord, setShowRecord] = useState<boolean>(false)

  const [paragraphText, setParagraphText] = useState<string>('paragraph text')

  const [transcript, setTranscript] = useState<string>('...')
  const [matchAIndices, setMatchAIndices] = useState<number[]>([])
  const [matchBIndices, setMatchBIndices] = useState<number[]>([])

  const fetchParagraph = async (): Promise<void> => {
    const { paragraphText, audioSrc } = await window.api.fetchLibrivoxParagraph('a', 5)
    setShowRecord(false)
    console.log(paragraphText, audioSrc)
    setParagraphText(paragraphText)
    setTranscript('')
    setMatchAIndices([])
    setMatchBIndices([])
    const audio_current = `http://8.133.22.41:5050${audioSrc}`
    setAudioUrl(audio_current)
  }

  const addAudioElement = async (blob: Blob): Promise<void> => {
    const url = URL.createObjectURL(blob)
    setShowRecord(true)
    setRecordaudioUrl(url)
    const audiodata = await blob.arrayBuffer()
    const { transcript, wordTimeline } = await window.api.saveRecord(blob.type, audiodata, '')
    console.log(wordTimeline)
    setTranscript(transcript)

    const matchesParagraph = Array.from(paragraphText.matchAll(/\b\w+\b|\p{P}+/gu))
    const matchesQuery = Array.from(transcript.matchAll(/\b\w+\b|\p{P}+/gu))
    const words1 = matchesParagraph.map((match) => match[0])
    const words2 = matchesQuery.map((match) => match[0])
    const matchAIndices: number[] = []
    const matchBIndices: number[] = []

    function isCommon(aIndex, bIndex) {
      return words1[aIndex].toLowerCase() === words2[bIndex].toLocaleLowerCase()
    }
    function foundSubsequence(nCommon, aCommon, bCommon) {
      const commonStr = words1.slice(aCommon, aCommon + nCommon).join(' ')
      for (let i = 0; i < nCommon; i++) {
        matchAIndices.push(aCommon + i)
        matchBIndices.push(bCommon + i)
      }
      setMatchAIndices(matchAIndices)
      setMatchBIndices(matchBIndices)

      console.log(commonStr)
      // see examples
    }

    diff(words1.length, words2.length, isCommon, foundSubsequence)
  }

  useEffect(() => {
    fetchParagraph()
  }, [])

  return (
    <>
      <div className="container mx-auto px-5">
        <div className="mx-5 text-justify">
          <MediaCaption
            caption={paragraphText}
            selectedIndices={matchAIndices}
            currentSegmentIndex={1}
            activeIndex={-1}
          ></MediaCaption>
          <br></br>
          {showRecord && (
            <MediaCaption
              caption={transcript}
              selectedIndices={matchBIndices}
              currentSegmentIndex={1}
              activeIndex={-1}
            ></MediaCaption>
          )}
        </div>
        <br></br>
        <div className="min-w-[80%] px-5 mt-auto mb-10">
          <Mp3Player audioUrl={audioUrl}></Mp3Player>
        </div>
        {showRecord && (
          <div className="px-5 mt-auto mb-10">
            <Mp3Player audioUrl={recordaudioUrl}></Mp3Player>
          </div>
        )}
        <Versions></Versions>
        <div className="flex justify-center">
          <AudioRecorder
            onRecordingComplete={addAudioElement}
            audioTrackConstraints={{
              noiseSuppression: true,
              echoCancellation: true
            }}
            showVisualizer={true}
            downloadOnSavePress={false}
          />
        </div>
        <br></br>
        <div className="flex justify-center">
          <button
            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={() => fetchParagraph()}
          >
            Show me any other text to read
          </button>
        </div>
      </div>
    </>
  )
}

export default App
