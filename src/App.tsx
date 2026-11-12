import { EduProvider } from './edu/store';
import { Shell } from './edu/Shell';

export default function App() {
  return (
    <EduProvider>
      <Shell />
    </EduProvider>
  );
}
