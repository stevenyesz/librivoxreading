import { useState } from 'react'

export const MediaCaption = (props: {
  caption: string
  selectedIndices?: number[]
  activeIndex?: number
  currentSegmentIndex: number
  onClick?: (index: number) => void
}) => {
  function isPunctuationOnly(str: string): boolean {
    // 使用Unicode标点符号范围
    return /^[\p{P}\p{Sm}]+$/u.test(str)
  }
  const { caption, selectedIndices = [], activeIndex, currentSegmentIndex, onClick } = props
  const [notedquoteIndices] = useState<number[]>([])
  const matchesCaption = Array.from(caption.matchAll(/\b\w+\b|\p{P}+/gu))
  const words = matchesCaption.map((match) => match[0])
  console.log(words)

  return (
    <div className="flex flex-wrap">
      {/* use the words splitted by caption text if it is matched with the timeline length, otherwise use the timeline */}
      {words.map((word, index) => (
        <div
          className=""
          key={`word-${currentSegmentIndex}-${index}`}
          id={`word-${currentSegmentIndex}-${index}`}
        >
          <div
            className={`${isPunctuationOnly(word) === false ? 'pl-2' : ''} ${
              onClick && 'hover:bg-red-500/10 cursor-pointer'
            } ${index === activeIndex ? 'text-green-700 font-bold' : 'text-black'} ${
              selectedIndices && selectedIndices.includes(index)
                ? 'bg-green-500/10 text-xl selected'
                : ''
            } ${notedquoteIndices.includes(index) ? 'border-b border-red-500 border-dashed' : ''}`}
            onClick={() => onClick && onClick(index)}
          >
            {word}
          </div>
        </div>
      ))}
    </div>
  )
}
