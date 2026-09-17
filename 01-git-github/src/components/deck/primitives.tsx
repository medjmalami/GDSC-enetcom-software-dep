import type { ReactNode } from "react";

export const ACCENTS = {
  blue: "var(--g-blue)",
  red: "var(--g-red)",
  yellow: "var(--g-yellow)",
  green: "var(--g-green)",
} as const;

export type Accent = keyof typeof ACCENTS;

export function Slide({
  children,
  kicker,
  accent = "blue",
}: {
  children: ReactNode;
  kicker?: string;
  accent?: Accent;
}) {
  return (
    <div className="slide-content flex flex-col px-[130px] py-[90px]">
      <div
        className="absolute left-0 top-0 h-[10px] w-full"
        style={{ background: ACCENTS[accent] }}
      />
      {kicker ? (
        <div className="slide-kicker mb-[34px]" style={{ color: ACCENTS[accent] }}>
          {kicker}
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

export function Title({ children, accent }: { children: ReactNode; accent?: Accent }) {
  return (
    <h2
      className="slide-title mb-[48px] font-semibold"
      style={accent ? { color: ACCENTS[accent] } : undefined}
    >
      {children}
    </h2>
  );
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="slide-body-lg mb-[40px] max-w-[1300px] text-deck-muted">{children}</p>
  );
}

export function Bullets({
  items,
  accent = "blue",
}: {
  items: ReactNode[];
  accent?: Accent;
}) {
  return (
    <ul className="flex flex-col gap-[28px]">
      {items.map((item, i) => (
        <li key={i} className="slide-body flex max-w-[1500px] items-start gap-[24px]">
          <span
            className="mt-[14px] inline-block h-[16px] w-[16px] shrink-0 rounded-full"
            style={{ background: ACCENTS[accent] }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Card({
  title,
  children,
  accent = "blue",
}: {
  title?: ReactNode;
  children: ReactNode;
  accent?: Accent;
}) {
  return (
    <div
      className="flex flex-1 flex-col rounded-[24px] border border-deck-line bg-deck-bg-2 p-[40px]"
      style={{ borderTop: `8px solid ${ACCENTS[accent]}` }}
    >
      {title ? (
        <div className="slide-subtitle mb-[22px] font-semibold" style={{ color: ACCENTS[accent] }}>
          {title}
        </div>
      ) : null}
      <div className="slide-body text-deck-fg">{children}</div>
    </div>
  );
}

export function Columns({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 items-stretch gap-[40px]">{children}</div>;
}

const TOKEN_COLORS = {
  cmd: "var(--g-green)",
  flag: "var(--g-yellow)",
  arg: "var(--deck-fg)",
  out: "var(--deck-muted)",
  hint: "var(--g-blue)",
} as const;

function colorize(line: string) {
  if (line.startsWith("#")) {
    return <span style={{ color: TOKEN_COLORS.hint }}>{line}</span>;
  }
  if (!line.startsWith("$")) {
    return <span style={{ color: TOKEN_COLORS.out }}>{line}</span>;
  }
  const parts = line.slice(1).trim().split(" ");
  return (
    <>
      <span style={{ color: "var(--g-red)" }}>$ </span>
      {parts.map((p, i) => (
        <span
          key={i}
          style={{
            color:
              i === 0
                ? TOKEN_COLORS.cmd
                : p.startsWith("-")
                  ? TOKEN_COLORS.flag
                  : i === 1
                    ? "var(--g-blue)"
                    : TOKEN_COLORS.arg,
          }}
        >
          {p}{" "}
        </span>
      ))}
    </>
  );
}

export function Terminal({ lines, title = "bash" }: { lines: string[]; title?: string }) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-deck-line bg-deck-term">
      <div className="flex items-center gap-[14px] border-b border-deck-line px-[28px] py-[16px]">
        <span className="h-[16px] w-[16px] rounded-full" style={{ background: ACCENTS.red }} />
        <span className="h-[16px] w-[16px] rounded-full" style={{ background: ACCENTS.yellow }} />
        <span className="h-[16px] w-[16px] rounded-full" style={{ background: ACCENTS.green }} />
        <span className="slide-chrome ml-[14px] text-deck-muted">{title}</span>
      </div>
      <pre className="px-[36px] py-[30px] font-mono text-[30px] leading-[1.6]">
        {lines.map((l, i) => (
          <div key={i}>{colorize(l)}</div>
        ))}
      </pre>
    </div>
  );
}

export function Pill({ children, accent = "blue" }: { children: ReactNode; accent?: Accent }) {
  return (
    <span
      className="slide-chrome inline-flex items-center rounded-full px-[22px] py-[10px] font-semibold"
      style={{ background: `color-mix(in oklab, ${ACCENTS[accent]} 22%, transparent)`, color: ACCENTS[accent] }}
    >
      {children}
    </span>
  );
}

export function SectionDivider({
  number,
  title,
  duration,
  points,
  accent = "blue",
}: {
  number: string;
  title: string;
  duration: string;
  points?: string[];
  accent?: Accent;
}) {
  return (
    <div className="slide-content flex flex-col justify-center px-[150px]">
      <div
        className="absolute inset-y-0 left-0 w-[24px]"
        style={{ background: ACCENTS[accent] }}
      />
      <div className="slide-title-lg font-bold" style={{ color: ACCENTS[accent] }}>
        {number}
      </div>
      <h2 className="slide-title-lg mt-[20px] max-w-[1400px] font-semibold">{title}</h2>
      <div className="mt-[40px] flex items-center gap-[20px]">
        <Pill accent={accent}>{duration}</Pill>
        {points ? (
          <span className="slide-body text-deck-muted">{points.join("  ·  ")}</span>
        ) : null}
      </div>
    </div>
  );
}

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-[22px]">
      {items.map((item, i) => (
        <li key={i} className="slide-body flex items-start gap-[20px]">
          <span className="mt-[6px] flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[8px] border-[3px] border-deck-line text-deck-muted" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function LabSlide({
  step,
  title,
  checklist,
  commands,
  note,
}: {
  step: string;
  title: string;
  checklist: string[];
  commands?: string[];
  note?: ReactNode;
}) {
  return (
    <Slide kicker={`Hands-on lab · ${step}`} accent="green">
      <Title>{title}</Title>
      <div className="flex flex-1 gap-[48px]">
        <div className="w-[760px]">
          <Checklist items={checklist} />
          {note ? <p className="slide-caption mt-[34px] text-deck-muted">{note}</p> : null}
        </div>
        <div className="flex-1">{commands ? <Terminal lines={commands} /> : null}</div>
      </div>
    </Slide>
  );
}
