'use client';

import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
}
export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}
export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  isFixed?: boolean;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  colors = ['#B497CF', '#5227FF'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = true,
  className,
  logoUrl = '/Logo.svg',
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  accentColor = '#5227FF',
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const textWrapRef = useRef<HTMLSpanElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close']);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);

  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen, opacity: 1 });
      if (preContainer) {
        gsap.set(preContainer, { xPercent: 0, opacity: 1 });
      }

      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
    const numberEls = Array.from(
      panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
    ) as HTMLElement[];
    const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];

    const offscreen = position === 'left' ? -100 : 100;
    const layerStates = layers.map(el => ({ el, start: offscreen }));
    const panelStart = offscreen;

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    layerStates.forEach((ls, i) => {
      tl.fromTo(ls.el, { xPercent: ls.start }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * 0.07 : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.08 : 0);
    const panelDuration = 0.65;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: 'power4.out' },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.15;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;

      tl.to(
        itemEls,
        { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: { each: 0.1, from: 'start' } },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          { duration: 0.6, ease: 'power2.out', ['--sm-num-opacity' as any]: 1, stagger: { each: 0.08, from: 'start' } },
          itemsStart + 0.1
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.4;

      if (socialTitle) tl.to(socialTitle, { opacity: 1, duration: 0.5, ease: 'power2.out' }, socialsStart);
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: 'power3.out',
            stagger: { each: 0.08, from: 'start' },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: 'opacity' });
            }
          },
          socialsStart + 0.04
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, [position]);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all: HTMLElement[] = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.32,
      ease: 'power3.in',
      overwrite: 'auto',
      onComplete: () => {
        const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
        if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

        const numberEls = Array.from(
          panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
        ) as HTMLElement[];
        if (numberEls.length) gsap.set(numberEls, { ['--sm-num-opacity' as any]: 0 });

        const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
        const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];
        if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
        if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

        busyRef.current = false;
      }
    });
  }, [position]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to(h, { rotate: 45, duration: 0.5 }, 0)
        .to(v, { rotate: -45, duration: 0.5 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .to(h, { rotate: 0, duration: 0.35 }, 0)
        .to(v, { rotate: 90, duration: 0.35 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0.18, duration: 0.3, ease: 'power2.out' });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const currentLabel = opening ? 'Menu' : 'Close';
    const targetLabel = opening ? 'Close' : 'Menu';
    const cycles = 3;

    const seq: string[] = [currentLabel];
    let last = currentLabel;
    for (let i = 0; i < cycles; i++) {
      last = last === 'Menu' ? 'Close' : 'Menu';
      seq.push(last);
    }
    if (last !== targetLabel) seq.push(targetLabel);
    seq.push(targetLabel);

    setTextLines(seq);
    gsap.set(inner, { yPercent: 0 });

    const lineCount = seq.length;
    const finalShift = ((lineCount - 1) / lineCount) * 100;

    textCycleAnimRef.current = gsap.to(inner, {
      yPercent: -finalShift,
      duration: 0.5 + lineCount * 0.07,
      ease: 'power4.out'
    });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(() => {
    if (openRef.current) {
      openRef.current = false;
      setOpen(false);
      onMenuClose?.();
      playClose();
      animateIcon(false);
      animateColor(false);
      animateText(false);
    }
  }, [playClose, animateIcon, animateColor, animateText, onMenuClose]);

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  return (
    <div
      className={`sm-scope z-50 ${
        isFixed ? 'fixed top-0 left-0 w-screen h-screen overflow-hidden pointer-events-none' : 'w-full h-full'
      }`}
    >
      <div
        className={
          (className ? className + ' ' : '') + 'staggered-menu-wrapper pointer-events-none relative w-full h-full z-50'
        }
        style={accentColor ? ({ ['--sm-accent' as any]: accentColor } as React.CSSProperties) : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        <div
          ref={preLayersRef}
          className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
          aria-hidden="true"
        >
          {(() => {
            const raw = colors && colors.length ? colors.slice(0, 4) : ['#1e1e22', '#35353c'];
            const arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div
                key={i}
                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                style={{ background: c }}
              />
            ));
          })()}
        </div>

        <header
          className="staggered-menu-header absolute top-0 left-0 w-full flex items-center justify-end bg-transparent pointer-events-none z-20"
          aria-label="Main navigation header"
        >
          <a
            href="/"
            onClick={closeMenu}
            className="sm-logo absolute left-1/2 -translate-x-1/2 flex items-center select-none pointer-events-auto"
            aria-label="KramZ Home"
          >
            <svg
              className="sm-logo-svg block h-7 sm:h-8 w-auto object-contain drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)]"
              width="110"
              height="24"
              viewBox="0 0 105 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                className="sm-logo-word transition-colors duration-300"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M35.9894 7.27868C37.0142 7.2787 37.9338 7.39944 38.7475 7.64167C39.5611 7.87771 40.2537 8.21029 40.8251 8.63885C41.3965 9.06121 41.8316 9.55787 42.1298 10.1293C42.4341 10.6945 42.586 11.3096 42.586 11.9742V21.7765H37.7781V19.7637H37.6663C37.3806 20.2978 37.0328 20.7298 36.6229 21.0591C36.2191 21.3883 35.756 21.6274 35.2342 21.7765C34.7188 21.9255 34.1506 22 33.5296 22C32.6165 22 31.8087 21.8512 31.1067 21.553C30.411 21.2486 29.8644 20.7886 29.4668 20.1736C29.0694 19.5587 28.8704 18.7758 28.8704 17.8255C28.8704 17.043 29.0041 16.3754 29.2711 15.8226C29.5382 15.2636 29.9111 14.8073 30.3893 14.4532C30.8675 14.0992 31.4234 13.8289 32.0569 13.6425C32.6967 13.4562 33.3862 13.3347 34.1253 13.2788C34.9265 13.2167 35.5697 13.1423 36.0542 13.0553C36.5449 12.9621 36.8994 12.8346 37.1168 12.6731C37.334 12.5054 37.4428 12.285 37.4428 12.0119V11.9742C37.4428 11.6017 37.2999 11.3159 37.0143 11.1172C36.7286 10.9184 36.3619 10.819 35.9147 10.819C35.4239 10.819 35.0231 10.9275 34.7125 11.145C34.4081 11.3562 34.2252 11.6826 34.163 12.1236H29.4298C29.492 11.254 29.7683 10.4523 30.259 9.7193C30.756 8.98023 31.4796 8.39013 32.4299 7.94915C33.3803 7.50193 34.567 7.27868 35.9894 7.27868ZM37.4798 15.5152C37.3433 15.571 37.1973 15.6235 37.0421 15.6732C36.893 15.7229 36.7313 15.7699 36.5574 15.8134C36.3897 15.8568 36.2096 15.8971 36.0172 15.9344C35.8308 15.9717 35.635 16.0058 35.43 16.0369C35.0326 16.099 34.7066 16.2016 34.452 16.3444C34.2035 16.481 34.0168 16.6518 33.8926 16.8568C33.7746 17.0556 33.7153 17.2796 33.7153 17.528C33.7154 17.9254 33.8558 18.2294 34.1353 18.4405C34.4148 18.6517 34.7717 18.7579 35.2065 18.7579C35.5978 18.7579 35.9645 18.6767 36.3061 18.5152C36.6539 18.3537 36.9365 18.1206 37.1538 17.8163C37.3711 17.512 37.4798 17.1427 37.4798 16.7081V15.5152Z"
                fill="white"
              />
              <path
                className="sm-logo-word transition-colors duration-300"
                d="M5.1809 10.409H5.4414L11.181 2.69423H17.2189L10.7711 11.1919L17.3676 21.7765H11.181L6.89481 14.6205L5.1809 16.8568V21.7765H0V2.69423H5.1809V10.409Z"
                fill="white"
              />
              <path
                className="sm-logo-word transition-colors duration-300"
                d="M27.217 7.27868C27.4405 7.27869 27.6609 7.29694 27.8782 7.33419C28.1017 7.36524 28.316 7.41162 28.5209 7.4737V11.8624C28.2663 11.7755 27.9526 11.7101 27.58 11.6667C27.2074 11.6232 26.8876 11.6019 26.6205 11.6019C26.1174 11.6019 25.6634 11.7166 25.2596 11.9464C24.8622 12.17 24.5485 12.4868 24.3187 12.8966C24.0889 13.3003 23.9742 13.7757 23.9742 14.3222V21.7765H18.831V7.46445H23.8247V10.1855H23.9742C24.2351 9.1792 24.6481 8.44279 25.2134 7.97691C25.7848 7.5111 26.453 7.27868 27.217 7.27868Z"
                fill="white"
              />
              <path
                className="sm-logo-word transition-colors duration-300"
                d="M62.5608 7.27868C63.9334 7.27873 65.0452 7.71927 65.8961 8.60113C66.7533 9.48319 67.1823 10.6577 67.1823 12.1236V17.7159L63.1217 21.7765H62.0391V13.4283C62.0391 12.8009 61.8804 12.3097 61.5636 11.9556C61.2468 11.5954 60.8209 11.4154 60.2867 11.4154C59.7589 11.4155 59.3396 11.5954 59.0291 11.9556C58.7247 12.3097 58.5728 12.8009 58.5728 13.4283V21.7765H53.6531V13.4283C53.6531 12.8009 53.4945 12.3097 53.1777 11.9556C52.861 11.5955 52.4355 11.4155 51.9015 11.4154C51.5475 11.4154 51.243 11.496 50.9883 11.6574C50.7337 11.8189 50.5347 12.052 50.3919 12.3564C50.2552 12.6545 50.1869 13.0121 50.1869 13.4283V21.7765H45.0437V7.46445H49.9257V10.1855H50.0751C50.3733 9.29101 50.8827 8.58269 51.6033 8.0609C52.3238 7.53921 53.1811 7.27868 54.1749 7.27868C55.181 7.2787 56.0475 7.54532 56.7742 8.07941C57.501 8.6074 57.939 9.30965 58.0881 10.1855H58.2369C58.4791 9.30965 58.9954 8.6074 59.7842 8.07941C60.5731 7.54535 61.4988 7.27868 62.5608 7.27868Z"
                fill="white"
              />
              <path
                d="M93.8611 0L77.5262 15.9792H99.7146L104.452 21.7765H64.3779L80.7128 5.79728H43.2393L47.4174 0H93.8611Z"
                fill="#0219EA"
              />
              <path
                d="M21.6175 5.79728H17.9064L22.2795 0H25.7948L21.6175 5.79728Z"
                fill="#0219EA"
              />
              <path
                d="M40.5674 5.79728H33.0356L37.2136 0H44.7447L40.5674 5.79728Z"
                fill="#0219EA"
              />
              <path
                d="M30.3636 5.79728H24.2895L28.4675 0H34.5409L30.3636 5.79728Z"
                fill="#0219EA"
              />
            </svg>
          </a>

          <button
            ref={toggleBtnRef}
            className={`sm-toggle relative ml-auto inline-flex items-center gap-[0.3rem] bg-transparent border-0 cursor-pointer font-medium leading-none overflow-visible pointer-events-auto ${
              open ? 'text-black' : 'text-[#e9e9ef]'
            }`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span
              ref={textWrapRef}
              className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)]"
              aria-hidden="true"
            >
              <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line block h-[1em] leading-none" key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>

            <span
              ref={iconRef}
              className="sm-icon relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center [will-change:transform]"
              aria-hidden="true"
            >
              <span
                ref={plusHRef}
                className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
              />
              <span
                ref={plusVRef}
                className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
              />
            </span>
          </button>
        </header>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className={`staggered-menu-panel absolute top-0 right-0 h-full bg-white flex flex-col p-[6em_2em_2em_2em] overflow-y-auto z-10 backdrop-blur-[12px] ${
            open ? 'pointer-events-auto' : 'pointer-events-none'
          }`}
          style={{ WebkitBackdropFilter: 'blur(12px)' }}
          aria-hidden={!open}
        >
          <div className="sm-panel-inner flex-1 flex flex-col gap-5">
            <ul
              className="sm-panel-list list-none m-0 p-0 flex flex-col gap-2"
              role="list"
              data-numbering={displayItemNumbering || undefined}
            >
              {items && items.length ? (
                items.map((it, idx) => (
                  <li className="sm-panel-itemWrap relative overflow-hidden leading-none" key={it.label + idx}>
                    <a
                      className="sm-panel-item relative text-black font-semibold text-[3.5rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em]"
                      href={it.link}
                      aria-label={it.ariaLabel}
                      data-index={idx + 1}
                      onClick={closeMenu}
                    >
                      <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                        {it.label}
                      </span>
                    </a>
                  </li>
                ))
              ) : (
                <li className="sm-panel-itemWrap relative overflow-hidden leading-none" aria-hidden="true">
                  <span className="sm-panel-item relative text-black font-semibold text-[3.5rem] cursor-pointer leading-none tracking-[-2px] uppercase transition-[background,color] duration-150 ease-linear inline-block no-underline pr-[1.4em]">
                    <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                      No items
                    </span>
                  </span>
                </li>
              )}
            </ul>

            {displaySocials && socialItems && socialItems.length > 0 && (
              <div className="sm-socials mt-auto pt-8 flex flex-col gap-3" aria-label="Social links">
                <h3 className="sm-socials-title m-0 text-base font-medium [color:var(--sm-accent,#ff0000)]">Socials</h3>
                <ul
                  className="sm-socials-list list-none m-0 p-0 flex flex-row items-center gap-4 flex-wrap"
                  role="list"
                >
                  {socialItems.map((s, i) => (
                    <li key={s.label + i} className="sm-socials-item">
                      <a
                        href={s.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sm-socials-link text-[1.2rem] font-medium text-[#111] no-underline relative inline-block py-[2px] transition-[color,opacity] duration-300 ease-linear"
                      >
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>
      </div>

      <style>{`
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; pointer-events: none; }
.sm-scope .staggered-menu-header { position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: flex-end; padding: 1.35em 1.75em; background: transparent; pointer-events: none; z-index: 20; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }
.sm-scope .sm-logo { display: flex; align-items: center; user-select: none; }
.sm-scope .sm-logo-svg { display: block; height: 32px; width: auto; object-fit: contain; }
.sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; gap: 0.28rem; background: transparent; border: none; cursor: pointer; color: #e9e9ef; font-weight: 500; line-height: 1; overflow: visible; padding: 0; }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid #ffffffaa; outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-line:last-of-type { margin-top: 6px; }
.sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.25em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
.sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; align-items: flex-end; line-height: 1; }
.sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
.sm-scope .sm-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: hidden; line-height: 1; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
.sm-scope .sm-line { display: none !important; }
.sm-scope .staggered-menu-panel { position: absolute; top: 0; right: 0; width: clamp(260px, 38vw, 420px); height: 100%; background: white; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); display: flex; flex-direction: column; padding: 6em 2em 2em 2em; overflow-y: auto; z-index: 10; }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: clamp(260px, 38vw, 420px); pointer-events: none; z-index: 5; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; transform: translateX(0); }
.sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
.sm-scope .sm-socials { margin-top: auto; padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sm-scope .sm-socials-title { margin: 0; font-size: 1rem; font-weight: 500; color: var(--sm-accent, #ff0000); }
.sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; }
.sm-scope .sm-socials-list .sm-socials-link { opacity: 1; transition: opacity 0.3s ease; }
.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
.sm-scope .sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) { opacity: 0.35; }
.sm-scope .sm-socials-list .sm-socials-link:hover,
.sm-scope .sm-socials-list .sm-socials-link:focus-visible { opacity: 1; }
.sm-scope .sm-socials-link:focus-visible { outline: 2px solid var(--sm-accent, #ff0000); outline-offset: 3px; }
.sm-scope .sm-socials-link { font-size: 1.2rem; font-weight: 500; color: #111; text-decoration: none; position: relative; padding: 2px 0; display: inline-block; transition: color 0.3s ease, opacity 0.3s ease; }
.sm-scope .sm-socials-link:hover { color: var(--sm-accent, #ff0000); }
.sm-scope .sm-panel-title { margin: 0; font-size: 1rem; font-weight: 600; color: #fff; text-transform: uppercase; }
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.sm-scope .sm-panel-item { position: relative; color: #000; font-weight: 600; font-size: 3.5rem; cursor: pointer; line-height: 1; letter-spacing: -2px; text-transform: uppercase; transition: background 0.25s, color 0.25s; display: inline-block; text-decoration: none; padding-right: 1.4em; }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-item:hover { color: var(--sm-accent, #ff0000); }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 3.2em; font-size: 18px; font-weight: 400; color: var(--sm-accent, #ff0000); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
@media (max-width: 1024px) {
  .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; }
  .sm-scope .sm-prelayers { width: 100%; }
  .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-svg { filter: none; }
  .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-word { fill: #0a0a0a; }
}
@media (max-width: 640px) {
  .sm-scope .staggered-menu-header { padding: 1.05rem 0.65rem; }
  .sm-scope .sm-logo-svg { height: 27px; }
  .sm-scope .sm-toggle { font-size: 0.9rem; gap: 0.22rem; }
  .sm-scope .sm-toggle-textWrap { margin-right: 0.15em; }
  .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; }
  .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-svg { filter: none; }
  .sm-scope .staggered-menu-wrapper[data-open] .sm-logo-word { fill: #0a0a0a; }
}
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
