import { TextStreamingDisplay } from './TextStreamingDisplay';

interface TextStreamViewProps {
  speed?: number;
}

export default function TextStreamView({ speed = 50 }: TextStreamViewProps) {
  return <TextStreamingDisplay speed={speed} />;
}
