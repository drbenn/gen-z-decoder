import React from 'react'
import { useColorScheme } from 'react-native'
import LottieView from 'lottie-react-native'
import { Colors } from '@/constants/Colors'

// Import your animations
import loadingCatAnimation from '@/assets/animations/loading_cat.json'
import manRunningAnimation from '@/assets/animations/man_running.json'
import welcomeScreenAnimation from '@/assets/animations/welcome_screen.json'

type AnimationType = 'loading_cat' | 'man_running' | 'welcome_screen'

interface LottieAnimationProps {
  animation: AnimationType
  width: number
  height: number
  loop?: boolean
  autoPlay?: boolean
  onAnimationFinish?: () => void
}

const animationMap = {
  loading_cat: loadingCatAnimation,
  man_running: manRunningAnimation,
  welcome_screen: welcomeScreenAnimation,
}

export default function LottieAnimation({ 
  animation, 
  width, 
  height, 
  loop = true, 
  autoPlay = true,
  onAnimationFinish 
}: LottieAnimationProps) {
  const colorScheme = useColorScheme()
  const theme = colorScheme === 'light' ? Colors.light : Colors.dark

  return (
    <LottieView
      source={animationMap[animation]}
      autoPlay={autoPlay}
      loop={loop}
      onAnimationFinish={onAnimationFinish}
      style={{
        width,
        height,
      }}
    />
  )
}