import type { ReactNode } from "react";
import {
  Bullets,
  Card,
  Columns,
  LabSlide,
  Lead,
  Pill,
  SectionDivider,
  Slide,
  Terminal,
  Title,
  Checklist,
} from "./primitives";
import {
  BranchMergeDiagram,
  CommitGraphDiagram,
  ConflictDiagram,
  ForkVsBranchDiagram,
  LocalRemoteDiagram,
  MergeVsRebaseDiagram,
  ObjectModelDiagram,
  PRLifecycleDiagram,
  TeamWorkflowDiagram,
  ThreeAreasDiagram,
} from "./diagrams";

export type DeckSlide = {
  id: string;
  section: string;
  title: string;
  render: () => ReactNode;
};

const s = (id: string, section: string, title: string, render: () => ReactNode): DeckSlide => ({
  id,
  section,
  title,
  render,
});

export const slides: DeckSlide[] = [
  // ---------- 1. Opener (title only) ----------
  s("title", "Opener", "Git & GitHub: From Zero to Collaborative Workflow", () => (
    <Slide accent="blue">
      <div className="flex flex-1 flex-col items-start justify-center">
        <div className="slide-kicker mb-[30px] text-g-blue">GDSC Software Engineering Curriculum · Session 1</div>
        <h1 className="max-w-[1500px] text-[110px] font-bold leading-[1.05]">
          Git & GitHub
          <br />
          <span style={{ color: "var(--g-blue)" }}>From Zero</span> to{" "}
          <span style={{ color: "var(--g-green)" }}>Collaborative Workflow</span>
        </h1>
        <p className="slide-body-lg mt-[50px] max-w-[1100px] text-deck-muted">
          A beginner-friendly, instructor-led workshop on version control, branching, and real-world team collaboration.
        </p>
      </div>
    </Slide>
  )),

  // ---------- 2. Why version control ----------
  s("div-why", "Why VCS", "Section: Why version control", () => (
    <SectionDivider number="01" title="Why version control exists" duration="20 min" accent="red" points={["The problem", "Centralized vs distributed", "Why Git won"]} />
  )),
  s("why-problem", "Why VCS", "The problem", () => (
    <Slide kicker="Why version control" accent="red">
      <Title>You already have a version control system</Title>
      <Lead>It&apos;s just a very bad one.</Lead>
      <div className="rounded-[24px] border border-deck-line bg-deck-bg-2 p-[48px] font-mono text-[36px] leading-[1.9] text-deck-muted">
        <div>projet.zip</div>
        <div>projet_v2.zip</div>
        <div>projet_final.zip</div>
        <div style={{ color: "var(--g-yellow)" }}>projet_final_v2.zip</div>
        <div style={{ color: "var(--g-red)" }}>projet_final_REALLY_FINAL_amine.zip</div>
        <div style={{ color: "var(--g-red)" }}>projet_final_REALLY_FINAL_amine_FIXED(3).zip</div>
      </div>
      <p className="slide-body mt-[40px] text-deck-muted">
        Which one is on the teacher&apos;s USB stick? Who changed the database file? Good luck.
      </p>
    </Slide>
  )),
  s("why-costs", "Why VCS", "What it costs you", () => (
    <Slide kicker="Why version control" accent="red">
      <Title>What that actually costs</Title>
      <Columns>
        <Card title="Lost work" accent="red">
          One overwrite and an evening disappears. There is no undo across files.
        </Card>
        <Card title="No history" accent="yellow">
          Why is this line here? Nobody knows. Nobody dares delete it.
        </Card>
        <Card title="No teamwork" accent="blue">
          Two people cannot edit the same project at the same time without pain.
        </Card>
      </Columns>
    </Slide>
  )),
  s("why-solves", "Why VCS", "What VCS solves", () => (
    <Slide kicker="Why version control" accent="green">
      <Title>What a version control system gives you</Title>
      <Bullets
        accent="green"
        items={[
          <>
            <b>A time machine</b> — every saved state of the project, forever, with who and when.
          </>,
          <>
            <b>A safety net</b> — experiment on a copy, throw it away if it fails, no fear.
          </>,
          <>
            <b>A merge engine</b> — several people editing the same project, combined automatically.
          </>,
          <>
            <b>A conversation</b> — commit messages and reviews explain the <i>why</i> behind the code.
          </>,
        ]}
      />
    </Slide>
  )),
  s("why-centralized", "Why VCS", "Centralized vs distributed", () => (
    <Slide kicker="Why version control" accent="blue">
      <Title>Two families of VCS</Title>
      <Columns>
        <Card title="Centralized (SVN)" accent="red">
          One server holds the history. You check out files from it. Server down or offline? No commits, no history, no work.
        </Card>
        <Card title="Distributed (Git)" accent="green">
          Every clone is a <b>full copy</b> of the entire history. You commit, branch and inspect the past offline. The server is just a meeting point.
        </Card>
      </Columns>
    </Slide>
  )),
  s("why-git-won", "Why VCS", "Why Git won", () => (
    <Slide kicker="Why version control" accent="yellow">
      <Title>Why Git won</Title>
      <Bullets
        accent="yellow"
        items={[
          "Built in 2005 by Linus Torvalds to manage the Linux kernel — thousands of contributors.",
          "Branching is instant and cheap, so branching became a daily habit instead of a scary event.",
          "Fully distributed: fast, offline-capable, no single point of failure.",
          "Free, open source, and the ecosystem (GitHub, GitLab, CI) grew on top of it.",
        ]}
      />
      <p className="slide-body mt-[40px] text-deck-muted">
        Today: if you write code professionally, you use Git. There is no realistic alternative.
      </p>
    </Slide>
  )),

  // ---------- 3. Fundamentals ----------
  s("div-fundamentals", "Fundamentals", "Section: Git fundamentals", () => (
    <SectionDivider number="02" title="Git fundamentals — the mental model" duration="40 min" accent="blue" points={["Three areas", "Object model", "Core commands"]} />
  )),
  s("fund-repo", "Fundamentals", "What is a repository", () => (
    <Slide kicker="Fundamentals" accent="blue">
      <Title>A repository is a folder with a memory</Title>
      <Lead>
        Run <span className="font-mono text-g-green">git init</span> and Git creates a hidden{" "}
        <span className="font-mono text-g-yellow">.git</span> directory. That folder <i>is</i> the repository — delete it and you have plain files again.
      </Lead>
      <Terminal
        lines={[
          "$ mkdir my-project && cd my-project",
          "$ git init",
          "Initialized empty Git repository in ~/my-project/.git/",
          "$ ls -a",
          ".  ..  .git",
        ]}
      />
    </Slide>
  )),
  s("fund-areas", "Fundamentals", "The three areas", () => (
    <Slide kicker="Fundamentals · the core idea" accent="yellow">
      <Title>The three areas</Title>
      <ThreeAreasDiagram />
    </Slide>
  )),
  s("fund-why-staging", "Fundamentals", "Why a staging area", () => (
    <Slide kicker="Fundamentals" accent="yellow">
      <Title>Why bother with staging?</Title>
      <Lead>Because a commit should tell one story, not five.</Lead>
      <Bullets
        accent="yellow"
        items={[
          "You fixed a bug, renamed a variable and started a new feature — all in the same afternoon.",
          "Staging lets you commit the bug fix alone, cleanly, and leave the rest for later.",
          "Think of it as the box you pack before sealing it: you choose what goes in.",
        ]}
      />
    </Slide>
  )),
  s("fund-commit", "Fundamentals", "What a commit is", () => (
    <Slide kicker="Fundamentals" accent="green">
      <Title>A commit is a snapshot, not a diff</Title>
      <Columns>
        <Card title="Contains" accent="green">
          A full snapshot of the project, the author, the date, a message, and a link to its parent commit.
        </Card>
        <Card title="Identified by" accent="blue">
          A 40-character SHA-1 hash like <span className="font-mono">a1b2c3d…</span>. Change anything and the hash changes — history is tamper-evident.
        </Card>
        <Card title="Immutable" accent="yellow">
          You never edit a commit. You add a new one on top. That&apos;s why nothing is ever really lost.
        </Card>
      </Columns>
    </Slide>
  )),
  s("fund-objects", "Fundamentals", "Object model", () => (
    <Slide kicker="Fundamentals · under the hood" accent="blue">
      <Title>Blobs, trees, commits</Title>
      <ObjectModelDiagram />
    </Slide>
  )),
  s("fund-graph", "Fundamentals", "History as a graph", () => (
    <Slide kicker="Fundamentals" accent="blue">
      <Title>History is a chain of commits</Title>
      <CommitGraphDiagram />
    </Slide>
  )),
  s("fund-config", "Fundamentals", "First-time setup", () => (
    <Slide kicker="Fundamentals · commands" accent="green">
      <Title>Step 0: tell Git who you are</Title>
      <Terminal
        lines={[
          '$ git config --global user.name "Amine Jmal"',
          '$ git config --global user.email "amine@example.com"',
          "$ git config --global init.defaultBranch main",
          "# check what Git thinks:",
          "$ git config --list",
        ]}
      />
      <p className="slide-body mt-[36px] text-deck-muted">
        This name and email are stamped on every commit you ever make. Use the same email as your GitHub account.
      </p>
    </Slide>
  )),
  s("fund-cycle", "Fundamentals", "The daily cycle", () => (
    <Slide kicker="Fundamentals · commands" accent="green">
      <Title>The cycle you&apos;ll repeat forever</Title>
      <div className="flex gap-[48px]">
        <div className="flex-1">
          <Terminal
            lines={[
              "$ git status",
              "$ git add index.html",
              "$ git add .",
              '$ git commit -m "Add landing page markup"',
              "$ git log --oneline",
            ]}
          />
        </div>
        <div className="w-[600px]">
          <Bullets
            accent="green"
            items={[
              "status — where am I, what changed?",
              "add — choose what goes in the box",
              "commit — seal the box with a label",
              "log — read the story so far",
            ]}
          />
        </div>
      </div>
    </Slide>
  )),
  s("fund-status", "Fundamentals", "Reading status", () => (
    <Slide kicker="Fundamentals · commands" accent="yellow">
      <Title>git status is your best friend</Title>
      <Terminal
        lines={[
          "$ git status",
          "On branch main",
          "Changes to be committed:",
          "        new file:   index.html",
          "Changes not staged for commit:",
          "        modified:   style.css",
          "Untracked files:",
          "        notes.txt",
        ]}
      />
      <p className="slide-body mt-[36px] text-deck-muted">
        Three groups = the three areas. Staged, modified-but-not-staged, and never-seen-before.
      </p>
    </Slide>
  )),
  s("fund-logdiff", "Fundamentals", "log and diff", () => (
    <Slide kicker="Fundamentals · commands" accent="blue">
      <Title>Looking at the past</Title>
      <Terminal
        lines={[
          "$ git log --oneline --graph --decorate",
          "* 9f8e7d (HEAD -> main) Fix nav spacing on mobile",
          "* d4e5f6 Add landing page markup",
          "$ git diff",
          "$ git diff --staged",
          "$ git show 9f8e7d",
        ]}
      />
      <p className="slide-body mt-[36px] text-deck-muted">
        <span className="font-mono text-g-yellow">diff</span> = working dir vs staging.{" "}
        <span className="font-mono text-g-yellow">diff --staged</span> = staging vs last commit.
      </p>
    </Slide>
  )),
  s("fund-messages", "Fundamentals", "Commit messages", () => (
    <Slide kicker="Fundamentals" accent="red">
      <Title>Write commit messages for future-you</Title>
      <Columns>
        <Card title="Bad" accent="red">
          <div className="font-mono">
            update
            <br />
            fix
            <br />
            asdf
            <br />
            final changes
          </div>
        </Card>
        <Card title="Good" accent="green">
          <div className="font-mono">
            Add login form validation
            <br />
            Fix crash when cart is empty
            <br />
            Rename User.mail to User.email
          </div>
        </Card>
      </Columns>
      <p className="slide-body mt-[36px] text-deck-muted">
        Rule of thumb: finish the sentence &quot;If applied, this commit will…&quot;
      </p>
    </Slide>
  )),
  s("fund-undo", "Fundamentals", "Undoing things", () => (
    <Slide kicker="Fundamentals" accent="yellow">
      <Title>Undo, without panic</Title>
      <Terminal
        lines={[
          "# unstage a file, keep your edits",
          "$ git restore --staged notes.txt",
          "# throw away edits in the working directory",
          "$ git restore notes.txt",
          "# change the last commit message",
          '$ git commit --amend -m "Better message"',
        ]}
      />
    </Slide>
  )),

  // ---------- 5. Branching ----------
  s("div-branch", "Branching", "Section: Branching & merging", () => (
    <SectionDivider number="03" title="Branching & merging" duration="30 min" accent="green" points={["Why branch", "Merge vs rebase", "Conflicts"]} />
  )),
  s("branch-why", "Branching", "Why branch", () => (
    <Slide kicker="Branching" accent="green">
      <Title>Why branch at all?</Title>
      <Bullets
        accent="green"
        items={[
          "main should always work. Your half-finished feature should not live there.",
          "A branch is a parallel line of commits — experiment freely, delete it if it fails.",
          "Five teammates, five branches, zero stepping on each other.",
          "In Git a branch costs nothing: it's a 41-byte file pointing at one commit.",
        ]}
      />
    </Slide>
  )),
  s("branch-diagram", "Branching", "Branch & merge visual", () => (
    <Slide kicker="Branching" accent="green">
      <Title>Branch, work, merge back</Title>
      <BranchMergeDiagram />
    </Slide>
  )),
  s("branch-commands", "Branching", "Branch commands", () => (
    <Slide kicker="Branching · commands" accent="blue">
      <Title>Moving between branches</Title>
      <Terminal
        lines={[
          "$ git branch",
          "$ git switch -c feature/login",
          "$ git switch main",
          "$ git merge feature/login",
          "$ git branch -d feature/login",
          "# older syntax you'll still see everywhere:",
          "$ git checkout -b feature/login",
        ]}
      />
    </Slide>
  )),
  s("branch-mergerebase", "Branching", "Merge vs rebase", () => (
    <Slide kicker="Branching" accent="yellow">
      <Title>Merge vs rebase — conceptually</Title>
      <MergeVsRebaseDiagram />
    </Slide>
  )),
  s("branch-conflict-what", "Branching", "What is a conflict", () => (
    <Slide kicker="Branching" accent="red">
      <Title>A conflict is not an error</Title>
      <ConflictDiagram />
      <p className="slide-body mt-[30px] text-deck-muted">
        Git merges automatically whenever it can. It only stops when two branches changed the <b>same lines</b> — then it needs a human decision.
      </p>
    </Slide>
  )),
  s("branch-conflict-markers", "Branching", "Conflict markers", () => (
    <Slide kicker="Branching" accent="red">
      <Title>What a conflict looks like</Title>
      <Terminal
        title="index.html"
        lines={[
          "<<<<<<< HEAD",
          "<h1>Welcome to GDSC Sfax</h1>",
          "=======",
          "<h1>Bienvenue au GDSC Sfax</h1>",
          ">>>>>>> feature/fr-translation",
        ]}
      />
      <p className="slide-body mt-[36px] text-deck-muted">
        Top = your branch. Bottom = the branch you&apos;re merging in. Delete the markers, keep the text you want.
      </p>
    </Slide>
  )),
  s("branch-conflict-fix", "Branching", "Resolving a conflict", () => (
    <Slide kicker="Branching · commands" accent="green">
      <Title>Resolving it, step by step</Title>
      <div className="flex gap-[48px]">
        <div className="w-[700px]">
          <Checklist
            items={[
              "Run git status — it lists the conflicted files",
              "Open each file, find the <<<<<<< markers",
              "Edit until the file reads exactly how you want it",
              "git add the file to mark it resolved",
              "git commit to finish the merge",
            ]}
          />
        </div>
        <div className="flex-1">
          <Terminal lines={["$ git status", "$ git add index.html", "$ git commit", "# escape hatch:", "$ git merge --abort"]} />
        </div>
      </div>
    </Slide>
  )),

  // ---------- 6. GitHub ----------
  s("div-github", "GitHub", "Section: GitHub & remotes", () => (
    <SectionDivider number="04" title="GitHub & the remote workflow" duration="30 min" accent="blue" points={["Local vs remote", "clone/push/pull", "Issues & PRs"]} />
  )),
  s("gh-difference", "GitHub", "Git vs GitHub", () => (
    <Slide kicker="GitHub" accent="blue">
      <Title>Git is not GitHub</Title>
      <Columns>
        <Card title="Git" accent="green">
          A program on your machine. Tracks history. Works with zero internet. Created 2005.
        </Card>
        <Card title="GitHub" accent="blue">
          A website that hosts Git repositories and adds collaboration on top: issues, pull requests, reviews, CI, permissions.
        </Card>
      </Columns>
      <p className="slide-body mt-[40px] text-deck-muted">
        You can use Git without GitHub. Alternatives: GitLab, Bitbucket, or your own server.
      </p>
    </Slide>
  )),
  s("gh-localremote", "GitHub", "Local vs remote", () => (
    <Slide kicker="GitHub" accent="blue">
      <Title>Local and remote</Title>
      <LocalRemoteDiagram />
    </Slide>
  )),
  s("gh-commands", "GitHub", "Remote commands", () => (
    <Slide kicker="GitHub · commands" accent="green">
      <Title>The four remote commands</Title>
      <div className="flex gap-[48px]">
        <div className="flex-1">
          <Terminal
            lines={[
              "$ git clone https://github.com/you/repo.git",
              "$ git remote -v",
              "$ git push -u origin main",
              "$ git fetch origin",
              "$ git pull",
            ]}
          />
        </div>
        <div className="w-[640px]">
          <Bullets
            accent="green"
            items={[
              "clone — copy a remote repo to your machine, once",
              "push — send your commits up",
              "fetch — download theirs, change nothing locally",
              "pull — fetch + merge into your branch",
            ]}
          />
        </div>
      </div>
    </Slide>
  )),
  s("gh-adds", "GitHub", "What GitHub adds", () => (
    <Slide kicker="GitHub" accent="yellow">
      <Title>What GitHub adds on top of Git</Title>
      <Columns>
        <Card title="Issues" accent="red">
          A to-do list with a conversation: bugs, features, questions. Reference them from commits with <span className="font-mono">#12</span>.
        </Card>
        <Card title="Pull requests" accent="yellow">
          &quot;Please review and merge my branch.&quot; Discussion, line comments, checks — all before merging.
        </Card>
        <Card title="Everything else" accent="blue">
          Actions (CI), Projects, Releases, Pages for free hosting, and a profile recruiters actually read.
        </Card>
      </Columns>
    </Slide>
  )),
  s("gh-readme", "GitHub", "README & .gitignore", () => (
    <Slide kicker="GitHub" accent="green">
      <Title>Two files every repo needs</Title>
      <div className="flex gap-[48px]">
        <div className="flex-1">
          <div className="slide-subtitle mb-[20px] font-semibold text-g-blue">README.md</div>
          <Terminal
            title="README.md"
            lines={[
              "# Project name",
              "What it does, in one sentence.",
              "## Getting started",
              "npm install && npm run dev",
            ]}
          />
        </div>
        <div className="flex-1">
          <div className="slide-subtitle mb-[20px] font-semibold text-g-yellow">.gitignore</div>
          <Terminal
            title=".gitignore"
            lines={["node_modules/", "dist/", ".env", "*.log", ".DS_Store"]}
          />
        </div>
      </div>
      <p className="slide-body mt-[36px] text-deck-muted">
        Never commit secrets, dependencies or build output. Once pushed, a secret is public — rotate it.
      </p>
    </Slide>
  )),

  // ---------- 7. Collaborative workflow ----------
  s("div-collab", "Collaboration", "Section: Collaborative workflow", () => (
    <SectionDivider number="05" title="Collaborative workflow" duration="20 min" accent="yellow" points={["Fork vs branch", "PR lifecycle", "Code review"]} />
  )),
  s("collab-fork", "Collaboration", "Fork vs branch", () => (
    <Slide kicker="Collaboration" accent="yellow">
      <Title>Fork or branch?</Title>
      <ForkVsBranchDiagram />
      <p className="slide-body mt-[30px] text-deck-muted">
        On your team&apos;s repo: branch. On someone else&apos;s open-source project: fork, then PR back.
      </p>
    </Slide>
  )),
  s("collab-pr", "Collaboration", "PR lifecycle", () => (
    <Slide kicker="Collaboration" accent="yellow">
      <Title>The pull request lifecycle</Title>
      <PRLifecycleDiagram />
    </Slide>
  )),
  s("collab-review", "Collaboration", "Code review", () => (
    <Slide kicker="Collaboration" accent="red">
      <Title>Code review, without the drama</Title>
      <Columns>
        <Card title="As the author" accent="blue">
          Keep PRs small. Describe what and why. Say what you&apos;re unsure about. Reply to every comment.
        </Card>
        <Card title="As the reviewer" accent="green">
          Review the code, not the person. Ask questions instead of giving orders. Approve when it&apos;s good enough, not perfect.
        </Card>
      </Columns>
    </Slide>
  )),
  s("collab-team", "Collaboration", "Team workflow", () => (
    <Slide kicker="Collaboration" accent="green">
      <Title>A simple team workflow</Title>
      <TeamWorkflowDiagram />
    </Slide>
  )),
  s("collab-rules", "Collaboration", "Team rules", () => (
    <Slide kicker="Collaboration" accent="blue">
      <Title>Five rules that prevent 90% of pain</Title>
      <Bullets
        accent="blue"
        items={[
          "Never commit directly to main.",
          "One branch = one purpose. Name it feature/…, fix/…, docs/….",
          "Pull before you start working, every single time.",
          "Push often — an unpushed branch only exists on your laptop.",
          "Delete branches after merging; a tidy repo is a readable repo.",
        ]}
      />
    </Slide>
  )),

  // ---------- 8. Lab ----------
  s("div-lab", "Lab", "Section: Hands-on lab", () => (
    <SectionDivider number="06" title="Hands-on lab" duration="45 min · laptops open" accent="green" points={["7 steps", "Work with your partner"]} />
  )),
  s("lab-0", "Lab", "Lab setup", () => (
    <LabSlide
      step="Step 0"
      title="Setup check"
      checklist={[
        "Git installed — check the version",
        "GitHub account created and email verified",
        "Your name and email configured in Git",
        "A terminal open in a folder you can find again",
      ]}
      commands={["$ git --version", "$ git config --global user.name", "$ git config --global user.email"]}
      note="If git --version fails, install from git-scm.com now — grab a mentor if you're stuck."
    />
  )),
  s("lab-1", "Lab", "Create a repo", () => (
    <LabSlide
      step="Step 1"
      title="Create a repository on GitHub"
      checklist={[
        "github.com → New repository",
        "Name it gdsc-git-workshop",
        "Public, add a README, add a Node .gitignore",
        "Create repository, then copy the HTTPS URL",
      ]}
      commands={["# nothing to type yet —", "# this step happens in the browser", "# copy the URL, it looks like:", "https://github.com/you/gdsc-git-workshop.git"]}
    />
  )),
  s("lab-2", "Lab", "Clone", () => (
    <LabSlide
      step="Step 2"
      title="Clone it to your machine"
      checklist={[
        "Clone using the URL you copied",
        "Move into the new folder",
        "Confirm the remote is called origin",
        "Look at the history that already exists",
      ]}
      commands={[
        "$ git clone https://github.com/you/gdsc-git-workshop.git",
        "$ cd gdsc-git-workshop",
        "$ git remote -v",
        "$ git log --oneline",
      ]}
    />
  ))
  ,
  s("lab-3", "Lab", "First commits", () => (
    <LabSlide
      step="Step 3"
      title="Make your first commits"
      checklist={[
        "Create a file about.md with 3 lines about you",
        "Check status before and after staging",
        "Commit with a meaningful message",
        "Edit the README, then commit that separately",
        "Push both commits to GitHub and refresh the page",
      ]}
      commands={[
        '$ echo "# About me" > about.md',
        "$ git status",
        "$ git add about.md",
        '$ git commit -m "Add about page"',
        "$ git push",
      ]}
    />
  )),
  s("lab-4", "Lab", "Branch", () => (
    <LabSlide
      step="Step 4"
      title="Work on a branch"
      checklist={[
        "Create and switch to feature/skills",
        "Add a skills.md file listing 3 technologies",
        "Commit it on the branch",
        "Switch back to main — notice the file disappears",
        "Switch back to the branch — it's there again",
      ]}
      commands={[
        "$ git switch -c feature/skills",
        '$ echo "- HTML" > skills.md',
        "$ git add skills.md",
        '$ git commit -m "Add skills list"',
        "$ git switch main",
        "$ ls",
      ]}
    />
  )),
  s("lab-5", "Lab", "Push branch and PR", () => (
    <LabSlide
      step="Step 5"
      title="Push the branch and open a PR"
      checklist={[
        "Push the branch and set its upstream",
        "Open the GitHub link printed in the terminal",
        "Write a PR title and a 2-line description",
        "Request your partner as a reviewer",
      ]}
      commands={[
        "$ git switch feature/skills",
        "$ git push -u origin feature/skills",
        "# GitHub prints a link — open it",
      ]}
    />
  )),
  s("lab-6", "Lab", "Review a partner's PR", () => (
    <LabSlide
      step="Step 6"
      title="Review your partner's pull request"
      checklist={[
        "Open their PR → Files changed",
        "Leave one line comment: a question, not a command",
        "Submit review: Comment or Approve",
        "Author: reply, push a fix if needed, then merge",
        "Both: delete the branch after merging",
      ]}
      commands={[
        "# after their PR is merged, update your main:",
        "$ git switch main",
        "$ git pull",
        "$ git log --oneline --graph",
      ]}
    />
  )),
  s("lab-7", "Lab", "Conflict", () => (
    <LabSlide
      step="Step 7"
      title="Create and resolve a conflict on purpose"
      checklist={[
        "On main: change line 1 of README.md, commit",
        "On branch conflict-demo (from the older main): change the same line, commit",
        "Switch to main and merge the branch",
        "Read the conflict markers, choose the final text",
        "git add, git commit, then push",
      ]}
      commands={[
        "$ git switch -c conflict-demo",
        "# edit README.md line 1, then:",
        "$ git commit -am 'Change title on branch'",
        "$ git switch main",
        "$ git merge conflict-demo",
        "$ git status",
      ]}
      note="Stuck and out of time? git merge --abort puts everything back."
    />
  )),

  // ---------- 9. Wrap-up ----------
  s("div-wrap", "Wrap-up", "Section: Wrap-up", () => (
    <SectionDivider number="07" title="Wrap-up" duration="10 min" accent="red" points={["Cheat sheet", "Gotchas", "Q&A"]} />
  )),
  s("wrap-cheatsheet", "Wrap-up", "Cheat sheet", () => (
    <Slide kicker="Wrap-up" accent="blue">
      <Title>Cheat sheet — everything we used</Title>
      <div className="flex gap-[36px] font-mono text-[28px] leading-[1.9]">
        <div className="flex-1">
          <div className="slide-kicker mb-[16px] font-sans text-g-green">Start</div>
          <div>git init</div>
          <div>git clone &lt;url&gt;</div>
          <div>git config --global user.name</div>
          <div className="slide-kicker mb-[16px] mt-[30px] font-sans text-g-yellow">Daily</div>
          <div>git status</div>
          <div>git add .</div>
          <div>git commit -m &quot;…&quot;</div>
          <div>git log --oneline --graph</div>
          <div>git diff</div>
        </div>
        <div className="flex-1">
          <div className="slide-kicker mb-[16px] font-sans text-g-blue">Branching</div>
          <div>git branch</div>
          <div>git switch -c &lt;name&gt;</div>
          <div>git switch main</div>
          <div>git merge &lt;name&gt;</div>
          <div>git branch -d &lt;name&gt;</div>
          <div>git merge --abort</div>
        </div>
        <div className="flex-1">
          <div className="slide-kicker mb-[16px] font-sans text-g-red">Remote &amp; undo</div>
          <div>git remote -v</div>
          <div>git push -u origin &lt;branch&gt;</div>
          <div>git pull</div>
          <div>git fetch</div>
          <div>git restore --staged &lt;file&gt;</div>
          <div>git commit --amend</div>
        </div>
      </div>
    </Slide>
  )),
  s("wrap-gotchas", "Wrap-up", "Gotchas", () => (
    <Slide kicker="Wrap-up" accent="red">
      <Title>Classic beginner traps</Title>
      <Bullets
        accent="red"
        items={[
          <>
            <b>Committing node_modules or .env</b> — write .gitignore before your first commit.
          </>,
          <>
            <b>&quot;git add .&quot; without looking</b> — run git status first, always.
          </>,
          <>
            <b>Working on main for a week</b> — branch on day one instead.
          </>,
          <>
            <b>Giant commits</b> — 40 files, message &quot;update&quot;. Nobody can review that.
          </>,
          <>
            <b>Panicking at a conflict</b> — it&apos;s Git asking a question, not breaking.
          </>,
        ]}
      />
    </Slide>
  )),
  s("wrap-resources", "Wrap-up", "Resources", () => (
    <Slide kicker="Wrap-up" accent="green">
      <Title>Go deeper this week</Title>
      <Columns>
        <Card title="Read" accent="blue">
          Pro Git (free, git-scm.com/book) — chapters 1 to 3 cover everything today, in depth.
        </Card>
        <Card title="Play" accent="yellow">
          learngitbranching.js.org — visual branching puzzles. Do it, it takes 40 minutes.
        </Card>
        <Card title="Build" accent="green">
          Put one of your class projects on GitHub this week, with a real README.
        </Card>
      </Columns>
    </Slide>
  )),
  s("qa", "Wrap-up", "Q&A", () => (
    <div className="slide-content flex flex-col items-center justify-center">
      <div className="absolute bottom-0 left-0 flex h-[14px] w-full">
        <div className="flex-1" style={{ background: "var(--g-blue)" }} />
        <div className="flex-1" style={{ background: "var(--g-red)" }} />
        <div className="flex-1" style={{ background: "var(--g-yellow)" }} />
        <div className="flex-1" style={{ background: "var(--g-green)" }} />
      </div>
      <h2 className="slide-title-lg font-bold">Questions?</h2>
      <p className="slide-subtitle mt-[36px] text-deck-muted">Ask anything — nothing is too basic</p>
      <p className="slide-body mt-[40px] text-deck-muted">GDSC Sfax · Software Engineering Curriculum · Session 1</p>
    </div>
  )),
];
