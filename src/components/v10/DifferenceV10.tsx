import { Chapter, Exhibit } from "./ui";

const ROWS = [
  { k: "Visibility", without: "Numbers assembled by hand, late and contested.", with: "One governed source, current and shared by every leader." },
  { k: "Definitions", without: "Revenue means something different in every report.", with: "Metrics defined once and used everywhere." },
  { k: "Systems", without: "Replaced at great cost, or worked around.", with: "Connected and extended. The software you rely on stays." },
  { k: "People", without: "Analysts reconcile. People are the glue.", with: "Analysts analyse. The systems carry the load." },
  { k: "Questions", without: "Answered in days, by whoever knows where to look.", with: "Answered by agents that show what they read." },
  { k: "Execution", without: "Hand-offs between teams and tools.", with: "Orchestrated across systems." },
  { k: "Ownership", without: "A data team to hire and tooling to maintain.", with: "Fully managed by Genius Lab." },
];

export function DifferenceV10() {
  return (
    <Chapter
      id="difference"
      n="07"
      label="The difference"
      title="The difference, in operating terms."
      lead="What changes for the leadership team once the four layers are in place and running."
      note={<>A qualitative view of typical conditions. It is not a measured client outcome.</>}
    >
      <Exhibit
        n={8}
        className="mt-14 sm:mt-16"
        title="Without and with Genius Lab"
        source="Genius Lab. Qualitative and illustrative; describes typical conditions, not measured client results."
      >
        <table className="ledger text-[0.9375rem] leading-[1.6]">
          <caption className="sr-only">Operating conditions without and with Genius Lab</caption>
          <thead>
            <tr className="caps text-[color:var(--slate)]">
              <th scope="col" className="w-[18%] font-medium">Area</th>
              <th scope="col" className="w-[41%] font-medium">Without Genius Lab</th>
              <th scope="col" className="col-with w-[41%] font-medium text-[color:var(--ink)]">With Genius Lab</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={r.k} className="row-in" style={{ ["--i" as string]: i }}>
                <th scope="row" className="serif text-[1.1875rem] font-normal text-[color:var(--ink)]">{r.k}</th>
                <td data-label="Without Genius Lab" className="text-[color:var(--slate)]">{r.without}</td>
                <td data-label="With Genius Lab" className="col-with font-medium text-[color:var(--ink)]">{r.with}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Exhibit>
    </Chapter>
  );
}
