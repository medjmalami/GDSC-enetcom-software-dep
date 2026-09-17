const BLUE = "var(--g-blue)";
const RED = "var(--g-red)";
const YELLOW = "var(--g-yellow)";
const GREEN = "var(--g-green)";
const FG = "var(--deck-fg)";
const MUTED = "var(--deck-muted)";
const PANEL = "var(--deck-bg-2)";
const LINE = "oklch(1 0 0 / 0.18)";

function Arrow({
  x1,
  y1,
  x2,
  y2,
  color = MUTED,
  label,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  label?: string;
  dashed?: boolean;
}) {
  const id = `ah-${x1}-${y1}-${x2}-${y2}`.replace(/\./g, "_");
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
          <path d="M0,0 L10,4 L0,8 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={4}
        strokeDasharray={dashed ? "12 10" : undefined}
        markerEnd={`url(#${id})`}
      />
      {label ? (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 16}
          fill={color}
          fontSize={26}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

function Box({
  x,
  y,
  w,
  h,
  color,
  title,
  sub,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  title: string;
  sub?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={20} fill={PANEL} stroke={color} strokeWidth={5} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 8 : h / 2 + 12)} fill={color} fontSize={36} fontWeight={600} textAnchor="middle">
        {title}
      </text>
      {sub ? (
        <text x={x + w / 2} y={y + h / 2 + 40} fill={MUTED} fontSize={26} textAnchor="middle">
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function Commit({ cx, cy, color, label }: { cx: number; cy: number; color: string; label?: string | undefined }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={28} fill={color} />
      {label ? (
        <text x={cx} y={cy + 66} fill={MUTED} fontSize={24} textAnchor="middle" fontFamily="var(--font-mono)">
          {label}
        </text>
      ) : null}
    </g>
  );
}

export function ThreeAreasDiagram() {
  return (
    <svg viewBox="0 0 1600 560" className="w-full">
      <Box x={20} y={120} w={380} h={220} color={RED} title="Working directory" sub="your files, edited" />
      <Box x={610} y={120} w={380} h={220} color={YELLOW} title="Staging area" sub="what goes in next commit" />
      <Box x={1200} y={120} w={380} h={220} color={GREEN} title="Repository" sub=".git — history forever" />
      <Arrow x1={410} y1={200} x2={600} y2={200} color={YELLOW} label="git add" />
      <Arrow x1={1000} y1={200} x2={1190} y2={200} color={GREEN} label="git commit" />
      <Arrow x1={1190} y1={400} x2={1000} y2={400} color={MUTED} label="git restore --staged" dashed />
      <Arrow x1={600} y1={400} x2={410} y2={400} color={MUTED} label="git restore" dashed />
      <text x={800} y={500} fill={MUTED} fontSize={28} textAnchor="middle">
        git status tells you where every file currently sits
      </text>
    </svg>
  );
}

export function ObjectModelDiagram() {
  return (
    <svg viewBox="0 0 1600 560" className="w-full">
      <Box x={60} y={60} w={320} h={140} color={BLUE} title="commit" sub="who / when / message" />
      <Box x={620} y={60} w={320} h={140} color={YELLOW} title="tree" sub="a folder listing" />
      <Box x={1180} y={20} w={320} h={120} color={GREEN} title="blob" sub="file contents" />
      <Box x={1180} y={180} w={320} h={120} color={GREEN} title="blob" sub="file contents" />
      <Box x={620} y={300} w={320} h={140} color={YELLOW} title="tree" sub="sub-folder" />
      <Box x={1180} y={340} w={320} h={120} color={GREEN} title="blob" sub="file contents" />
      <Arrow x1={390} y1={130} x2={610} y2={130} color={MUTED} label="points to" />
      <Arrow x1={950} y1={110} x2={1170} y2={80} color={MUTED} />
      <Arrow x1={950} y1={150} x2={1170} y2={240} color={MUTED} />
      <Arrow x1={880} y1={210} x2={800} y2={290} color={MUTED} />
      <Arrow x1={950} y1={380} x2={1170} y2={400} color={MUTED} />
      <Box x={60} y={300} w={320} h={140} color={BLUE} title="parent commit" sub="the one before" />
      <Arrow x1={220} y1={290} x2={220} y2={210} color={BLUE} />
      <text x={800} y={520} fill={MUTED} fontSize={28} textAnchor="middle">
        Everything is content-addressed: change one byte, get a new hash
      </text>
    </svg>
  );
}

export function CommitGraphDiagram() {
  const xs = [140, 400, 660, 920, 1180];
  return (
    <svg viewBox="0 0 1600 400" className="w-full">
      <line x1={140} y1={180} x2={1180} y2={180} stroke={LINE} strokeWidth={6} />
      {xs.map((x, i) => (
        <Commit key={x} cx={x} cy={180} color={i === xs.length - 1 ? BLUE : MUTED} label={["a1b2c3", "d4e5f6", "9f8e7d", "3c2b1a", "HEAD"][i]} />
      ))}
      <rect x={1100} y={60} width={200} height={62} rx={16} fill={PANEL} stroke={BLUE} strokeWidth={4} />
      <text x={1200} y={102} fill={BLUE} fontSize={30} textAnchor="middle" fontFamily="var(--font-mono)">
        main
      </text>
      <Arrow x1={1200} y1={126} x2={1190} y2={150} color={BLUE} />
      <text x={660} y={330} fill={MUTED} fontSize={28} textAnchor="middle">
        A branch is just a moving label pointing at one commit
      </text>
    </svg>
  );
}

export function BranchMergeDiagram() {
  return (
    <svg viewBox="0 0 1600 520" className="w-full">
      <path d="M140 300 H 520" stroke={LINE} strokeWidth={6} fill="none" />
      <path d="M520 300 C 640 300, 640 150, 760 150 H 1020" stroke={GREEN} strokeWidth={6} fill="none" />
      <path d="M520 300 H 1180" stroke={LINE} strokeWidth={6} fill="none" />
      <path d="M1020 150 C 1140 150, 1140 300, 1260 300" stroke={GREEN} strokeWidth={6} fill="none" />
      {[140, 330, 520].map((x) => (
        <Commit key={x} cx={x} cy={300} color={MUTED} />
      ))}
      {[850, 1020].map((x) => (
        <Commit key={x} cx={x} cy={150} color={GREEN} />
      ))}
      {[760, 1000].map((x) => (
        <Commit key={x} cx={x} cy={300} color={MUTED} />
      ))}
      <Commit cx={1330} cy={300} color={BLUE} label="merge commit" />
      <text x={900} y={80} fill={GREEN} fontSize={32} textAnchor="middle" fontFamily="var(--font-mono)">
        feature/login
      </text>
      <text x={300} y={250} fill={MUTED} fontSize={32} fontFamily="var(--font-mono)">
        main
      </text>
      <text x={800} y={470} fill={MUTED} fontSize={28} textAnchor="middle">
        Branch off main → commit freely → merge back when it works
      </text>
    </svg>
  );
}

export function MergeVsRebaseDiagram() {
  return (
    <svg viewBox="0 0 1600 480" className="w-full">
      <text x={60} y={60} fill={BLUE} fontSize={34} fontWeight={600}>
        Merge — keeps both histories
      </text>
      <path d="M80 200 H 700" stroke={LINE} strokeWidth={6} />
      <path d="M260 200 C 360 200, 360 120, 460 120 H 560" stroke={GREEN} strokeWidth={6} fill="none" />
      <path d="M560 120 C 640 120, 640 200, 700 200" stroke={GREEN} strokeWidth={6} fill="none" />
      {[80, 260, 460, 700].map((x) => (
        <Commit key={x} cx={x} cy={200} color={x === 700 ? BLUE : MUTED} />
      ))}
      <Commit cx={560} cy={120} color={GREEN} />
      <text x={60} y={320} fill={YELLOW} fontSize={34} fontWeight={600}>
        Rebase — replays your commits on top, straight line
      </text>
      <path d="M980 200 H 1540" stroke={LINE} strokeWidth={6} />
      {[980, 1120, 1260].map((x) => (
        <Commit key={x} cx={x} cy={200} color={MUTED} />
      ))}
      {[1400, 1540].map((x) => (
        <Commit key={x} cx={x} cy={200} color={YELLOW} />
      ))}
      <text x={1260} y={440} fill={MUTED} fontSize={26} textAnchor="middle">
        Never rebase commits you already pushed and shared
      </text>
    </svg>
  );
}

export function LocalRemoteDiagram() {
  return (
    <svg viewBox="0 0 1600 480" className="w-full">
      <Box x={80} y={140} w={420} h={200} color={BLUE} title="Your laptop" sub="local repository" />
      <Box x={1100} y={140} w={420} h={200} color={RED} title="GitHub" sub="remote: origin" />
      <Arrow x1={510} y1={200} x2={1090} y2={200} color={GREEN} label="git push" />
      <Arrow x1={1090} y1={290} x2={510} y2={290} color={YELLOW} label="git pull / fetch" />
      <text x={800} y={420} fill={MUTED} fontSize={28} textAnchor="middle">
        git clone creates the left box from the right one, the first time
      </text>
    </svg>
  );
}

export function PRLifecycleDiagram() {
  const steps = [
    { label: "Branch", color: BLUE },
    { label: "Commit", color: BLUE },
    { label: "Push", color: YELLOW },
    { label: "Open PR", color: YELLOW },
    { label: "Review", color: RED },
    { label: "Merge", color: GREEN },
  ];
  return (
    <svg viewBox="0 0 1600 420" className="w-full">
      {steps.map((s, i) => {
        const x = 40 + i * 262;
        return (
          <g key={s.label}>
            <rect x={x} y={130} width={220} height={140} rx={24} fill={PANEL} stroke={s.color} strokeWidth={5} />
            <text x={x + 110} y={200} fill={s.color} fontSize={34} fontWeight={600} textAnchor="middle">
              {s.label}
            </text>
            <text x={x + 110} y={240} fill={MUTED} fontSize={24} textAnchor="middle">
              {i + 1}
            </text>
            {i < steps.length - 1 ? (
              <Arrow x1={x + 226} y1={200} x2={x + 256} y2={200} color={MUTED} />
            ) : null}
          </g>
        );
      })}
      <path d="M1250 280 C 1150 380, 700 380, 620 300" stroke={RED} strokeWidth={4} fill="none" strokeDasharray="12 10" />
      <text x={930} y={378} fill={RED} fontSize={26} textAnchor="middle">
        changes requested → push again, same PR updates
      </text>
    </svg>
  );
}

export function ConflictDiagram() {
  return (
    <svg viewBox="0 0 1600 420" className="w-full">
      <Box x={60} y={60} w={460} h={150} color={BLUE} title="You edited line 12" />
      <Box x={60} y={250} w={460} h={150} color={RED} title="Teammate edited line 12" />
      <Arrow x1={530} y1={135} x2={700} y2={200} color={MUTED} />
      <Arrow x1={530} y1={325} x2={700} y2={240} color={MUTED} />
      <Box x={710} y={140} w={380} h={160} color={YELLOW} title="CONFLICT" sub="Git stops and asks you" />
      <Arrow x1={1100} y1={220} x2={1240} y2={220} color={GREEN} />
      <Box x={1250} y={140} w={300} h={160} color={GREEN} title="You decide" sub="edit, add, commit" />
    </svg>
  );
}

export function TeamWorkflowDiagram() {
  return (
    <svg viewBox="0 0 1600 560" className="w-full">
      <path d="M100 360 H 1500" stroke={LINE} strokeWidth={6} />
      <text x={100} y={420} fill={MUTED} fontSize={30} fontFamily="var(--font-mono)">
        main (always deployable)
      </text>
      <path d="M380 360 C 460 360, 460 180, 540 180 H 760" stroke={GREEN} strokeWidth={6} fill="none" />
      <path d="M760 180 C 860 180, 860 360, 940 360" stroke={GREEN} strokeWidth={6} fill="none" />
      <path d="M700 360 C 780 360, 780 500, 860 500 H 1120" stroke={YELLOW} strokeWidth={6} fill="none" />
      {[100, 380, 700, 940, 1240, 1500].map((x) => (
        <Commit key={x} cx={x} cy={360} color={MUTED} />
      ))}
      {[540, 760].map((x) => (
        <Commit key={x} cx={x} cy={180} color={GREEN} />
      ))}
      {[860, 1120].map((x) => (
        <Commit key={x} cx={x} cy={500} color={YELLOW} />
      ))}
      <text x={650} y={120} fill={GREEN} fontSize={30} fontFamily="var(--font-mono)">
        feature/profile-page → PR → review → merge
      </text>
      <text x={940} y={300} fill={BLUE} fontSize={26} textAnchor="middle">
        squash merge
      </text>
    </svg>
  );
}

export function ForkVsBranchDiagram() {
  return (
    <svg viewBox="0 0 1600 420" className="w-full">
      <Box x={80} y={60} w={420} h={140} color={BLUE} title="Branch" sub="inside the same repo" />
      <Box x={80} y={240} w={420} h={140} color={GREEN} title="Fork" sub="your own copy of the repo" />
      <Arrow x1={510} y1={130} x2={900} y2={190} color={MUTED} label="you have write access" />
      <Arrow x1={510} y1={310} x2={900} y2={230} color={MUTED} label="you don't" />
      <Box x={910} y={140} w={580} h={140} color={YELLOW} title="Pull request to the original repo" />
    </svg>
  );
}
