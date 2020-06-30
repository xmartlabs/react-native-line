import React, { useState } from 'react'
import { TouchableHighlight } from 'react-native'
import { LayoutProps } from 'src/components/LineButton/types'
import { LineButtonSVG } from 'src/components/LineButton/LineButtonSVG'
import { styles } from './styles'
import { Color } from 'src/styles/Color'

interface ComponentFeedback {
  base: string
  disabled: string
  press: string
}

const componentFeedback = (
  buttonPressed: boolean,
  disabled: boolean,
  feedbackColor: ComponentFeedback,
) =>
  disabled
    ? feedbackColor.disabled
    : buttonPressed
    ? feedbackColor.press
    : feedbackColor.base

export const LineButton = ({
  title,
  onPress,
  disabled = false,
}: LayoutProps) => {
  const [buttonPressed, setButtonPressed] = useState(false)
  const backgroundColor = componentFeedback(buttonPressed, disabled, {
    disabled: Color.Grey2,
    press: Color.Green2,
    base: Color.PrimaryGreen,
  })
  const separatorColor = componentFeedback(buttonPressed, disabled, {
    disabled: Color.Grey1,
    press: Color.Green1,
    base: Color.Green2,
  })
  const onHideUnderlay = () => setButtonPressed(false)
  const onShowUnderlay = () => setButtonPressed(true)
  const onPressTouchable = () => !disabled && onPress()
  return (
    <TouchableHighlight
      onPress={onPressTouchable}
      onHideUnderlay={onHideUnderlay}
      onShowUnderlay={onShowUnderlay}
      style={styles.container}>
      <LineButtonSVG
        title={title}
        backgroundColor={backgroundColor}
        separatorColor={separatorColor}
      />
    </TouchableHighlight>
  )
}
