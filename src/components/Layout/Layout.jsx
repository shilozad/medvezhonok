import { BackgroundEffects } from '../BackgroundEffects/BackgroundEffects';

export function Layout({ children }) {
  return (
    <div className="app-shell">
      <BackgroundEffects />
      <main className="screen-fade app-content">{children}</main>
    </div>
  );
}
