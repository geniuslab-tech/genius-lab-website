import { Head, Section, delay } from "./ui";

const AXES = [
  { name: "Data", role: "The facts", body: "Every system connected and reconciled into one set of trusted records." },
  { name: "Analytics", role: "The meaning", body: "Metrics and rules defined once, on the business objects themselves." },
  { name: "AI", role: "The reasoning", body: "Agents that read the model, answer questions and act on what they find." },
  { name: "People", role: "The judgement", body: "Owners, roles and decisions: who is accountable, who approves, who acts." },
  { name: "Business Context", role: "The why", body: "Strategy, processes and rules of the business that give every number its purpose." },
];

const OBJECTS = ["Customers", "Orders", "Products", "Suppliers"];

/** Five columns standing on one shared model. Each column is wired into the bar beneath it. */
export function Ontology14() {
  return (
    <Section id="ontology" n="05" label="Our approach" titleId="v14-ontology-title">
      <Head
        id="v14-ontology-title"
        title="Data Ontology Intelligence."
        lead="We are not only a data, analytics or AI company. We work where data, analytics, AI, people and business context meet."
      />

      <ol className="grid grid-cols-1 gap-[2px] bg-black sm:grid-cols-2 lg:grid-cols-5" aria-label="The five axes">
        {AXES.map((a, i) => (
          <li
            key={a.name}
            data-r="up"
            style={delay(i * 80)}
            className="v14-inv-u flex min-h-[15rem] flex-col bg-white px-4 py-5 sm:px-5 sm:last:col-span-2 lg:last:col-span-1"
          >
            <span className="flex items-center justify-between gap-3">
              <span className="v14-mono v14-soft text-[#555]">{a.role}</span>
              <span className="v14-mono">0{i + 1}</span>
            </span>
            <span className="v14-head mt-6 text-[clamp(1.75rem,2.6vw,2.5rem)]">{a.name}</span>
            <span className="mt-3 text-[0.9375rem] leading-[1.55]">{a.body}</span>
            <span className="mt-auto flex justify-center pt-6" aria-hidden="true">
              <span className="block h-10 w-[2px] bg-current" />
            </span>
          </li>
        ))}
      </ol>

      <div className="grid border-t-2 border-black bg-black text-white lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="px-4 py-6 sm:px-6">
          <p className="v14-mono text-[#bdbdbd]">The shared model</p>
          <p className="v14-head mt-3 text-[clamp(2rem,4vw,4rem)]">One ontology under every axis.</p>
        </div>
        <ul className="grid grid-cols-2 gap-[2px] border-white bg-white max-lg:border-t-2 lg:border-l-2" aria-label="Business objects in the model">
          {OBJECTS.map((o) => (
            <li key={o} className="v14-mono flex items-center gap-2 bg-black px-4 py-4">
              <span className="inline-block h-2.5 w-2.5 bg-[#1f3bff] outline outline-2 outline-white" aria-hidden="true" />
              {o}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t-2 border-black px-4 py-6 sm:px-6">
        <p data-r="" className="text-pretty max-w-[68ch] text-[1.0625rem] leading-[1.6]">
          An ontology is a living model of your business: its objects, such as customers, orders, products and suppliers,
          the relationships between them, and the rules that give them meaning. Every axis works on that same model, so
          they move in harmony instead of in hand-offs.
        </p>
      </div>
    </Section>
  );
}
