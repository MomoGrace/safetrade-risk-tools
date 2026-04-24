import React, { useMemo, useState } from "react";

const modes = {
  conservative: {
    label: "Conservative",
    riskMin: 0.25,
    riskMax: 0.5,
    dailyLoss: 2,
    maxDrawdown: 10,
    maxTrades: 1,
    account: "Cent / Micro account recommended",
    note: "Best for beginners, demo testing, and small capital EA testing.",
  },
  balanced: {
    label: "Balanced",
    riskMin: 0.5,
    riskMax: 1,
    dailyLoss: 3,
    maxDrawdown: 15,
    maxTrades: 2,
    account: "Micro / Standard account, depending on broker minimum lot",
    note: "For users who already understand basic EA risk and drawdown.",
  },
  aggressive: {
    label: "Aggressive",
    riskMin: 1,
    riskMax: 2,
    dailyLoss: 5,
    maxDrawdown: 20,
    maxTrades: 3,
    account: "Only for experienced traders who accept higher risk",
    note: "Higher risk. Not recommended for beginners or small accounts.",
  },
};

const articles = [
  {
    title: "What Is Risk per Trade in Forex?",
    description: "Learn why risking a small percentage of your account per trade can help reduce the impact of losing streaks.",
  },
  {
    title: "Conservative EA Settings for Small Accounts",
    description: "Understand why small accounts often need lower risk, fewer open trades and clear drawdown stop rules.",
  },
  {
    title: "Why Martingale EA Is Dangerous for Beginners",
    description: "A simple explanation of why increasing lot size after losses can create large drawdowns during strong trends.",
  },
];

function money(value) {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function percent(value) {
  return `${Number(value).toFixed(2)}%`;
}

function Card({ children, className = "", id }) {
  return (
    <div id={id} className={`rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mx-auto mb-8 max-w-3xl text-center">
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">{eyebrow}</p>}
      <h2 className="text-3xl font-bold tracking-tight text-zinc-950 md:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-base leading-7 text-zinc-600">{description}</p>}
    </div>
  );
}

function Input({ label, value, onChange, min = 0, step = "any", suffix }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-zinc-700">{label}</span>
      <div className="flex overflow-hidden rounded-xl border border-zinc-300 bg-white focus-within:ring-2 focus-within:ring-zinc-900">
        <input
          className="w-full px-4 py-3 text-zinc-950 outline-none"
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        {suffix && <span className="flex items-center bg-zinc-100 px-4 text-sm text-zinc-500">{suffix}</span>}
      </div>
    </label>
  );
}

function ConservativeEACalculator() {
  const [deposit, setDeposit] = useState(300);
  const [modeKey, setModeKey] = useState("conservative");
  const [stopLossPips, setStopLossPips] = useState(30);
  const [pipValuePerLot, setPipValuePerLot] = useState(10);

  const mode = modes[modeKey];

  const result = useMemo(() => {
    const riskLow = deposit * (mode.riskMin / 100);
    const riskHigh = deposit * (mode.riskMax / 100);
    const dailyLossAmount = deposit * (mode.dailyLoss / 100);
    const maxDrawdownAmount = deposit * (mode.maxDrawdown / 100);
    const lotLow = stopLossPips > 0 && pipValuePerLot > 0 ? riskLow / (stopLossPips * pipValuePerLot) : 0;
    const lotHigh = stopLossPips > 0 && pipValuePerLot > 0 ? riskHigh / (stopLossPips * pipValuePerLot) : 0;

    return { riskLow, riskHigh, dailyLossAmount, maxDrawdownAmount, lotLow, lotHigh };
  }, [deposit, mode, stopLossPips, pipValuePerLot]);

  return (
    <Card id="ea-calculator" className="scroll-mt-24">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Tool 01</p>
        <h3 className="mt-2 text-2xl font-bold text-zinc-950">Conservative EA Setup Calculator</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Generate a beginner-friendly EA risk setup based on deposit, risk mode, stop loss and pip value.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Deposit" value={deposit} onChange={setDeposit} min={1} suffix="USD" />
        <Input label="Stop Loss" value={stopLossPips} onChange={setStopLossPips} min={1} suffix="pips" />
        <Input label="Pip Value per 1.00 lot" value={pipValuePerLot} onChange={setPipValuePerLot} min={0.01} step="0.01" suffix="USD" />

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-zinc-700">Risk Mode</span>
          <select
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none focus:ring-2 focus:ring-zinc-900"
            value={modeKey}
            onChange={(event) => setModeKey(event.target.value)}
          >
            {Object.entries(modes).map(([key, item]) => (
              <option key={key} value={key}>
                {item.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-zinc-950 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Risk per trade</p>
          <p className="mt-2 text-2xl font-bold">{money(result.riskLow)} - {money(result.riskHigh)}</p>
          <p className="mt-2 text-sm text-zinc-300">{percent(mode.riskMin)} - {percent(mode.riskMax)} of deposit</p>
        </div>
        <div className="rounded-2xl bg-zinc-100 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Daily loss limit</p>
          <p className="mt-2 text-2xl font-bold text-zinc-950">{money(result.dailyLossAmount)}</p>
          <p className="mt-2 text-sm text-zinc-600">Stop trading after {percent(mode.dailyLoss)} daily loss</p>
        </div>
        <div className="rounded-2xl bg-zinc-100 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Drawdown stop</p>
          <p className="mt-2 text-2xl font-bold text-zinc-950">{money(result.maxDrawdownAmount)}</p>
          <p className="mt-2 text-sm text-zinc-600">Stop EA at {percent(mode.maxDrawdown)} account drawdown</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
        <h4 className="font-semibold text-zinc-950">Suggested EA Setup</h4>
        <div className="mt-4 grid gap-3 text-sm text-zinc-700 md:grid-cols-2">
          <p><strong>Mode:</strong> {mode.label}</p>
          <p><strong>Suggested lot size:</strong> {result.lotLow.toFixed(3)} - {result.lotHigh.toFixed(3)} lot</p>
          <p><strong>Max open trades:</strong> {mode.maxTrades}</p>
          <p><strong>Suggested account:</strong> {mode.account}</p>
          <p className="md:col-span-2"><strong>Note:</strong> {mode.note}</p>
        </div>
      </div>
    </Card>
  );
}

function PropFirmCalculator() {
  const [accountSize, setAccountSize] = useState(10000);
  const [riskPerTrade, setRiskPerTrade] = useState(1);
  const [dailyLossPercent, setDailyLossPercent] = useState(5);
  const [maxLossPercent, setMaxLossPercent] = useState(10);

  const result = useMemo(() => {
    const riskAmount = accountSize * riskPerTrade / 100;
    const dailyLoss = accountSize * dailyLossPercent / 100;
    const maxLoss = accountSize * maxLossPercent / 100;
    const tradesToDailyLimit = riskAmount > 0 ? Math.floor(dailyLoss / riskAmount) : 0;
    return { riskAmount, dailyLoss, maxLoss, tradesToDailyLimit };
  }, [accountSize, riskPerTrade, dailyLossPercent, maxLossPercent]);

  return (
    <Card id="prop-firm" className="scroll-mt-24">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Tool 02</p>
        <h3 className="mt-2 text-2xl font-bold text-zinc-950">Prop Firm Risk Calculator</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Estimate risk per trade, daily loss limit and maximum account loss for funded account challenges.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input label="Account Size" value={accountSize} onChange={setAccountSize} min={1} suffix="USD" />
        <Input label="Risk per Trade" value={riskPerTrade} onChange={setRiskPerTrade} min={0.01} step="0.01" suffix="%" />
        <Input label="Daily Loss Limit" value={dailyLossPercent} onChange={setDailyLossPercent} min={0.01} step="0.01" suffix="%" />
        <Input label="Max Loss Limit" value={maxLossPercent} onChange={setMaxLossPercent} min={0.01} step="0.01" suffix="%" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-zinc-950 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Risk per trade</p>
          <p className="mt-2 text-2xl font-bold">{money(result.riskAmount)}</p>
        </div>
        <div className="rounded-2xl bg-zinc-100 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Daily loss</p>
          <p className="mt-2 text-2xl font-bold text-zinc-950">{money(result.dailyLoss)}</p>
        </div>
        <div className="rounded-2xl bg-zinc-100 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Max loss</p>
          <p className="mt-2 text-2xl font-bold text-zinc-950">{money(result.maxLoss)}</p>
        </div>
        <div className="rounded-2xl bg-zinc-100 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Losing trades before daily stop</p>
          <p className="mt-2 text-2xl font-bold text-zinc-950">{result.tradesToDailyLimit}</p>
        </div>
      </div>
    </Card>
  );
}

function DrawdownCalculator() {
  const [balance, setBalance] = useState(1000);
  const [lossPerTrade, setLossPerTrade] = useState(1);
  const [lossCount, setLossCount] = useState(5);

  const rows = useMemo(() => {
    let current = balance;
    const data = [];
    for (let i = 1; i <= Math.max(0, lossCount); i += 1) {
      const loss = current * lossPerTrade / 100;
      current -= loss;
      const dd = ((balance - current) / balance) * 100;
      data.push({ trade: i, balance: current, drawdown: dd });
    }
    return data;
  }, [balance, lossPerTrade, lossCount]);

  const final = rows[rows.length - 1] || { balance, drawdown: 0 };

  return (
    <Card id="drawdown" className="scroll-mt-24">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Tool 03</p>
        <h3 className="mt-2 text-2xl font-bold text-zinc-950">Forex Drawdown Calculator</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-600">
          Understand how consecutive losses affect your account balance and drawdown percentage.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <Input label="Starting Balance" value={balance} onChange={setBalance} min={1} suffix="USD" />
        <Input label="Loss per Trade" value={lossPerTrade} onChange={setLossPerTrade} min={0.01} step="0.01" suffix="%" />
        <Input label="Consecutive Losses" value={lossCount} onChange={setLossCount} min={0} step="1" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-zinc-950 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Final balance</p>
          <p className="mt-2 text-3xl font-bold">{money(final.balance)}</p>
        </div>
        <div className="rounded-2xl bg-zinc-100 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Estimated drawdown</p>
          <p className="mt-2 text-3xl font-bold text-zinc-950">{percent(final.drawdown)}</p>
        </div>
      </div>

      <div className="mt-6 max-h-64 overflow-auto rounded-2xl border border-zinc-200">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 bg-zinc-100 text-zinc-600">
            <tr>
              <th className="px-4 py-3">Loss #</th>
              <th className="px-4 py-3">Balance</th>
              <th className="px-4 py-3">Drawdown</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.trade} className="border-t border-zinc-200">
                <td className="px-4 py-3">{row.trade}</td>
                <td className="px-4 py-3">{money(row.balance)}</td>
                <td className="px-4 py-3">{percent(row.drawdown)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function FAQ() {
  const items = [
    {
      q: "Is this an EA profit calculator?",
      a: "No. This website focuses on risk planning, lot sizing, drawdown awareness and conservative EA setup guidance. It does not predict profit.",
    },
    {
      q: "Can a USD100 account run an EA?",
      a: "It depends on the account type, broker minimum lot size, spread, stop loss and risk settings. For small accounts, cent or micro accounts are usually more suitable for conservative testing.",
    },
    {
      q: "Why use 0.25% to 0.5% risk?",
      a: "Lower risk per trade helps reduce the impact of losing streaks. It is slower, but more suitable for demo testing and beginner risk control.",
    },
    {
      q: "Does this guarantee safety?",
      a: "No. Forex and CFD trading involve risk. Risk calculators help with planning, but they cannot remove market risk or guarantee results.",
    },
  ];

  return (
    <section id="faq" className="scroll-mt-24 py-16">
      <SectionTitle
        eyebrow="FAQ"
        title="Common Questions"
        description="Add these explanations to reduce repetitive customer questions before they contact you."
      />
      <div className="mx-auto grid max-w-4xl gap-4">
        {items.map((item) => (
          <Card key={item.q}>
            <h3 className="font-semibold text-zinc-950">{item.q}</h3>
            <p className="mt-2 leading-7 text-zinc-600">{item.a}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function LeadCapture() {
  return (
    <section id="lead" className="bg-zinc-950 px-5 py-16 text-white">
      <div className="mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[1fr_0.85fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">Lead Capture</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">Want the conservative EA demo setup guide?</h2>
          <p className="mt-4 max-w-2xl leading-7 text-zinc-300">
            Replace this form with Google Form, Tally, Airtable or your own backend. The goal is to collect leads automatically without explaining everything one by one.
          </p>
        </div>
        <Card className="border-zinc-800 bg-zinc-900 text-white">
          <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
            <input className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white" placeholder="Name" />
            <input className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white" placeholder="WhatsApp / Email" />
            <select className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-white">
              <option>I want to test EA with demo first</option>
              <option>I want small capital conservative setup</option>
              <option>I want prop firm risk setup</option>
              <option>I want fast profit / high return</option>
            </select>
            <label className="flex gap-3 text-sm leading-6 text-zinc-300">
              <input type="checkbox" className="mt-1" />
              <span>I understand forex trading involves risk and this tool does not guarantee profit.</span>
            </label>
            <button className="w-full rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-950 hover:bg-zinc-200">
              Send Me the Setup Guide
            </button>
          </form>
        </Card>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <a href="#top" className="text-lg font-black tracking-tight">SafeTrade Risk Tools</a>
          <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex">
            <a href="#ea-calculator" className="hover:text-zinc-950">EA Calculator</a>
            <a href="#prop-firm" className="hover:text-zinc-950">Prop Firm</a>
            <a href="#drawdown" className="hover:text-zinc-950">Drawdown</a>
            <a href="#faq" className="hover:text-zinc-950">FAQ</a>
          </nav>
          <a href="#lead" className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800">Get Setup Guide</a>
        </div>
      </header>

      <main id="top">
        <section className="bg-zinc-950 px-5 py-20 text-white md:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Forex • EA • Prop Firm Risk Tools</p>
              <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                Calculate your EA risk before running automated trading.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
                A beginner-friendly calculator website for conservative EA settings, funded account risk limits, drawdown planning and small account testing.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="#ea-calculator" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-zinc-200">
                  Start Calculating
                </a>
                <a href="#lead" className="rounded-full border border-zinc-600 px-6 py-3 text-center text-sm font-bold text-white hover:bg-zinc-900">
                  Get Demo Setup Guide
                </a>
              </div>
            </div>
            <Card className="border-zinc-800 bg-zinc-900 text-white shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">Suggested Beginner Setup</p>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-zinc-400">Deposit</span>
                  <strong>USD100 - USD500</strong>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-zinc-400">Risk per Trade</span>
                  <strong>0.25% - 0.50%</strong>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-zinc-400">Max Daily Loss</span>
                  <strong>2%</strong>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <span className="text-zinc-400">Drawdown Stop</span>
                  <strong>10%</strong>
                </div>
                <p className="pt-2 text-sm leading-6 text-zinc-400">
                  Designed for conservative testing. Not designed for fast profit or account flipping.
                </p>
              </div>
            </Card>
          </div>
        </section>

        <section className="px-5 py-16">
          <SectionTitle
            eyebrow="Free Tools"
            title="Risk calculators for EA beginners"
            description="Use these tools to plan risk before testing an EA on demo or small capital."
          />
          <div className="mx-auto grid max-w-6xl gap-6">
            <ConservativeEACalculator />
            <PropFirmCalculator />
            <DrawdownCalculator />
          </div>
        </section>

        <section className="bg-white px-5 py-16">
          <SectionTitle
            eyebrow="SEO Content Section"
            title="Why conservative EA risk settings matter"
            description="This section is important for SEO and AdSense. A calculator page should include helpful explanations, not just input boxes."
          />
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            <Card>
              <h3 className="text-xl font-bold">Small accounts need smaller risk</h3>
              <p className="mt-3 leading-7 text-zinc-600">
                A USD100 account can be affected heavily by a few losing trades. Conservative risk settings help reduce the chance of emotional decisions and overexposure.
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold">Daily loss limits protect consistency</h3>
              <p className="mt-3 leading-7 text-zinc-600">
                A daily loss limit stops the EA from continuing to trade during bad market conditions. This is especially important for beginners testing automated systems.
              </p>
            </Card>
            <Card>
              <h3 className="text-xl font-bold">Drawdown stop prevents deeper damage</h3>
              <p className="mt-3 leading-7 text-zinc-600">
                A maximum drawdown stop is designed to pause or stop the EA when account equity drops beyond the chosen risk threshold.
              </p>
            </Card>
          </div>
        </section>

        <section className="px-5 py-16">
          <SectionTitle
            eyebrow="Content Ideas"
            title="Next SEO articles to add"
            description="These article topics can help the website grow beyond a thin calculator page."
          />
          <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-3">
            {articles.map((article) => (
              <Card key={article.title}>
                <h3 className="text-xl font-bold">{article.title}</h3>
                <p className="mt-3 leading-7 text-zinc-600">{article.description}</p>
              </Card>
            ))}
          </div>
        </section>

        <FAQ />
        <LeadCapture />

        <section className="px-5 py-10">
          <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-7 text-zinc-600">
            <strong className="text-zinc-950">Risk Disclaimer:</strong> Forex and CFD trading involve risk and may not be suitable for all investors. These calculators are for educational and risk-planning purposes only. They do not provide financial advice, trading signals or profit guarantees. Past performance does not guarantee future results. Trade only with money you can afford to lose.
          </div>
        </section>
      </main>
    </div>
  );
}
