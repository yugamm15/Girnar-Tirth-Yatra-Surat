import { useEffect } from 'react';
import { SiteFooter } from './SiteFooter.jsx';
import { SiteNavbar } from './SiteNavbar.jsx';

export const LightPageShell = ({ children }) => {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return undefined;
    }

    document.documentElement.classList.add('light-route-active');
    document.body.classList.add('light-route-active');

    return () => {
      document.documentElement.classList.remove('light-route-active');
      document.body.classList.remove('light-route-active');
    };
  }, []);

  return (
    <div className="light-shell min-h-screen min-h-dvh text-[#1b1b1b]">
      <div className="light-shell-grid" aria-hidden="true" />
      <div className="light-shell-orb light-shell-orb-a" aria-hidden="true" />
      <div className="light-shell-orb light-shell-orb-b" aria-hidden="true" />

      <div className="relative z-10 flex min-h-full flex-col">
        <SiteNavbar variant="light" />
        <main className="flex-1 pt-24 md:pt-32 pb-16 md:pb-24 px-4 md:px-6">{children}</main>
        <SiteFooter variant="light" />
      </div>
    </div>
  );
};
