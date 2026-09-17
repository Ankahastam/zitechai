"use client";

// Adapted from beui.dev/components/blocks/morphing-tabs.
// Reordering and closing are intentionally omitted: these tabs are site navigation.
import {
  AnimatePresence,
  animate as animateValue,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  useCallback,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

export type MorphingTabsItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  content: ReactNode;
  disabled?: boolean;
};

export type MorphingTabsClassNames = {
  root?: string;
  rail?: string;
  tab?: string;
  activeTab?: string;
  icon?: string;
  label?: string;
  content?: string;
};

export type MorphingTabsProps = {
  items: MorphingTabsItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (id: string | null) => void;
  ariaLabel?: string;
  className?: string;
  classNames?: MorphingTabsClassNames;
};

const TAB_HEIGHT = 64;
const TAB_TOP = 24;
const TAB_RADIUS = 24;
const RAIL_HEIGHT = 88;
const SURFACE_INSET = 12;
const LIQUID_JOIN = 24;
const PANEL_RADIUS = 32;
const SPRING_GLIDE = { type: "spring", stiffness: 700, damping: 50, mass: 0.5 } as const;
const SPRING_PRESS = { type: "spring", stiffness: 520, damping: 38, mass: 0.45 } as const;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;

function classes(...values: Array<string | undefined | false>) {
  return values.filter(Boolean).join(" ");
}

function safeId(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "-");
}

function liquidTabPath(tabLeft: number, surfaceWidth: number, tabWidth: number) {
  const panelLeft = SURFACE_INSET;
  const panelRight = surfaceWidth - SURFACE_INSET;
  const left = Math.max(panelLeft, Math.min(panelRight - tabWidth, tabLeft));
  const right = left + tabWidth;
  const top = RAIL_HEIGHT - TAB_HEIGHT;
  const bottom = RAIL_HEIGHT;
  const leftJoin = Math.max(panelLeft, left - LIQUID_JOIN);
  const rightJoin = Math.min(panelRight, right + LIQUID_JOIN);
  const leftDepth = Math.min(LIQUID_JOIN, left - leftJoin);
  const rightDepth = Math.min(LIQUID_JOIN, rightJoin - right);
  const leftControl = leftDepth * 0.55;
  const rightControl = rightDepth * 0.55;
  const leftPanelRadius = Math.min(PANEL_RADIUS, leftJoin - panelLeft);
  const rightPanelRadius = Math.min(PANEL_RADIUS, panelRight - rightJoin);

  return [
    `M${panelLeft} ${bottom + PANEL_RADIUS}`,
    `V${bottom + leftPanelRadius}`,
    `Q${panelLeft} ${bottom} ${panelLeft + leftPanelRadius} ${bottom}`,
    `H${leftJoin}`,
    `C${leftJoin + leftControl} ${bottom} ${left} ${bottom - leftDepth + leftControl} ${left} ${bottom - leftDepth}`,
    `V${top + TAB_RADIUS}`,
    `Q${left} ${top} ${left + TAB_RADIUS} ${top}`,
    `H${right - TAB_RADIUS}`,
    `Q${right} ${top} ${right} ${top + TAB_RADIUS}`,
    `V${bottom - rightDepth}`,
    `C${right} ${bottom - rightDepth + rightControl} ${rightJoin - rightControl} ${bottom} ${rightJoin} ${bottom}`,
    `H${panelRight - rightPanelRadius}`,
    `Q${panelRight} ${bottom} ${panelRight} ${bottom + rightPanelRadius}`,
    `V${bottom + PANEL_RADIUS}`,
    "Z",
  ].join(" ");
}

function LiquidSurfacePath({
  left,
  surfaceWidth,
  tabWidth,
}: {
  left: MotionValue<number>;
  surfaceWidth: number;
  tabWidth: number;
}) {
  const path = useTransform(left, (value) => liquidTabPath(value, surfaceWidth, tabWidth));
  return <motion.path d={path} fill="currentColor" />;
}

export function MorphingTabs({
  items,
  value,
  defaultValue,
  onValueChange,
  ariaLabel = "Tabs",
  className,
  classNames,
}: MorphingTabsProps) {
  const reduce = Boolean(useReducedMotion());
  const uid = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const positioned = useRef(false);
  const [surfaceWidth, setSurfaceWidth] = useState(0);
  const [gap, setGap] = useState(8);
  const itemMap = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);
  const firstEnabled = items.find((item) => !item.disabled) ?? items[0] ?? null;
  const [internalValue, setInternalValue] = useState(defaultValue ?? firstEnabled?.id ?? null);
  const controlled = value !== undefined;
  const currentValue = controlled ? value : internalValue;
  const activeItem = (currentValue && itemMap.get(currentValue)) || firstEnabled;
  const activeId = activeItem?.id ?? null;
  const surfaceLeft = useMotionValue(SURFACE_INSET);

  const tabWidth = useMemo(() => {
    if (!surfaceWidth || !items.length) return 176;
    return Math.max(0, Math.floor((surfaceWidth - SURFACE_INSET * 2 - gap * (items.length - 1)) / items.length));
  }, [gap, items.length, surfaceWidth]);

  const slotLefts = useMemo(
    () => items.map((_, index) => SURFACE_INSET + (items.length - 1 - index) * (tabWidth + gap)),
    [gap, items, tabWidth],
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const measure = () => {
      setSurfaceWidth(root.clientWidth);
      const nextGap = Number.parseFloat(getComputedStyle(root).getPropertyValue("--morph-tabs-gap"));
      if (Number.isFinite(nextGap)) setGap(nextGap);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const index = items.findIndex((item) => item.id === activeId);
    const target = slotLefts[index];
    if (index < 0 || target === undefined) return;

    if (!positioned.current || reduce) {
      surfaceLeft.jump(target);
      positioned.current = true;
      return;
    }

    const controls = animateValue(surfaceLeft, target, SPRING_GLIDE);
    return () => controls.stop();
  }, [activeId, items, reduce, slotLefts, surfaceLeft]);

  const setActive = useCallback(
    (id: string) => {
      if (itemMap.get(id)?.disabled) return;
      if (!controlled) setInternalValue(id);
      onValueChange?.(id);
    },
    [controlled, itemMap, onValueChange],
  );

  const handleKeyDown = useCallback(
    (id: string, event: KeyboardEvent<HTMLButtonElement>) => {
      const enabled = items.filter((item) => !item.disabled);
      const index = enabled.findIndex((item) => item.id === id);
      if (index < 0) return;

      let nextIndex: number | undefined;
      if (event.key === "ArrowLeft") nextIndex = (index + 1) % enabled.length;
      if (event.key === "ArrowRight") nextIndex = (index - 1 + enabled.length) % enabled.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = enabled.length - 1;
      if (nextIndex === undefined) return;

      event.preventDefault();
      const nextId = enabled[nextIndex].id;
      setActive(nextId);
      requestAnimationFrame(() => tabRefs.current[nextId]?.focus());
    },
    [items, setActive],
  );

  if (!items.length) return null;

  return (
    <div ref={rootRef} className={classes("morphing-tabs", classNames?.root, className)}>
      <div className={classes("morphing-tabs__rail", classNames?.rail)} role="tablist" aria-label={ariaLabel} aria-orientation="horizontal">
        {surfaceWidth > SURFACE_INSET * 2 ? (
          <svg
            aria-hidden="true"
            focusable="false"
            viewBox={`0 0 ${surfaceWidth} ${RAIL_HEIGHT + PANEL_RADIUS}`}
            preserveAspectRatio="none"
            className={classes("morphing-tabs__surface", classNames?.activeTab)}
          >
            <LiquidSurfacePath left={surfaceLeft} surfaceWidth={surfaceWidth} tabWidth={tabWidth} />
          </svg>
        ) : null}

        {items.map((item, index) => {
          const isActive = item.id === activeId;
          const tabId = `${uid}-tab-${safeId(item.id)}`;
          return (
            <div
              className="morphing-tabs__slot"
              key={item.id}
              style={{ width: tabWidth, left: slotLefts[index], height: TAB_HEIGHT, top: TAB_TOP }}
            >
              <button
                ref={(node) => { tabRefs.current[item.id] = node; }}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`${uid}-panel`}
                tabIndex={isActive ? 0 : -1}
                disabled={item.disabled}
                onClick={() => setActive(item.id)}
                onKeyDown={(event) => handleKeyDown(item.id, event)}
                className={classes("morphing-tabs__tab", isActive && "is-active", classNames?.tab)}
              >
                {item.icon ? <span aria-hidden="true" className={classes("morphing-tabs__icon", classNames?.icon)}>{item.icon}</span> : null}
                <span className={classes("morphing-tabs__label", classNames?.label)}>{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>

      <div
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${safeId(activeId ?? "empty")}`}
        className={classes("morphing-tabs__content", classNames?.content)}
      >
        <AnimatePresence mode="wait" initial={false}>
          {activeItem ? (
            <motion.div
              key={activeItem.id}
              className="morphing-tabs__panel"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={reduce
                ? { opacity: 0, transition: { duration: 0.08, ease: EASE_OUT } }
                : { opacity: 0, y: -5, filter: "blur(5px)", transition: { duration: 0.12, ease: EASE_OUT } }}
              transition={reduce ? { duration: 0.12, ease: EASE_OUT } : SPRING_PRESS}
            >
              {activeItem.content}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
