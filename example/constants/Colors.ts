export enum Color {
  Black = '#000000',
  Black8PCT = '#00000014',
  Black50PCT = '#00000080',
  Gray = '#1E1E1E',
  Gray20PCT = '#1E1E1E33',
  Green = '#06C755',
  LightGray = '#E5E5E5',
  LightGray60PCT = '#E5E5E599',
  White = '#FFFFFF',
}

export const Colors = {
  dark: {
    background: Color.Gray,
    icon: Color.Green,
    text: Color.LightGray,
    tint: Color.Green,
  },
  light: {
    background: Color.White,
    icon: Color.Green,
    text: Color.Gray,
    tint: Color.Green,
  },
}
