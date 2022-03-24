import { Text, TextProps } from './Themed';

export function MonoText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
}

export function BoldText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontWeight: 'bold' }]} />;
}

export function ItalicText(props: TextProps) {
  return <Text {...props} style={[props.style, { fontStyle: 'italic' }]} />;
}
