"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

export type NavLink = Readonly<{ href: string; label: string }>;
export type NavItem = NavLink | Readonly<{ label: string; children: readonly NavLink[] }>;

export function MobileNavigation({ links }: { links: readonly NavItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeTimerRef = useRef<number | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const finishClose = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    document.documentElement.classList.remove("menu-open");
    setIsOpen(false);
  };

  const close = () => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;

    dialog.dataset.state = "closed";
    window.clearTimeout(closeTimerRef.current ?? undefined);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finishClose();
      return;
    }

    closeTimerRef.current = window.setTimeout(finishClose, 220);
  };

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;

    dialog.showModal();
    document.documentElement.classList.add("menu-open");
    setIsOpen(true);
    requestAnimationFrame(() => {
      dialog.dataset.state = "open";
    });
  };

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      const dialog = dialogRef.current;
      window.clearTimeout(closeTimerRef.current ?? undefined);
      if (dialog?.open) {
        dialog.dataset.state = "closed";
        dialog.close();
      }
      document.documentElement.classList.remove("menu-open");
      setIsOpen(false);
    };

    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
      window.clearTimeout(closeTimerRef.current ?? undefined);
      document.documentElement.classList.remove("menu-open");
    };
  }, []);

  return (
    <div className="mobile-nav">
      <button
        aria-controls="mobile-menu"
        aria-expanded={isOpen}
        aria-label="باز کردن منو"
        className="mobile-nav__toggle"
        onClick={open}
        type="button"
      >
        <span aria-hidden="true" className="mobile-nav__menu-icon">
          <span />
          <span />
        </span>
      </button>

      <dialog
        aria-labelledby="mobile-menu-title"
        className="mobile-nav__dialog"
        data-state="closed"
        id="mobile-menu"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        ref={dialogRef}
      >
        <div className="mobile-nav__panel">
          <div className="mobile-nav__topline">
            <p className="mobile-nav__title" id="mobile-menu-title">زی‌تک</p>
            <button
              aria-label="بستن منو"
              autoFocus
              className="mobile-nav__close"
              onClick={close}
              type="button"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24">
                <path d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>

          <nav aria-label="ناوبری موبایل">
            <ul className="mobile-nav__links">
              {links.map((item, index) => (
                <li
                  key={"children" in item ? item.label : item.href}
                  style={{ "--item-index": index } as CSSProperties}
                >
                  {"children" in item ? (
                    <details className="mobile-nav__group">
                      <summary>
                        <span>{item.label}</span>
                        <span aria-hidden="true" className="mobile-nav__chevron">
                          <svg viewBox="0 0 12 8">
                            <path d="m1.5 2 4.5 4 4.5-4" />
                          </svg>
                        </span>
                      </summary>

                      <ul className="mobile-nav__sublinks">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link href={child.href} onClick={close}>
                              <span>{child.label}</span>
                              <span aria-hidden="true">↙</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ) : (
                    <Link href={item.href} onClick={close}>
                      <span>{item.label}</span>
                      <span aria-hidden="true">↙</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <Link className="mobile-nav__cta" href="#contact" onClick={close}>
            شروع همکاری با زی‌تک
          </Link>
        </div>
      </dialog>
    </div>
  );
}