
import { useEffect, useState, type ReactNode } from "react";

import SyntaxHighlighter from "@/components/SyntaxHighlighter";

const PrimitiveTypesTable = () => {
  const types = [
    { type: "i32", description: "32-bit signed integer", note: "Default for small whole numbers" },
    { type: "i64", description: "64-bit signed integer", note: "Used when the value is large" },
    { type: "u32", description: "32-bit unsigned integer", note: "Only stores zero or positive numbers" },
    { type: "u64", description: "64-bit unsigned integer", note: "Great for big counters or IDs" },
    { type: "f64", description: "64-bit floating point", note: "Only floating type that exists right now" },
    { type: "bool", description: "Boolean", note: "Holds true or false" },
    { type: "string", description: "UTF-8 text", note: "Backed by a rope so joins are fast" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-charcoal-200 border border-charcoal-800">
        <caption className="sr-only">Complete list of Orus primitive types</caption>
        <thead className="bg-charcoal-900/80">
          <tr>
            <th className="px-4 py-3 border-b border-charcoal-800 font-semibold">Type</th>
            <th className="px-4 py-3 border-b border-charcoal-800 font-semibold">What it is</th>
            <th className="px-4 py-3 border-b border-charcoal-800 font-semibold">Helpful tip</th>
          </tr>
        </thead>
        <tbody>
          {types.map((item) => (
            <tr key={item.type} className="odd:bg-charcoal-900/40">
              <td className="px-4 py-3 border-b border-charcoal-800 font-mono text-gold-300">{item.type}</td>
              <td className="px-4 py-3 border-b border-charcoal-800">{item.description}</td>
              <td className="px-4 py-3 border-b border-charcoal-800 text-charcoal-400">{item.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


type OutlineSection = {
  id: string;
  label: string;
  subsections?: { id: string; label: string }[];
};

const tutorialOutline: OutlineSection[] = [
  { id: "getting-started", label: "1. Getting Started" },
  { id: "variables", label: "2. Variables & Mutability" },
  { id: "constants", label: "3. Constants" },
  { id: "primitives", label: "4. Primitive Types" },
  { id: "numeric-literals", label: "5. Numeric Literals" },
  { id: "casting", label: "6. Casting Rules" },
  { id: "comments", label: "7. Comments" },
  {
    id: "operators",
    label: "8. Operators",
    subsections: [
      { id: "operators-arithmetic", label: "8.1 Arithmetic" },
      { id: "operators-comparisons", label: "8.2 Comparisons" },
      { id: "operators-boolean", label: "8.3 Boolean Logic" },
      { id: "operators-matches", label: "8.4 matches Keyword" },
    ],
  },
  {
    id: "control-flow",
    label: "9. Control Flow",
    subsections: [
      { id: "conditionals", label: "9.1 Conditionals" },
      { id: "loops", label: "9.2 Loops" },
    ],
  },
  {
    id: "arrays",
    label: "10. Arrays",
    subsections: [
      { id: "arrays-fixed", label: "10.1 Fixed-Length Arrays" },
      { id: "arrays-dynamic", label: "10.2 Dynamic Arrays" },
      { id: "arrays-inference", label: "10.3 Length Inference" },
      { id: "arrays-fill", label: "10.4 Fill Expressions" },
      { id: "arrays-slicing", label: "10.5 Slicing" },
    ],
  },
  { id: "functions", label: "11. Functions" },
  { id: "structs", label: "12. Structs" },
  { id: "methods", label: "13. Methods with impl" },
  {
    id: "pattern-matching",
    label: "14. Pattern Matching",
    subsections: [
      { id: "match-statements", label: "14.1 match Statements" },
      { id: "match-expressions", label: "14.2 match Expressions" },
      { id: "matches-keyword", label: "14.3 matches Keyword" },
    ],
  },
  { id: "error-handling", label: "15. Error Handling" },
  {
    id: "modules",
    label: "16. Modules",
    subsections: [
      { id: "modules-use", label: "16.1 Imports with use" },
      { id: "modules-public", label: "16.2 Public Functions and Structs" },
    ],
  },
  { id: "builtins", label: "17. Built-in Utilities" },
  { id: "best-practices", label: "18. Best Practices" },
  { id: "putting-it-together", label: "19. Putting It Together" },
];

const TableOfContents = () => {
  const [activeId, setActiveId] = useState<string>(tutorialOutline[0]?.id ?? "");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const ids = tutorialOutline.flatMap((section) => [section.id, ...(section.subsections?.map((sub) => sub.id) ?? [])]);
    const elements = ids
      .map((sectionId) => document.getElementById(sectionId))
      .filter((element): element is HTMLElement => Boolean(element));

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting && entry.intersectionRatio > 0);
        if (visible.length === 0) {
          return;
        }

        const topMost = visible.sort((a, b) => a.target.getBoundingClientRect().top - b.target.getBoundingClientRect().top)[0];
        setActiveId(topMost.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
      observer.disconnect();
    };
  }, []);

  return (
    <nav aria-label="Tutorial contents" className="hidden lg:block">
      <div className="sticky top-28 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-gold-400 mb-3">On this page</p>
        <ul className="space-y-3 text-sm">
          {tutorialOutline.map((section) => {
            const subsectionActive = section.subsections?.some((sub) => sub.id === activeId) ?? false;
            const isActive = activeId === section.id || subsectionActive;

            return (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  onClick={() => setActiveId(section.id)}
                  className={`block rounded px-3 py-2 font-medium transition focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-charcoal-950 ${
                    isActive ? "bg-gold-500/10 text-gold-300" : "text-charcoal-200 hover:text-gold-200"
                  }`}
                  aria-current={isActive ? "location" : undefined}
                >
                  {section.label}
                </a>
                {section.subsections && section.subsections.length > 0 && (
                  <ul
                    className={`${
                      isActive ? "mt-2 space-y-1 border-l border-charcoal-800 pl-4 text-charcoal-300" : "hidden"
                    }`}
                    aria-hidden={!isActive}
                  >
                    {section.subsections.map((subsection) => (
                      <li key={subsection.id}>
                        <a
                          href={`#${subsection.id}`}
                          onClick={() => setActiveId(subsection.id)}
                          className={`block rounded px-3 py-1.5 text-xs transition focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-charcoal-950 ${
                            activeId === subsection.id ? "bg-gold-500/10 text-gold-200" : "text-charcoal-300 hover:text-gold-200"
                          }`}
                          aria-current={activeId === subsection.id ? "location" : undefined}
                        >
                          {subsection.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

const Section = ({ id, number, title, children }: { id: string; number: string; title: string; children: ReactNode }) => (
  <section id={id} className="mb-16 scroll-mt-28">
    <h2 className="text-3xl font-semibold text-white mb-4">
      <span className="text-gold-400 mr-2">{number}</span>
      {title}
    </h2>
    <div className="space-y-4 text-charcoal-200 leading-relaxed">{children}</div>
  </section>
);

const SubSection = ({ id, title, children }: { id: string; title: string; children: ReactNode }) => (
  <div id={id} className="mt-10 scroll-mt-28">
    <h3 className="text-2xl font-semibold text-white mb-3">{title}</h3>
    <div className="space-y-4 text-charcoal-200 leading-relaxed">{children}</div>
  </div>
);

const Tutorial = () => {
  return (
    <div className="bg-gradient-to-br from-charcoal-950 via-charcoal-900 to-charcoal-950 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-12 text-center">
          <p className="text-sm uppercase tracking-widest text-gold-400 mb-3">Complete Orus Tutorial</p>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Friendly Walkthrough</h1>
          <p className="text-lg text-charcoal-300 max-w-3xl mx-auto">
            This page retells the entire tutorial from the Orus project in clear, gentle language. Every topic keeps the same
            order and examples from the reference guide, so you can follow along step by step without any surprises.
          </p>
        </header>

        <div className="lg:grid lg:grid-cols-[18rem,1fr] lg:gap-10">
          <TableOfContents />

          <div>
            <nav className="grid sm:grid-cols-2 gap-3 mb-12 lg:hidden">
              {tutorialOutline.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="rounded border border-charcoal-700 bg-charcoal-900/60 px-4 py-3 text-sm font-medium text-charcoal-200 transition hover:border-gold-500/60 hover:text-gold-300"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="space-y-20">
            <Section id="getting-started" number="1." title="Getting Started">
              <p>
                Orus runs from the command line. After you clone the repository you can build a release build and then start the
                REPL or run a source file.
              </p>
              <SyntaxHighlighter
                code={`orus               # start the interactive shell\norus main.orus     # run a file`}
                language="bash"
              />
              <p>
                Orus files care about indentation. Statements do not end with semicolons. A block starts after a colon and the
                next lines must be indented with spaces. Tabs count as four spaces. Mixing tabs and spaces causes an
                "Inconsistent indentation" error, so stick with spaces while you follow the examples.
              </p>
            </Section>

            <Section id="variables" number="2." title="Variables and Mutability">
              <p>
                Bindings are immutable by default. Use <code className="text-gold-300">mut</code> when you plan to change a value.
                You can add an optional type annotation, and you may declare more than one name on a single line.
              </p>
              <SyntaxHighlighter
                code={`score = 10               // immutable binding\nmut retries = 0          // mutable binding (can be reassigned)\nthreshold: f64 = 0.75    // optional type annotation\nx = 1, mut y = 2         // multiple declarations on one line\n\nmut retries += 1         // compound assignment requires \`mut\``}
              />
              <p>
                Names must start with a letter or an underscore. They may include letters, numbers, or underscores. When a type
                annotation appears it follows the name, such as <code className="text-gold-300">value: i64</code>. Without an
                annotation the Hindley–Milner type checker figures out the type from the first value you assign.
              </p>
            </Section>

            <Section id="constants" number="3." title="Constants">
              <p>
                The <code className="text-gold-300">const</code> keyword exists but has no behaviour yet. To model constants today,
                create module-scope globals without <code className="text-gold-300">mut</code>. These names must stay uppercase and
                always include a starting value.
              </p>
              <SyntaxHighlighter
                code={`pub global MAX_CONNECTIONS = 512\npub global mut CACHE_BYTES = 1_048_576   // writable global`}
              />
              <p>
                Treat uppercase globals as constants. They live in the global register bank, so reads are fast, and the compiler
                warns you if you try to modify a non-<code className="text-gold-300">mut</code> global.
              </p>
            </Section>

            <Section id="primitives" number="4." title="Primitive Types">
              <p>
                Orus keeps the core type list small and predictable. The primitive types are
                <code className="text-gold-300">i32</code>, <code className="text-gold-300">i64</code>,
                <code className="text-gold-300">u32</code>, <code className="text-gold-300">u64</code>,
                <code className="text-gold-300">f64</code>, <code className="text-gold-300">bool</code>, and
                <code className="text-gold-300">string</code>. The table below summarises what each one does.
              </p>
              <PrimitiveTypesTable />
              <p>
                Add a type annotation when you want to show intent clearly.
              </p>
              <SyntaxHighlighter
                code={`count: i32 = 42\nbig: i64 = 5_000_000_000\nmask: u32 = 0xFF\nratio: f64 = 6.022e23\nflag: bool = true\nname: string = "Orus"`}
              />
              <SubSection id="strings" title="Strings in Practice">
                <p>
                  Strings store UTF-8 bytes. This design keeps joins fast and indexing predictable.
                </p>
                <SyntaxHighlighter
                  code={`banner = "Line one\\nLine two\\tTabbed"\npath = "C:\\tmp\\reports"\nemoji = "😀"               // occupies multiple bytes internally`}
                />
                <p>
                  <code className="text-gold-300">len(string)</code> returns the number of bytes. Indexing with
                  <code className="text-gold-300"> string[index]</code> gives you a one-byte string. Multi-byte characters need more
                  work if you care about grapheme clusters.
                </p>
              </SubSection>
            </Section>

            <Section id="numeric-literals" number="5." title="Numeric Literals">
              <p>
                Integer literals are decimal unless you prefix them with <code className="text-gold-300">0x</code>. Use underscores
                to improve readability. Floating literals are always <code className="text-gold-300">f64</code> and can use
                scientific notation.
              </p>
              <SyntaxHighlighter
                code={`decimal = 1_000_000       // underscores ignored by the parser\nhex = 0xDEADBEEF\nbig = 9_223_372_036_854_775_807  // promoted to i64 automatically\nratio = 3.14159           // f64 literal\navogadro = 6.022e23       // scientific notation`}
              />
              <p>
                Add a suffix like <code className="text-gold-300">i32</code>, <code className="text-gold-300">u64</code>, or
                <code className="text-gold-300">f64</code> to force a literal to a specific type.
              </p>
              <SyntaxHighlighter
                code={`items = 5u          // explicit unsigned literal\nprecise = 1f64      // force floating type even with an integer literal`}
              />
            </Section>

            <Section id="casting" number="6." title="Casting Rules">
              <p>
                All conversions must use the <code className="text-gold-300">as</code> keyword. The type checker blocks implicit
                promotions so the generated bytecode stays predictable.
              </p>
              <p>Supported conversions include:</p>
              <ul className="list-disc list-inside space-y-1 text-charcoal-300">
                <li><code className="text-gold-300">i32</code> → <code className="text-gold-300">i64</code>, <code className="text-gold-300">u32</code>, <code className="text-gold-300">u64</code>, <code className="text-gold-300">f64</code>, <code className="text-gold-300">bool</code>, <code className="text-gold-300">string</code></li>
                <li><code className="text-gold-300">i64</code> → <code className="text-gold-300">i32</code>, <code className="text-gold-300">u64</code>, <code className="text-gold-300">f64</code>, <code className="text-gold-300">string</code></li>
                <li><code className="text-gold-300">u32</code> → <code className="text-gold-300">i32</code>, <code className="text-gold-300">i64</code>, <code className="text-gold-300">u64</code>, <code className="text-gold-300">f64</code>, <code className="text-gold-300">string</code></li>
                <li><code className="text-gold-300">u64</code> → <code className="text-gold-300">i32</code>, <code className="text-gold-300">i64</code>, <code className="text-gold-300">u32</code>, <code className="text-gold-300">f64</code>, <code className="text-gold-300">string</code></li>
                <li><code className="text-gold-300">f64</code> → <code className="text-gold-300">i32</code>, <code className="text-gold-300">i64</code>, <code className="text-gold-300">u32</code>, <code className="text-gold-300">u64</code>, <code className="text-gold-300">string</code> (fractional part truncates toward zero)</li>
                <li><code className="text-gold-300">bool</code> → <code className="text-gold-300">i32</code>, <code className="text-gold-300">string</code></li>
                <li>Any primitive → <code className="text-gold-300">string</code></li>
              </ul>
              <SyntaxHighlighter
                code={`value: i32 = 42\nflag: bool = value as bool\nratio = (value as f64) / 10.0\nlabel = "Value: " + (value as string)`}
              />
              <p>
                Invalid casts raise runtime errors. The type checker normally catches the mistake before the program runs.
              </p>
            </Section>

            <Section id="comments" number="7." title="Comments">
              <p>
                Orus supports line and block comments. Block comments cannot nest.
              </p>
              <SyntaxHighlighter
                code={`// Single-line comment\n/* Block comment\n   spanning multiple lines */\nprint("Hello")`}
              />
              <p>
                Comments are removed while the code is tokenised, so use them freely for documentation.
              </p>
            </Section>

          <Section id="operators" number="8." title="Operators">
            <p>
              The operator family mirrors modern systems languages. Arithmetic and comparisons rely on familiar punctuation, while
              boolean logic stays readable with word operators. All type changes require the explicit <code className="text-gold-300">as</code> keyword so
              conversions remain obvious at a glance.
            </p>
            <ul className="list-disc list-inside space-y-1 text-charcoal-300">
              <li>Arithmetic: <code className="text-gold-300">+</code>, <code className="text-gold-300">-</code>, <code className="text-gold-300">*</code>, <code className="text-gold-300">/</code>, <code className="text-gold-300">%</code></li>
              <li>Comparisons: <code className="text-gold-300">&lt;</code>, <code className="text-gold-300">&lt;=</code>, <code className="text-gold-300">&gt;</code>, <code className="text-gold-300">&gt;=</code>, <code className="text-gold-300">==</code>, <code className="text-gold-300">!=</code></li>
              <li>Boolean logic: <code className="text-gold-300">and</code>, <code className="text-gold-300">or</code>, <code className="text-gold-300">not</code></li>
              <li>Equality helper: <code className="text-gold-300">matches</code> (reads cleanly with enums)</li>
              <li>Casting: <code className="text-gold-300">value as Type</code></li>
            </ul>

            <SubSection id="operators-arithmetic" title="8.1 Arithmetic in Practice">
              <p>
                Arithmetic operators behave as you would expect. Division with integer operands truncates toward zero, and compound
                assignments update an existing mutable binding in place.
              </p>
              <SyntaxHighlighter
                code={`hits = 42\nmisses = 3\nratio = hits as f64 / (hits + misses) as f64\nmut balance = 100\nbalance -= 25`}
              />
              <p>
                Reach for compound forms like <code className="text-gold-300">+=</code>, <code className="text-gold-300">-=</code>, and <code className="text-gold-300">*=</code> whenever the right-hand side uses the existing value.
              </p>
            </SubSection>

            <SubSection id="operators-comparisons" title="8.2 Comparisons and Equality">
              <p>
                Comparison operators work across numeric and string types that share compatible representations, always returning a
                boolean result. Chain comparisons (`a &lt; b &lt; c`) when you need to enforce ordering across several values.
              </p>
              <SyntaxHighlighter
                code={`score = 87\npassing = 70\n\nprint("strictly greater?", score > passing)\nprint("allow retake?", score >= passing - 5)\nprint("perfect match?", score == 100)\nprint("needs help?", score != 100 and score <= passing)`}
              />
              <p>
                Every comparison yields a <code className="text-gold-300">bool</code>, making the results perfect inputs for logical operators and control flow.
              </p>
            </SubSection>

            <SubSection id="operators-boolean" title="8.3 Boolean Logic and Short-Circuiting">
              <p>
                Orus uses the keyword operators <code className="text-gold-300">and</code>, <code className="text-gold-300">or</code>, and <code className="text-gold-300">not</code>. Each operand must already be a
                <code className="text-gold-300">bool</code>, and evaluation short-circuits so expensive work on the right-hand side is skipped when the result
                is known.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm text-charcoal-200 border border-charcoal-800 mb-6">
                  <thead className="bg-charcoal-900/80">
                    <tr>
                      <th className="px-4 py-2 border-b border-charcoal-800">Operator</th>
                      <th className="px-4 py-2 border-b border-charcoal-800">Arity</th>
                      <th className="px-4 py-2 border-b border-charcoal-800">Precedence</th>
                      <th className="px-4 py-2 border-b border-charcoal-800">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="odd:bg-charcoal-900/40">
                      <td className="px-4 py-2 border-b border-charcoal-800 font-mono text-gold-300">not</td>
                      <td className="px-4 py-2 border-b border-charcoal-800">Unary</td>
                      <td className="px-4 py-2 border-b border-charcoal-800">Highest</td>
                      <td className="px-4 py-2 border-b border-charcoal-800">Logical negation of a boolean expression</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 border-b border-charcoal-800 font-mono text-gold-300">and</td>
                      <td className="px-4 py-2 border-b border-charcoal-800">Binary</td>
                      <td className="px-4 py-2 border-b border-charcoal-800">Middle</td>
                      <td className="px-4 py-2 border-b border-charcoal-800">Requires both operands to be true</td>
                    </tr>
                    <tr className="odd:bg-charcoal-900/40">
                      <td className="px-4 py-2 border-b border-charcoal-800 font-mono text-gold-300">or</td>
                      <td className="px-4 py-2 border-b border-charcoal-800">Binary</td>
                      <td className="px-4 py-2 border-b border-charcoal-800">Lowest</td>
                      <td className="px-4 py-2 border-b border-charcoal-800">Succeeds when at least one operand is true</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">`and`: Require Both Conditions</h4>
                  <p>
                    <code className="text-gold-300">and</code> returns <code className="text-gold-300">true</code> only when both operands are true. Evaluation stops immediately if the left side is
                    false, which makes it perfect for guarding work on the right.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-xs text-charcoal-200 border border-charcoal-800 mb-3">
                      <thead className="bg-charcoal-900/80">
                        <tr>
                          <th className="px-3 py-2 border-b border-charcoal-800">Left</th>
                          <th className="px-3 py-2 border-b border-charcoal-800">Right</th>
                          <th className="px-3 py-2 border-b border-charcoal-800">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["true", "true", "true"],
                          ["true", "false", "false"],
                          ["false", "true", "false"],
                          ["false", "false", "false"],
                        ].map(([left, right, result], index) => (
                          <tr key={`and-row-${index}`} className="odd:bg-charcoal-900/40">
                            <td className="px-3 py-2 border-b border-charcoal-800 font-mono text-gold-300">{left}</td>
                            <td className="px-3 py-2 border-b border-charcoal-800 font-mono text-gold-300">{right}</td>
                            <td className="px-3 py-2 border-b border-charcoal-800 font-mono text-gold-300">{result}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <SyntaxHighlighter
                    code={`// Authenticate only when a token exists and passes validation.\nis_authenticated = user.has_token() and user.token_valid()\n\n// Avoid counting expired proposals.\nhas_quorum = votes >= quorum and not proposal.expired`}
                  />
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">`or`: Accept Any Passing Condition</h4>
                  <p>
                    <code className="text-gold-300">or</code> succeeds as soon as either operand is true. Use it for fallback configuration and cached results, letting
                    the runtime skip unnecessary work on the right-hand side.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-xs text-charcoal-200 border border-charcoal-800 mb-3">
                      <thead className="bg-charcoal-900/80">
                        <tr>
                          <th className="px-3 py-2 border-b border-charcoal-800">Left</th>
                          <th className="px-3 py-2 border-b border-charcoal-800">Right</th>
                          <th className="px-3 py-2 border-b border-charcoal-800">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["true", "true", "true"],
                          ["true", "false", "true"],
                          ["false", "true", "true"],
                          ["false", "false", "false"],
                        ].map(([left, right, result], index) => (
                          <tr key={`or-row-${index}`} className="odd:bg-charcoal-900/40">
                            <td className="px-3 py-2 border-b border-charcoal-800 font-mono text-gold-300">{left}</td>
                            <td className="px-3 py-2 border-b border-charcoal-800 font-mono text-gold-300">{right}</td>
                            <td className="px-3 py-2 border-b border-charcoal-800 font-mono text-gold-300">{result}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <SyntaxHighlighter
                    code={`// Enable verbose logging when either source requests it.\nshould_log = config.debug_enabled or request.has_override_flag()\n\n// Retry on any transient response.\nneeds_retry = response == Status.Timeout or response == Status.Unreachable`}
                  />
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">`not`: Invert a Boolean Expression</h4>
                  <p>
                    <code className="text-gold-300">not</code> flips the truth value of its operand. It binds tighter than <code className="text-gold-300">and</code> or <code className="text-gold-300">or</code>, so add
                    parentheses when combining several logical operators for clarity.
                  </p>
                  <SyntaxHighlighter
                    code={`mut guard = false\nguard = not guard              // flips the state\n\nif not (request.is_cached() or request.is_warm()):\n    hydrate_cache(request)`}
                  />
                </div>

                <div>
                  <h4 className="text-xl font-semibold text-white mb-2">Composition Guidelines</h4>
                  <p>
                    Combine comparisons and logical operators to express complex predicates, leaning on parentheses to document the
                    intended grouping and on short-circuiting to avoid unnecessary work.
                  </p>
                  <SyntaxHighlighter
                    code={`aborted = false\nhits = 42\n\nis_large = hits > 10_000 and not aborted\nshould_retry = aborted or hits == 0\n\nif hits > 50 and (aborted or not should_retry):\n    print("steady state")`}
                  />
                  <p>
                    The type checker rejects non-boolean operands in logical expressions, so mistakes like <code className="text-gold-300">value and 5</code> surface
                    immediately.
                  </p>
                </div>
              </div>
            </SubSection>

            <SubSection id="operators-matches" title="8.4 Pattern Matching Equality Helpers">
              <p>
                Use <code className="text-gold-300">matches</code> when comparing enum-style values. It reads more naturally than <code className="text-gold-300">==</code> and makes pattern matching
                intent obvious.
              </p>
              <SyntaxHighlighter code={`if mode matches Mode.Cached:\n    print("cache hit")`} />
            </SubSection>
          </Section>

            <Section id="control-flow" number="9." title="Control Flow">
              <SubSection id="conditionals" title="9.1 Conditionals">
                <p>
                  <code className="text-gold-300">if</code>/<code className="text-gold-300">elif</code>/<code className="text-gold-300">else</code> chains check boolean expressions. A branch can be a single line or an indented block.
                </p>
                <SyntaxHighlighter
                  code={`if status == "ok":\n    print("ready")\nelif status == "retry":\n    print("waiting")\nelse:\n    print("failed")`}
                />
                <p>Conditions must evaluate to <code className="text-gold-300">bool</code>. Using <code className="text-gold-300">=</code> inside a condition causes a syntax error.</p>
              </SubSection>
              <SubSection id="loops" title="9.2 Loops">
                <p>
                  Orus supports <code className="text-gold-300">while</code> and <code className="text-gold-300">for</code> loops. Both accept
                  <code className="text-gold-300">break</code> and <code className="text-gold-300">continue</code>. You can add a label by writing an apostrophe before the loop header (for example
                  <code className="text-gold-300">'outer: for ...</code>) and then target that loop with <code className="text-gold-300">break 'outer</code> or
                  <code className="text-gold-300">continue 'outer</code>.
                </p>
                <SyntaxHighlighter
                  code={`mut attempts = 0\nwhile attempts < 3:\n    attempts += 1\n    if attempts == 2:\n        continue         // skip the print on the second iteration\n    print("attempt", attempts)`}
                />
                <p>
                  <code className="text-gold-300">for</code> loops iterate over ranges or arrays.
                </p>
                <SyntaxHighlighter
                  code={`// Exclusive range with custom step\nfor i in 0..10..2:\n    print(i)\n\n// Inclusive range (..=)\nfor i in 0..=3:\n    print("inclusive", i)\n\nvalues = [1, 2, 3]\nfor item in values:\n    print("item", item)`}
                />
                <p>
                  Use <code className="text-gold-300">pass</code> as a placeholder when you need a loop body but have no work yet. Labels help you
                  exit nested loops cleanly.
                </p>
                <SyntaxHighlighter
                  code={`'outer: for row in 0..5:\n    for col in 0..5:\n        if row == col:\n            break 'outer`}
                />
              </SubSection>
            </Section>

            <Section id="arrays" number="10." title="Arrays">
              <p>
                Arrays come in fixed-length and dynamic flavours.
              </p>
              <SubSection id="arrays-fixed" title="10.1 Fixed-Length Arrays">
                <p>Specify both the element type and the compile-time length.</p>
                <SyntaxHighlighter
                  code={`mut nums: [i32, 3] = [1, 2, 3]\nnums[1] = 42\nprint("slice", nums[0..2])`}
                />
              </SubSection>
              <SubSection id="arrays-dynamic" title="10.2 Dynamic Arrays">
                <p>Declare only the element type and start empty. Use helpers to manage contents.</p>
                <SyntaxHighlighter
                  code={`mut numbers: [i32] = []\npush(numbers, 1)\npush(numbers, 2)\nprint("len", len(numbers))\nprint("pop", pop(numbers))`}
                />
                <p>
                  <code className="text-gold-300">push</code> appends and returns the array. <code className="text-gold-300">pop</code> removes and returns the last element.
                </p>
              </SubSection>
              <SubSection id="arrays-inference" title="10.3 Length Inference">
                <p>
                  When you skip the type annotation, the compiler infers a fixed-length array sized to the literals you provide.
                </p>
                <SyntaxHighlighter code={`nums = [1, 2, 3]      // inferred type: [i32, 3]`} />
                <p>These inferred arrays stay fixed and do not allow <code className="text-gold-300">push</code> or <code className="text-gold-300">pop</code>.</p>
              </SubSection>
              <SubSection id="arrays-fill" title="10.4 Fill Expressions">
                <p>Create a fixed array with repeated values using the <code className="text-gold-300">[value, Length]</code> form.</p>
                <SyntaxHighlighter
                  code={`const SIZE = 4\nzeros: [i32, SIZE] = [0, SIZE]`}
                />
              </SubSection>
              <SubSection id="arrays-slicing" title="10.5 Slicing">
                <p>
                  Build subarrays with <code className="text-gold-300">array[start..end]</code>. The upper bound is exclusive. Skip the start or end to go to the
                  beginning or the end.
                </p>
                <SyntaxHighlighter
                  code={`nums = [1, 2, 3, 4]\nfirst_three = nums[..3]\nlast_two = nums[2..]\nwhole = nums[..]`}
                />
              </SubSection>
            </Section>

            <Section id="functions" number="11." title="Functions">
              <p>
                Define a function with <code className="text-gold-300">fn name(parameters) -&gt; ReturnType:</code>. Skip the arrow for
                <code className="text-gold-300">void</code> functions. Use <code className="text-gold-300">return</code> to exit early.
              </p>
              <SyntaxHighlighter
                code={`fn add(a: i32, b: i32) -> i32:\n    return a + b\n\nfn log_message(message: string):\n    print("log:", message)`}
              />
              <p>Orus also supports function expressions for higher-order work.</p>
              <SyntaxHighlighter
                code={`square = fn(value: i32) -> i32:\n    return value * value\n\nprint(add(5, 7))\nprint(square(6))`}
              />
              <p>Function values capture nearby variables automatically.</p>
            </Section>

            <Section id="structs" number="12." title="Structs">
              <p>Structs bundle related fields into one type.</p>
              <SyntaxHighlighter
                code={`struct Point:\n    x: i32\n    y: i32 = 0     // default value`}
              />
              <p>Construct values with curly braces and use dot syntax to read or change fields.</p>
              <SyntaxHighlighter
                code={`mut origin = Point{ x: 0, y: 0 }\norigin.y = 5`}
              />
            </Section>

            <Section id="methods" number="13." title="Methods with impl">
              <p>
                Attach functions to a struct with an <code className="text-gold-300">impl</code> block. Methods that take
                <code className="text-gold-300">self</code> act on an instance. Other functions behave like static helpers called through the struct name.
              </p>
              <SyntaxHighlighter
                code={`impl Point:\n    fn translate(self, dx: i32, dy: i32) -> Point:\n        return Point{ x: self.x + dx, y: self.y + dy }\n\n    fn from_origin(dx: i32, dy: i32) -> Point:\n        return Point{ x: dx, y: dy }\n\np = Point.from_origin(4, 9)\nprint(p.translate(1, -1).y)`}
              />
            </Section>

            <Section id="pattern-matching" number="14." title="Pattern Matching">
              <p>Enums can hold payloads, and <code className="text-gold-300">match</code> lets you inspect them cleanly.</p>
              <SyntaxHighlighter
                code={`enum Result:\n    Ok(value: i32)\n    Err(message: string)\n\nvalue = Result.Ok(42)\nmessage = Result.Err("boom")`}
              />
              <SubSection id="match-statements" title="14.1 match Statements">
                <SyntaxHighlighter
                  code={`match value:\n    Result.Ok(result) ->\n        print("ok", result)\n    Result.Err(reason) ->\n        print("error", reason)`}
                />
                <p>
                  Each arm uses <code className="text-gold-300">pattern -&gt;</code> followed by a single statement or an indented block. Use
                  <code className="text-gold-300">_</code> as a wildcard. The compiler checks that every enum variant is handled.
                </p>
              </SubSection>
              <SubSection id="match-expressions" title="14.2 match Expressions">
                <SyntaxHighlighter
                  code={`label: string = match message:\n    Result.Ok(result) -> "ok: " + (result as string)\n    Result.Err(reason) -> "error: " + reason`}
                />
              </SubSection>
              <SubSection id="matches-keyword" title="14.3 matches Keyword">
                <p>
                  <code className="text-gold-300">matches</code> offers a friendly equality check and compiles to the same bytecode as
                  <code className="text-gold-300">==</code>.
                </p>
                <SyntaxHighlighter
                  code={`if value matches Result.Ok(_):\n    print("still ok")`}
                />
                <p>
                  Until Orus adds generics, payload bindings default to the <code className="text-gold-300">any</code> type. Cast them when you
                  need a specific type for further work.
                </p>
              </SubSection>
            </Section>

            <Section id="error-handling" number="15." title="Error Handling">
              <p>
                Guard risky code with <code className="text-gold-300">try</code>/<code className="text-gold-300">catch</code>. Use
                <code className="text-gold-300">throw</code> to raise an error value.
              </p>
              <SyntaxHighlighter
                code={`try:\n    risky = 10 / step\ncatch err:\n    print("caught", err)\n\nthrow "unexpected state"`}
              />
              <p>
                Both <code className="text-gold-300">try</code> and <code className="text-gold-300">catch</code> accept inline statements or indented blocks. The runtime unwinds safely and
                predictably.
              </p>
            </Section>

            <Section id="modules" number="16." title="Modules">
              <p>
                Start a file with a <code className="text-gold-300">module</code> declaration to set its path. The declaration must be the first non-comment line and can
                appear only once.
              </p>
              <SyntaxHighlighter
                code={`module geometry.points:\n\n    pub struct Point:\n        x: i32\n        y: i32\n\n    pub fn origin() -> Point:\n        return Point{ x: 0, y: 0 }`}
              />
              <p>
                The block form keeps the rest of the file indented. You can also write the single-line form
                <code className="text-gold-300">module geometry.points</code> and continue with top-level items.
              </p>
              <SubSection id="modules-use" title="16.1 Imports with use">
                <p>
                  <code className="text-gold-300">use</code> works at module scope. Choose wide or selective imports.
                </p>
                <SyntaxHighlighter
                  code={`use geometry.points           // import all public symbols\nuse geometry.points: Point    // import a subset\nuse geometry.points: origin as start`}
                />
                <p>Aliases like <code className="text-gold-300">use geometry.points as geo</code> are recorded for tooling today.</p>
              </SubSection>
              <SubSection id="modules-public" title="16.2 Public Functions and Structs">
                <p>
                  Definitions stay private unless you add <code className="text-gold-300">pub</code>. Use it with <code className="text-gold-300">fn</code>,
                  <code className="text-gold-300">struct</code>, <code className="text-gold-300">enum</code>, <code className="text-gold-300">impl</code>, or <code className="text-gold-300">global</code>.
                </p>
                <SyntaxHighlighter
                  code={`pub fn squared_distance(a: Point, b: Point) -> f64:\n    dx = (b.x - a.x) as f64\n    dy = (b.y - a.y) as f64\n    return dx * dx + dy * dy`}
                />
                <p>
                  Remember that globals use uppercase names. Add <code className="text-gold-300">mut</code> when the value should be writable.
                </p>
              </SubSection>
            </Section>

            <Section id="builtins" number="17." title="Built-in Utilities">
              <p>
                The runtime includes built-ins for inspecting values, gathering input, and working with collections. They look like normal functions even
                though the VM implements them directly.
              </p>
              <ul className="list-disc list-inside space-y-1 text-charcoal-300">
                <li><code className="text-gold-300">print(...)</code> writes values separated by spaces and ends with a newline. String literals can include <code className="text-gold-300">@</code> format marks like <code className="text-gold-300">@.2f</code>, <code className="text-gold-300">@x</code>, <code className="text-gold-300">@X</code>, <code className="text-gold-300">@b</code>, and <code className="text-gold-300">@o</code>.</li>
                <li><code className="text-gold-300">len(array_or_string)</code> returns the number of elements or bytes.</li>
                <li><code className="text-gold-300">push(array, value)</code> / <code className="text-gold-300">pop(array)</code> change dynamic arrays in place.</li>
                <li><code className="text-gold-300">sorted(array)</code> gives you a new sorted copy without touching the original.</li>
                <li><code className="text-gold-300">range(...)</code> builds range iterators for <code className="text-gold-300">for</code> loops or manual use.</li>
                <li><code className="text-gold-300">input()</code> or <code className="text-gold-300">input(prompt)</code> reads a line from standard input.</li>
                <li><code className="text-gold-300">int(value)</code> / <code className="text-gold-300">float(value)</code> convert or parse numbers. Wrap them in <code className="text-gold-300">try</code>/<code className="text-gold-300">catch</code> for user input.</li>
                <li><code className="text-gold-300">type_of(value)</code> returns a string that names the runtime type.</li>
                <li><code className="text-gold-300">is_type(value, name)</code> checks if the runtime type matches a string.</li>
                <li><code className="text-gold-300">time_stamp()</code> returns a monotonic <code className="text-gold-300">f64</code> in seconds.</li>
              </ul>
              <SyntaxHighlighter
                code={`pi = 3.14159\nprint("Pi ~= @.2f", pi)\n\nmut values: [i32] = []\npush(values, 3)\npush(values, 1)\npush(values, 2)\nprint("sorted copy:", sorted(values))   // values remains unchanged\n\nfor i in range(2, 10, 3):\n    print("range value", i)\n\nanswer = input("Enter a number: ")\ntry:\n    parsed = int(answer)\n    print("you typed", parsed, "of type", type_of(parsed))\ncatch err:\n    print("invalid input:", err)\n\nstart: f64 = time_stamp()\nfor i in 0..1_000_000:\n    for _ in 0..1_000_000:\n        pass\nelapsed = time_stamp() - start\nprint("elapsed seconds:", elapsed)`}
              />
            </Section>

            <Section id="best-practices" number="18." title="Best Practices and Patterns">
              <ul className="list-disc list-inside space-y-2 text-charcoal-300">
                <li><strong>Lean on immutability.</strong> Start with immutable bindings and add <code className="text-gold-300">mut</code> only when you need it.</li>
                <li><strong>Annotate intent.</strong> Type annotations make your plan clear and help diagnostics.</li>
                <li><strong>Prefer explicit casts.</strong> Add <code className="text-gold-300">as</code> conversions where they help clarity.</li>
                <li><strong>Use modules early.</strong> Organise code by feature and import only what you need.</li>
                <li><strong>Design enums for exhaustive matches.</strong> Cover every case so pattern matching shines.</li>
                <li><strong>Handle errors thoughtfully.</strong> Wrap risky operations with <code className="text-gold-300">try</code>/<code className="text-gold-300">catch</code> and throw useful messages.</li>
                <li><strong>Measure with <code className="text-gold-300">time_stamp()</code>.</strong> Lightweight timing keeps performance changes visible.</li>
              </ul>
              <p>
                These habits work with the compiler to deliver reliable, fast programs.
              </p>
            </Section>

            <Section id="putting-it-together" number="19." title="Putting It Together">
              <p>Here is the complete example from the tutorial.</p>
              <SyntaxHighlighter
                code={`module diagnostics.report:\n\n    pub struct Sample:\n        values: [i32]\n\n    pub fn collect(limit: i32) -> Sample:\n        mut data: [i32] = []\n        for n in 0..=limit:\n            if n % 2 == 0:\n                push(data, n)\n        return Sample{ values: data }\n\n    pub fn summarize(sample: Sample) -> string:\n        total = len(sample.values)\n        return "even count: " + (total as string)`}
              />
              <SyntaxHighlighter
                code={`use diagnostics.report: collect, summarize\n\nenum Status:\n    Ready\n    Busy(reason: string)\n\nfn status_text(status: Status) -> string:\n    return match status:\n        Status.Ready -> "ready"\n        Status.Busy(reason) -> "busy: " + reason\n\nfn main():\n    sample = collect(10)\n    print(summarize(sample))\n\n    current = Status.Busy("pending I/O")\n    print(status_text(current))\n\n    try:\n        throw "simulated failure"\n    catch err:\n        print("recovered", err)`}
              />
              <p>
                This program shows modules, array helpers, struct methods, pattern matching, and error handling working together.
                Copy it into <code className="text-gold-300">main.orus</code>, run <code className="text-gold-300">orus main.orus</code>, and play with new ideas.
              </p>
              <p className="text-gold-300 font-semibold">Enjoy exploring Orus!</p>
            </Section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
