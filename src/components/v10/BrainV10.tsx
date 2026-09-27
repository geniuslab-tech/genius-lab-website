import { Chapter, Exhibit } from "./ui";

const CONTEXTS = [
  {
    name: "Semantic Context",
    q: "What does this number mean?",
    body: "What every number means. Shared definitions for metrics, tables and dashboards, so revenue means the same thing in every report.",
  },
  {
    name: "Business Context",
    q: "How does the company work?",
    body: "How the company actually works. Customers, operations and finance, and the relationships that connect them.",
  },
  {
    name: "Event Context",
    q: "What is happening now?",
    body: "What is happening right now. Transactions, process steps and system events, captured as they occur.",
  },
];

const HOLDS = ["Systems", "Data tables", "Metrics", "Dashboards", "Processes", "Customers", "Operations", "Financial information"];

export function BrainV10() {
  return (
    <Chapter
      id="brain"
      n="03"
      label="The Second Brain"
      title="A Second Brain for your business."
      lead="The intelligence layer holds the full context of the company: its systems, tables, metrics, dashboards, processes, customers, operations and finances. AI Agents work on top of it, end to end."
      note={<>The Second Brain is the AI layer of the framework in Exhibit 3, built on the three layers beneath it.</>}
    >
      <div className="mt-14 grid gap-12 sm:mt-16 lg:grid-cols-10 lg:gap-6">
        <Exhibit
          n={4}
          className="lg:col-span-7"
          title="Three kinds of context the Second Brain holds"
          source="Genius Lab. Descriptive."
        >
          <table className="ledger text-[0.9375rem] leading-[1.6]">
            <caption className="sr-only">The three kinds of context in the Second Brain</caption>
            <thead>
              <tr className="caps text-[color:var(--slate)]">
                <th scope="col" className="w-[30%] font-medium">Context</th>
                <th scope="col" className="w-[26%] font-medium">The question it answers</th>
                <th scope="col" className="font-medium">What it captures</th>
              </tr>
            </thead>
            <tbody>
              {CONTEXTS.map((c, i) => (
                <tr key={c.name} className="row-in" style={{ ["--i" as string]: i }}>
                  <th scope="row" className="serif text-[1.25rem] font-normal leading-[1.25] text-[color:var(--ink)]">
                    <span className="tnum mr-2 text-[0.875rem] text-[color:var(--brass)]">0{i + 1}</span>
                    {c.name}
                  </th>
                  <td data-label="The question it answers" className="serif italic text-[color:var(--ink-2)]">{c.q}</td>
                  <td data-label="What it captures" className="text-[color:var(--slate)]">{c.body}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Exhibit>

        <div className="lg:col-span-3">
          <div data-reveal="up" className="border-t-[3px] border-[color:var(--ink)] bg-[color:var(--card)] p-6">
            <p className="caps text-[color:var(--slate)]">What AI Agents can see</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 lg:grid-cols-1">
              {HOLDS.map((h) => (
                <li key={h} className="border-b border-[color:var(--rule-2)] py-2 text-[0.9375rem] text-[color:var(--ink)]">
                  {h}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.875rem] leading-[1.6] text-[color:var(--slate)]">
              One connected context, end to end, rather than a view from inside a single tool.
            </p>
          </div>
        </div>
      </div>
    </Chapter>
  );
}
