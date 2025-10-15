import { useWavesurfer } from '@wavesurfer/react'
import React from 'react'
import { ComponentProps, useCallback, useEffect, useMemo, useRef } from 'react'
import { twMerge } from 'tailwind-merge'
import Timeline from 'wavesurfer.js/dist/plugins/timeline'

export type Mp3PlayerProps = {
  audioUrl?: string
  onTimeUpdatebb?: (currentTime: number) => void
} & ComponentProps<'div'>

export const Mp3Player = ({
  audioUrl,
  onTimeUpdatebb,
  children,
  className,
  ...props
}: Mp3PlayerProps): React.JSX.Element => {
  const containerRef = useRef(null)
  const formatTime = (seconds: number): string =>
    [seconds / 60, seconds % 60].map((v) => `0${Math.floor(v)}`.slice(-2)).join(':')

  const { wavesurfer, isPlaying, currentTime } = useWavesurfer({
    container: containerRef,
    height: 50,
    waveColor: '#4f46e5',
    progressColor: '#6366f1',
    url: audioUrl,
    plugins: useMemo(() => [Timeline.create()], [])
  })

  wavesurfer?.on('timeupdate', (currentTime) => {
    onTimeUpdatebb?.(currentTime)
  })

  const onPlayPause = useCallback(() => {
    wavesurfer && wavesurfer.playPause()
  }, [wavesurfer])

  // 添加键盘事件监听
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      // Command + P 控制播放/暂停
      if (event.metaKey && event.code === 'KeyP' && wavesurfer) {
        event.preventDefault() // 防止默认行为
        wavesurfer.playPause()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [wavesurfer])

  return (
    <div className={twMerge('mp3player', className)} {...props}>
      <div className="flex items-center gap-4">
        <p className="w-[60px] text-black">{formatTime(currentTime)}</p>
        <div className="flex-1 mx-4" ref={containerRef} />
        <button
          className="w-[120px] min-w-[5em] bg-indigo-600 text-white py-2 px-4 rounded-md border-none cursor-pointer font-semibold transition-colors hover:bg-indigo-700"
          onClick={onPlayPause}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </div>
      {children}
    </div>
  )
}
