import React from 'react'
import LottieView from 'lottie-react-native'

// Import your animations
import loadingCatAnimation from '@/assets/animations/loading_cat.json'
import manRunningAnimation from '@/assets/animations/man_running.json'
import welcomeScreenAnimation from '@/assets/animations/welcome_screen.json'
import jugglingAnimation from '@/assets/animations/juggling.json'

type AnimationType = 'loading_cat' | 'man_running' | 'welcome_screen' | 'juggling'

interface LottieAnimationProps {
  animation: AnimationType
  width: number
  height: number
  loop?: boolean
  autoPlay?: boolean
  flipped?: boolean
  onAnimationFinish?: () => void
}

const animationMap = {
  loading_cat: loadingCatAnimation,
  man_running: manRunningAnimation,
  welcome_screen: welcomeScreenAnimation,
  juggling: jugglingAnimation,
}

export default function LottieAnimation({ 
  animation, 
  width, 
  height, 
  loop = true, 
  autoPlay = true,
  flipped = false,
  onAnimationFinish 
}: LottieAnimationProps) {

  return (
    <LottieView
      source={animationMap[animation]}
      autoPlay={autoPlay}
      loop={loop}
      onAnimationFinish={onAnimationFinish}
      style={{
        width,
        height,
        transform: flipped ? [{ scaleX: -1 }] : undefined,
      }}
    />
  )
}