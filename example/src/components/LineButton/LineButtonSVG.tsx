import React from 'react'
import Svg, { G, Rect, Image, Text, TSpan } from 'react-native-svg'
import { buttonImageURI } from 'src/components/LineButton/button'
import { ButtonSVGProps } from 'src/components/LineButton/types'
import { Color } from 'src/styles/Color'

export const LineButtonSVG = ({
  backgroundColor,
  title,
  separatorColor,
}: ButtonSVGProps) => (
  <Svg height="100%" viewBox="0 0 305 44" width="100%">
    <G
      id="Symbols"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd">
      <G id="LINE-Login-button-/-Base">
        <G id="LINE-Login-button-/-x-/-structure">
          <Rect
            id="button_color"
            fill={backgroundColor}
            fill-rule="evenodd"
            x="0"
            y="0"
            width="305"
            height="44"
            rx="8"
          />
          <Image
            id="line_132"
            x="0"
            y="0"
            width="44"
            height="44"
            xlinkHref={buttonImageURI}
          />
          <Rect
            id="Separator"
            fill={separatorColor}
            fill-rule="evenodd"
            x="44"
            y="0"
            width="1"
            height="44"
          />
          <Text
            id="Text"
            fontFamily="Helvetica-Bold, Helvetica"
            fontSize="15"
            fontWeight="bold"
            fill={Color.White}>
            <TSpan x="115.759766" y="26">
              {title}
            </TSpan>
          </Text>
        </G>
      </G>
    </G>
  </Svg>
)
