export enum BaseColors {
  Black = '#000000',
  Black8PCT = '#00000014',
  Gray = '#1E1E1E',
  Gray20PCT = '#1E1E1E33',
  Green = '#06C755',
  LightGray = '#E5E5E5',
  LightGray60PCT = '#E5E5E599',
  White = '#FFFFFF',
}

export const Colors = {
  dark: {
    background: BaseColors.Gray,
    icon: BaseColors.Green,
    text: BaseColors.LightGray,
    tint: BaseColors.Green,
  },
  light: {
    background: BaseColors.White,
    icon: BaseColors.Green,
    text: BaseColors.Gray,
    tint: BaseColors.Green,
  },
}
