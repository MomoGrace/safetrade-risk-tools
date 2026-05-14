import React, { useEffect, useMemo, useState } from "react";

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

const legacyArticles = [
  {
    title: "What Is Risk Per Trade in Forex?",
    slug: "what-is-risk-per-trade-in-forex",
    description: "Learn what risk per trade means in forex, how to size positions conservatively, and why smaller risk helps account survival.",
    status: "Published",
  },
  {
    title: "Conservative EA Settings for Small Accounts",
    slug: "conservative-ea-settings-for-small-accounts",
    description: "Discover safer EA parameters for small balances, including lower lot size, strict stop rules, and realistic return expectations.",
    status: "Published",
  },
  {
    title: "Why 0.5% Risk Is Safer for EA Beginners",
    slug: "why-0-5-risk-is-safer-for-ea-beginners",
    description: "See why using 0.5% risk per trade can reduce drawdown pressure and help beginner EA users avoid fast account damage.",
    status: "Published",
  },
  {
    title: "Prop Firm Daily Loss and Max Drawdown Explained",
    slug: "prop-firm-daily-loss-and-max-drawdown-explained",
    description: "Understand the difference between daily loss limits and max drawdown, and how to trade funded challenges with tighter control.",
    status: "Published",
  },
  {
    title: "Why Martingale EA Is Dangerous for Beginners",
    slug: "why-martingale-ea-is-dangerous-for-beginners",
    description: "Learn the key risks of martingale systems, including escalating exposure, deeper drawdowns, and higher blow-up probability.",
    status: "Published",
  },
];

const articles = [
  {
    title: "How to Calculate Lot Size in Forex Trading",
    slug: "how-to-calculate-lot-size-in-forex-trading",
    description: "Understand lot size, account risk, stop loss, and pip value with practical examples to estimate safer position sizes.",
    status: "Published",
  },
  {
    title: "What Is Risk Reward Ratio in Forex Trading?",
    slug: "what-is-risk-reward-ratio-in-forex-trading",
    description: "Learn how 1:1, 1:2, and 1:3 setups work, and how risk reward ratio connects to win rate and trade planning.",
    status: "Published",
  },
  {
    title: "What Is Drawdown in Forex Trading?",
    slug: "what-is-drawdown-in-forex-trading",
    description: "A clear guide to balance drawdown, equity drawdown, maximum drawdown, and why recovery gets harder after deep losses.",
    status: "Published",
  },
  {
    title: "How Much Should You Risk Per Trade?",
    slug: "how-much-should-you-risk-per-trade",
    description: "Compare 1% and 2% risk models, account survival during losing streaks, and practical risk-control habits for beginners.",
    status: "Published",
  },
  {
    title: "Stop Loss in Forex: How to Set It Properly",
    slug: "stop-loss-in-forex-how-to-set-it-properly",
    description: "Learn common stop-loss methods including ATR and structure-based placement, plus mistakes that increase trading risk.",
    status: "Published",
  },
  {
    title: "Position Size vs Lot Size: What Is the Difference?",
    slug: "position-size-vs-lot-size",
    description: "Understand units, standard/mini/micro lots, and how position size and lot size work together in forex risk planning.",
    status: "Published",
  },
  {
    title: "How to Use a Forex Lot Size Calculator Correctly",
    slug: "how-to-use-a-forex-lot-size-calculator-correctly",
    description: "Learn the correct inputs, compare 0.5%, 1%, and 2% risk settings, and use lot size results before placing a trade.",
    status: "Published",
  },
  {
    title: "Forex Risk Management Checklist for Beginners",
    slug: "forex-risk-management-checklist-for-beginners",
    description: "Build a simple pre-trade process covering risk per trade, stop loss, position sizing, drawdown limits, and journaling habits.",
    status: "Published",
  },
  {
    title: "What Is Leverage in Forex and Why It Increases Risk?",
    slug: "what-is-leverage-in-forex-and-why-it-increases-risk",
    description: "Understand what leverage does in forex, how margin works, and why higher leverage can magnify both gains and losses.",
    status: "Published",
  },
  {
    title: "Margin Call in Forex: What It Means and How to Avoid It",
    slug: "margin-call-in-forex-what-it-means-and-how-to-avoid-it",
    description: "Learn how margin calls happen, how used and free margin interact, and practical ways to reduce liquidation risk.",
    status: "Published",
  },
];
const latestArticles = articles;
const allArticles = [...latestArticles, ...legacyArticles];

function filteredRelatedAll(slug){ return allArticles.filter((a)=>a.slug!==slug); }

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
   <Card id="calculators" className="scroll-mt-24">
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
            Get the free guide for conservative forex risk planning and EA testing basics. We only share educational content focused on risk control.
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


const TALLY_URL = "https://tally.so/r/81JKpA";

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-10 py-4">
        <a href="/" className="text-lg font-black tracking-tight">BytesTrade Risk Tools</a>
        <nav className="hidden flex-wrap items-start gap-x-5 gap-y-2 text-sm font-medium text-zinc-600 md:flex">
          <a href="/#ea-calculator" className="hover:text-zinc-950">EA Calculator</a>
          <a href="/#prop-firm" className="hover:text-zinc-950">Prop Firm</a>
          <a href="/drawdown-calculator" className="hover:text-zinc-950">Drawdown Calculator</a>
           <a href="/risk-reward-calculator" className="hover:text-zinc-950">Risk Reward</a>
           <a href="/lot-size-calculator" className="hover:text-zinc-950">Lot Size</a>
          <a href="/forex-market-hours" className="hover:text-zinc-950">Market Hours</a>
          <a href="/privacy-policy" className="hover:text-zinc-950">Privacy Policy</a>
            <a href="/articles" className="hover:text-zinc-950">Articles</a>
            <a href="/about" className="hover:text-zinc-950">About</a>
          <a href="/disclaimer" className="hover:text-zinc-950">Disclaimer</a>
        </nav>
        <a href="#calculators" className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800">
        Calculators
        </a>
      </div>
    </header>
  );
}

function PageHero({ eyebrow, title, description }) {
  return (
    <section className="bg-zinc-950 px-5 py-16 text-white md:py-20">
      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">{eyebrow}</p>
        <h1 className="max-w-4xl text-4xl font-black tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">{description}</p>
      </div>
    </section>
  );
}

function ContentPage({ children }) {
  return (
    <main>
      <section className="px-5 py-14">
        <div className="mx-auto max-w-5xl space-y-6">
          {children}
        </div>
      </section>
    </main>
  );
}
function LotSizeCalculatorPage() {
  const [result, setResult] = React.useState(null);

  return (
    <>
      <PageHero
        eyebrow="FOREX RISK CALCULATOR"
        title="Lot Size Calculator Forex (Position Size Calculator Free)"
        description="Calculate your lot size based on risk percentage, stop loss and account balance."
      />

      <ContentPage>
        <article className="space-y-6">

          <Card>
            <h2 className="text-2xl font-bold text-zinc-950 mb-4">
              Quick Answer: What Is Lot Size?
            </h2>
            <p className="leading-7 text-zinc-600">
              Lot size in forex determines how much you trade based on your risk. 
              A proper lot size ensures you only risk a small percentage of your account per trade.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold text-zinc-950 mb-4">
              Lot Size Calculator
            </h2>
            <p className="leading-7 text-zinc-600">
              Enter your account balance, risk percentage, and stop loss to calculate your position size.
            </p>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <input
                id="balance"
                type="number"
                placeholder="Account Balance (USD)"
                className="rounded-xl border border-zinc-300 p-3"
              />
              <input
                id="risk"
                type="number"
                placeholder="Risk (%)"
                className="rounded-xl border border-zinc-300 p-3"
              />
              <input
                id="sl"
                type="number"
                placeholder="Stop Loss (pips)"
                className="rounded-xl border border-zinc-300 p-3"
              />
            </div>

            <button
              className="mt-4 rounded-xl bg-black text-white px-6 py-3"
              onClick={() => {
                const balance = parseFloat(document.getElementById("balance").value);
                const risk = parseFloat(document.getElementById("risk").value);
                const sl = parseFloat(document.getElementById("sl").value);

                if (isNaN(balance) || isNaN(risk) || isNaN(sl)) return;

                const riskAmount = balance * (risk / 100);
                const lotSize = riskAmount / (sl * 10); // simplified

                setResult(lotSize.toFixed(2));
              }}
            >
              Calculate
            </button>

            {result && (
              <div className="mt-4 rounded-xl border p-4 bg-white">
                <p>
                  <strong>Lot Size:</strong> {result} lots
                </p>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-zinc-950 mb-3">
              Formula
            </h2>
            <p className="text-zinc-600">
              Lot Size = Risk Amount ÷ (Stop Loss × Pip Value)
            </p>
          </Card>
<Card>
  <h2 className="text-xl font-bold text-zinc-950 mb-3">
    Example: How to Calculate Lot Size
  </h2>
  <p className="text-zinc-600">
    If your account balance is $1,000 and you risk 1% per trade, your risk amount is $10.
    With a stop loss of 50 pips, your lot size would be approximately 0.02 lots.
  </p>
</Card>
<Card>
  <h2 className="text-xl font-bold text-zinc-950 mb-3">
    Why Lot Size Is Important
  </h2>
  <p className="text-zinc-600">
    Using the correct lot size helps you control risk and avoid blowing your account.
    It is one of the most important concepts for forex beginners and prop firm traders.
  </p>
</Card>
        </article>
      </ContentPage>
    </>
  );
}
function InfoBlock({ title, children }) {
  return (
    <Card>
      <h2 className="text-2xl font-bold text-zinc-950">{title}</h2>
      <div className="mt-4 space-y-4 leading-7 text-zinc-600">{children}</div>
    </Card>
  );
}

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Forex, EA and prop firm risk tools for beginners."
        description="BytesTrade Risk Tools helps traders understand risk before testing an EA, joining a funded account challenge or trading with small capital."
      />
      <ContentPage>
        <InfoBlock title="What this website does">
          <p>
            BytesTrade Risk Tools provides simple calculators and educational content for forex traders who want to plan risk more carefully. The tools are designed for conservative EA testing, prop firm daily loss planning, drawdown awareness and small account risk control.
          </p>
          <p>
            This website is especially useful for beginners who want to understand numbers such as risk per trade, daily loss limit, maximum drawdown stop and suggested lot size before using automated trading.
          </p>
        </InfoBlock>

        <InfoBlock title="Who this website is for">
          <ul className="list-disc space-y-2 pl-5">
            <li>Beginners who want to test EA trading with demo or small capital first.</li>
            <li>Traders who want to calculate risk before placing trades.</li>
            <li>Prop firm challenge users who want to understand daily loss and max loss limits.</li>
            <li>Anyone who wants a more conservative way to think about automated trading risk.</li>
          </ul>
        </InfoBlock>

        <InfoBlock title="What this website does not do">
          <p>
            BytesTrade Risk Tools does not provide financial advice, investment advice, trading signals or profit guarantees. The calculators are for education and risk planning only. Forex and CFD trading involve risk, and losses may occur.
          </p>
        </InfoBlock>

        <div className="rounded-2xl bg-zinc-950 p-8 text-white">
          <h2 className="text-2xl font-bold">Want the conservative EA setup guide?</h2>
          <p className="mt-3 leading-7 text-zinc-300">
            Get the free setup guide for conservative EA demo testing and small capital risk planning.
          </p>
          <a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-950 hover:bg-zinc-200">
            Get Free Setup Guide
          </a>
        </div>
      </ContentPage>
    </>
  );
}

function PrivacyPolicyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy Policy"
        title="Privacy Policy"
        description="This page explains what information may be collected when you use BytesTrade Risk Tools."
      />
      <ContentPage>
        <InfoBlock title="Information we collect">
          <p>
            When you use our calculators, the numbers you enter are processed in your browser to show the result. We do not require an account to use the calculators.
          </p>
          <p>
            If you submit the setup guide form, we may collect the information you provide, such as your name, email address, WhatsApp number, country, trading experience and selected interest. This information is used to respond to your request and provide the guide or related follow-up.
          </p>
        </InfoBlock>

        <InfoBlock title="How information is stored">
          <p>
            Form submissions may be processed through third-party services such as Tally and Google Sheets. These tools help us receive and organize your request. Please review the privacy policies of those services if you want to understand how they handle data.
          </p>
        </InfoBlock>

        <InfoBlock title="Cookies, analytics and advertising">
          <p>
            This website may use basic cookies, analytics tools or advertising technologies in the future to understand website traffic, improve user experience and support free content. If Google AdSense or similar ad services are added, third-party vendors may use cookies to serve relevant ads.
          </p>
        </InfoBlock>

        <InfoBlock title="How we use your information">
          <ul className="list-disc space-y-2 pl-5">
            <li>To send or provide access to the requested EA setup guide.</li>
            <li>To respond to your questions or requests.</li>
            <li>To improve the website, calculators and educational content.</li>
            <li>To keep a record of form submissions and user interest.</li>
          </ul>
        </InfoBlock>

        <InfoBlock title="Your choice">
          <p>
            You can choose not to submit the form if you do not want to provide personal information. If you want your submitted information removed, please contact us through the contact page.
          </p>
        </InfoBlock>

        <InfoBlock title="Important note">
          <p>
            This privacy policy is a general template for this early website version and is not legal advice. If you plan to run paid ads, affiliate offers, AdSense or collect more user data, you should review this policy with a qualified professional.
          </p>
        </InfoBlock>
      </ContentPage>
    </>
  );
}

function DisclaimerPage() {
  return (
    <>
      <PageHero
        eyebrow="Disclaimer"
        title="Risk Disclaimer"
        description="Please read this page before using the calculators, guides or any EA-related content on this website."
      />
      <ContentPage>
        <InfoBlock title="Educational purpose only">
          <p>
            BytesTrade Risk Tools is provided for educational and risk-planning purposes only. The calculators, examples, guides and articles are not financial advice, investment advice, trading advice or a recommendation to buy, sell or trade any financial product.
          </p>
        </InfoBlock>

        <InfoBlock title="Forex and CFD trading risk">
          <p>
            Forex, CFD and leveraged trading involve significant risk. You can lose part or all of your capital. Automated trading systems, including Expert Advisors, can also lose money during poor market conditions, high spread, slippage, news events or unexpected volatility.
          </p>
        </InfoBlock>

        <InfoBlock title="No profit guarantee">
          <p>
            This website does not guarantee profit, fixed monthly returns, capital protection, low drawdown or successful funded account results. Past performance, backtests, demo results or calculator examples do not guarantee future results.
          </p>
        </InfoBlock>

        <InfoBlock title="EA and automated trading">
          <p>
            Any EA setup, risk setting or calculator result should be tested carefully on demo first. Always consider broker conditions, spread, commission, swap, slippage, minimum lot size, account type and your personal risk tolerance.
          </p>
        </InfoBlock>

        <InfoBlock title="Use at your own risk">
          <p>
            You are responsible for your own trading decisions. Do not trade with money you cannot afford to lose. If you are unsure, seek advice from a licensed financial professional in your jurisdiction.
          </p>
        </InfoBlock>
      </ContentPage>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact BytesTrade Risk Tools"
        description="Use the form below to request the conservative EA setup guide or ask about beginner-friendly risk planning."
      />
      <ContentPage>
        <div className="grid gap-6 md:grid-cols-[1fr_0.85fr]">
          <InfoBlock title="Get the setup guide">
      
             <p>
            The fastest way to get the setup guide is through the form below. After submitting the form, you can access the PDF guide directly.
            </p>
            
            <p className="mt-4">
        For general questions, you can also contact us directly at{" "}
        <a href="mailto:bytestrade@proton.me" className="font-semibold text-zinc-950 underline">
         bytestrade@proton.me
         </a>
          .
         </p>
            <a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800">
              Get Free PDF Guide
            </a>
          </InfoBlock>

          <InfoBlock title="Before contacting us">
            <ul className="list-disc space-y-2 pl-5">
              <li>This website does not provide guaranteed-profit EA claims.</li>
              <li>We focus on demo testing, conservative settings and risk awareness.</li>
              <li>Forex trading involves risk. Please only use money you can afford to lose.</li>
            </ul>
          </InfoBlock>
        </div>
      </ContentPage>
    </>
  );
}

function NotFoundPage() {
  return (
    <>
      <PageHero
        eyebrow="404"
        title="Page not found"
        description="The page you are looking for does not exist."
      />
      <ContentPage>
        <Card>
          <a href="/" className="font-semibold text-zinc-950 underline">Return to homepage</a>
        </Card>
      </ContentPage>
    </>
  );
}


function ArticlesPage() {
  return (
    <>
      <PageHero
        eyebrow="Forex • EA • Prop Firm Risk Guides"
        title="Forex Risk Management Guides"
        description="Learn how to calculate lot size, manage drawdown, understand risk reward ratio, and build safer forex risk habits before placing a trade."
      />

      <ContentPage>
        <div className="space-y-12">
          <Card>
            <h2 className="text-2xl font-bold text-zinc-950 mb-4">
              Forex Risk Management Guides
            </h2>
            <p className="text-zinc-600 leading-7">
              BytesTrade Risk Tools publishes practical guides for beginner forex
              traders, EA users and prop firm challenge participants. The goal is
              to help traders understand daily loss limits, max drawdown, lot size,
              risk per trade and conservative trading settings before using real money.
            </p>
          </Card>

          <section>
            <h2 className="text-2xl font-bold text-zinc-950 mb-5">
              Topics We Cover
            </h2>

            <div className="grid gap-5 md:grid-cols-3">
              <Card>
                <h3 className="text-xl font-bold text-zinc-950 mb-3">
                  Prop Firm Risk
                </h3>
                <p className="text-zinc-600 leading-7">
                  Learn how daily loss, max drawdown, floating loss and account
                  protection rules work in prop firm trading challenges.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-bold text-zinc-950 mb-3">
                  EA Risk Settings
                </h3>
                <p className="text-zinc-600 leading-7">
                  Understand conservative EA settings, smaller lot sizes, lower
                  risk per trade and why aggressive automation can damage accounts.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-bold text-zinc-950 mb-3">
                  Drawdown Control
                </h3>
                <p className="text-zinc-600 leading-7">
                  Learn how to reduce drawdown, avoid overtrading and protect
                  your trading account during volatile market conditions.
                </p>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-950 mb-5">
              Latest Forex Risk Guides
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {latestArticles.map((article) => (
                <Card key={article.slug}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                      PUBLISHED
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-zinc-950 mb-3">
                    <a href={`/articles/${article.slug}/`}>
                      {article.title}
                    </a>
                  </h3>

                  <p className="text-zinc-600 leading-7 mb-5">
                    {article.description}
                  </p>

                  <a
                    href={`/articles/${article.slug}/`}
                    className="font-semibold text-zinc-950 underline"
                  >
                    Read More
                  </a>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-950 mb-5">
              More Forex Risk Guides
            </h2>

            <div className="grid gap-5 md:grid-cols-2">
              {legacyArticles.map((article) => (
                <Card key={article.slug}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                      {article.status}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-zinc-950 mb-3">
                    <a href={`/articles/${article.slug}/`}>
                      {article.title}
                    </a>
                  </h3>

                  <p className="text-zinc-600 leading-7 mb-5">
                    {article.description}
                  </p>

                  <a
                    href={`/articles/${article.slug}/`}
                    className="font-semibold text-zinc-950 underline"
                  >
                    Read More
                  </a>
                </Card>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-zinc-950 mb-5">
              Forex Risk Management FAQ
            </h2>

            <div className="space-y-5">
              <Card>
                <h3 className="text-xl font-bold text-zinc-950 mb-2">
                  Why is risk management important in forex?
                </h3>
                <p className="text-zinc-600 leading-7">
                  Risk management helps traders protect their account from large
                  losses, emotional trading and sudden drawdown during volatile
                  market conditions.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-bold text-zinc-950 mb-2">
                  What is a safe risk per trade for beginners?
                </h3>
                <p className="text-zinc-600 leading-7">
                  Many conservative traders use 0.25% to 1% risk per trade,
                  especially when trading small accounts, testing an EA or joining
                  a prop firm challenge.
                </p>
              </Card>

              <Card>
                <h3 className="text-xl font-bold text-zinc-950 mb-2">
                  Are EA systems safe for prop firm accounts?
                </h3>
                <p className="text-zinc-600 leading-7">
                  EA systems can be used carefully, but traders must control lot
                  size, daily loss, max drawdown, news exposure and overtrading risk.
                </p>
              </Card>
</div>
          </section>
        </div>
      </ContentPage>
    </>
  );
}

function RiskPerTradeArticlePage() {
  return (
    <>
      <PageHero
        eyebrow="Forex Risk Management"
        title="What Is Risk per Trade in Forex?"
        description="Learn what risk per trade means, how to calculate it and why conservative risk settings are important for forex, EA and prop firm traders."
      />
      <ContentPage>
        <article className="space-y-6">
          <Card>
            <p className="leading-7 text-zinc-600">
              Risk per trade is one of the most important concepts in forex trading. It tells you how much of your account you are willing to lose if a single trade hits the stop loss.
            </p>
            <p className="mt-4 leading-7 text-zinc-600">
              Many beginners focus only on profit, entry signals, indicators or Expert Advisors. But before thinking about how much you can make, you should first understand how much you can lose.
            </p>
            <div className="mt-5 rounded-2xl bg-zinc-100 p-5 font-semibold text-zinc-950">
              Risk per trade = the maximum amount you are willing to lose on one trade.
            </div>
          </Card>

          <InfoBlock title="Why risk per trade matters">
            <p>
              Forex trading involves uncertainty. Even a good strategy can lose several trades in a row. If your risk is too high, a few losing trades can damage your account quickly. If your risk is controlled, you have more time to test, learn and improve.
            </p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr>
                    <th className="px-4 py-3">Account Balance</th>
                    <th className="px-4 py-3">Risk per Trade</th>
                    <th className="px-4 py-3">Amount at Risk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">USD100</td>
                    <td className="px-4 py-3">1%</td>
                    <td className="px-4 py-3">USD1</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">USD500</td>
                    <td className="px-4 py-3">1%</td>
                    <td className="px-4 py-3">USD5</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">USD1,000</td>
                    <td className="px-4 py-3">1%</td>
                    <td className="px-4 py-3">USD10</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">USD10,000</td>
                    <td className="px-4 py-3">1%</td>
                    <td className="px-4 py-3">USD100</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </InfoBlock>

          <InfoBlock title="How to calculate risk per trade">
            <p>The basic formula is:</p>
            <div className="rounded-2xl bg-zinc-100 p-5 font-semibold text-zinc-950">
              Account Balance × Risk Percentage = Risk Amount
            </div>
            <p>
              Example: USD500 × 1% = USD5. This means if the trade hits stop loss, the maximum planned loss should be around USD5.
            </p>
            <p>
              Another example: USD300 × 0.5% = USD1.50. This means the trader should set the lot size and stop loss so that the trade does not risk more than USD1.50.
            </p>
          </InfoBlock>

          <InfoBlock title="What is a conservative risk per trade?">
            <p>
              For beginners, a conservative risk setting is usually lower. A common conservative range is 0.25% to 0.5% per trade. This type of setting is slower, but it can reduce emotional pressure and help protect the account during testing.
            </p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr>
                    <th className="px-4 py-3">Account Balance</th>
                    <th className="px-4 py-3">0.25% Risk</th>
                    <th className="px-4 py-3">0.5% Risk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">USD100</td>
                    <td className="px-4 py-3">USD0.25</td>
                    <td className="px-4 py-3">USD0.50</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">USD300</td>
                    <td className="px-4 py-3">USD0.75</td>
                    <td className="px-4 py-3">USD1.50</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">USD500</td>
                    <td className="px-4 py-3">USD1.25</td>
                    <td className="px-4 py-3">USD2.50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </InfoBlock>

          <InfoBlock title="Risk per trade for EA trading">
            <p>
              EA trading does not remove risk. In fact, risk control can be even more important when using an Expert Advisor. An EA can open trades automatically based on its rules. If the EA has no proper risk limits, it may continue trading during bad market conditions.
            </p>
            <p>A conservative EA setup may include:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Risk per trade: 0.25% - 0.5%</li>
              <li>Max daily loss: 2%</li>
              <li>Max drawdown stop: 10%</li>
              <li>Max open trades: 1</li>
              <li>Spread filter, news filter and stop loss protection</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Risk per trade for prop firm challenges">
            <p>
              Risk per trade is also important for prop firm challenges. Many prop firms have daily loss limits, maximum overall drawdown rules and consistency requirements. If a trader risks too much per trade, it may be easy to break the daily loss or max loss rule.
            </p>
            <p>
              For example, if a funded challenge has a 5% daily loss limit and a trader risks 2% per trade, only a few losing trades can put the account near violation. A lower risk per trade, such as 0.5% to 1%, may give the trader more room to manage losses.
            </p>
          </InfoBlock>

          <InfoBlock title="Common beginner mistakes">
            <ul className="list-disc space-y-2 pl-5">
              <li>Risking too much per trade.</li>
              <li>Using lot size without calculation.</li>
              <li>Trading without stop loss.</li>
              <li>Letting an EA run without drawdown protection.</li>
              <li>Increasing lot size after losses.</li>
              <li>Using martingale or grid systems without understanding the risk.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Final thoughts">
            <p>
              Risk per trade is not about avoiding all losses. Losses are part of trading. The goal is to make sure that one losing trade, or even several losing trades, does not destroy your account.
            </p>
            <div className="rounded-2xl bg-zinc-100 p-5 font-semibold text-zinc-950">
              Do not ask how much you can make first. Ask how much you can afford to lose first.
            </div>
          </InfoBlock>

          <div className="rounded-2xl bg-zinc-950 p-8 text-white">
            <h2 className="text-2xl font-bold">Want to test EA trading with a conservative setup?</h2>
            <p className="mt-3 leading-7 text-zinc-300">
              Get the free Conservative EA Setup Guide and learn the basic risk settings for demo or small capital testing.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="/#ea-calculator" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-zinc-200">
                Use EA Calculator
              </a>
              <a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-zinc-600 px-6 py-3 text-center text-sm font-bold text-white hover:bg-zinc-900">
                Get Free Setup Guide
              </a>
            </div>
          </div>

          <LegacyArticleResources slug="what-is-risk-per-trade-in-forex" />
        </article>
      </ContentPage>
    </>
  );
}



function ConservativeEASettingsArticlePage() {
  return (
    <>
      <PageHero
        eyebrow="EA Risk Management"
        title="Conservative EA Settings for Small Accounts"
        description="Learn conservative EA settings for small forex accounts, including risk per trade, daily loss limits, drawdown stop, max open trades and demo testing tips."
      />
      <ContentPage>
        <article className="space-y-6">
          <Card>
          <h2 className="text-2xl font-bold text-zinc-950 mb-4">
          Quick Answer: Conservative EA Risk Settings
          </h2>
          <p className="leading-7 text-zinc-600">
          Conservative EA risk settings help protect small forex accounts by limiting risk per trade, reducing drawdown, and avoiding account blowouts. For most beginners, risking 0.5% to 1% per trade is safer than using aggressive lot sizes. A 50% account loss requires a 100% gain to recover, so keeping drawdown low is essential for long-term survival.
          </p>
          </Card>
          <Card>
          <h2 className="text-xl font-bold text-zinc-950 mb-4">
          Drawdown Recovery Table
           </h2>
          <ul className="text-zinc-600 leading-7 list-disc pl-5 space-y-2">
            <li>10% loss → need 11% gain</li>
           <li>20% loss → need 25% gain</li>
          <li>50% loss → need 100% gain</li>
           <li>80% loss → need 400% gain</li>
           </ul>
            </Card>
           <Card>
            <p className="leading-7 text-zinc-600">
              Running an Expert Advisor on a small forex account can be tempting. Many beginners want to start with USD100, USD300 or USD500 and let an EA trade automatically.
            </p>
            <p className="mt-4 leading-7 text-zinc-600">
              But before using any EA, it is important to understand one thing: a small account needs conservative risk settings. A small account has less room for mistakes. A few oversized trades, high spread, poor market conditions or repeated losses can damage the account quickly.
            </p>
            <p className="mt-4 leading-7 text-zinc-600">
              Forex trading is volatile and carries substantial risk. The CFTC warns that traders can lose money quickly when trading leveraged forex products. This article explains conservative EA settings for small accounts and why beginners should focus on risk control before profit.
            </p>
          </Card>

          <InfoBlock title="What is a small EA account?">
            <p>
              A small EA account usually means an account size such as USD100, USD300, USD500 or USD1,000. The smaller the account, the more careful the risk settings should be.
            </p>
            <p>
              For example, if your account is USD100, risking USD10 on one trade means you are risking 10% of your account. That is very aggressive. For conservative EA testing, the goal is not fast profit. The goal is to test the EA safely and understand how it behaves in real market conditions.
            </p>
          </InfoBlock>

          <InfoBlock title="Recommended conservative EA settings">
            <p>For a beginner or small account, a conservative EA setup may look like this:</p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <tbody>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3 font-semibold">Deposit</td><td className="px-4 py-3">USD100 - USD500</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3 font-semibold">Risk per trade</td><td className="px-4 py-3">0.25% - 0.5%</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3 font-semibold">Max daily loss</td><td className="px-4 py-3">2%</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3 font-semibold">Max drawdown stop</td><td className="px-4 py-3">10%</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3 font-semibold">Max open trades</td><td className="px-4 py-3">1</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3 font-semibold">Account type</td><td className="px-4 py-3">Cent or Micro account</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              These settings are not designed to grow the account quickly. They are designed to reduce damage during losing periods.
            </p>
          </InfoBlock>

          <InfoBlock title="1. Risk per trade: 0.25% - 0.5%">
            <p>
              Risk per trade is the amount you are willing to lose if one trade hits the stop loss. For small accounts, a conservative risk range is 0.25% to 0.5% per trade.
            </p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr><th className="px-4 py-3">Account Balance</th><th className="px-4 py-3">0.25% Risk</th><th className="px-4 py-3">0.5% Risk</th></tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD100</td><td className="px-4 py-3">USD0.25</td><td className="px-4 py-3">USD0.50</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD300</td><td className="px-4 py-3">USD0.75</td><td className="px-4 py-3">USD1.50</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD500</td><td className="px-4 py-3">USD1.25</td><td className="px-4 py-3">USD2.50</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              This may look very small, but that is the point. Small accounts need protection. An EA can experience losing streaks. If the EA risks too much per trade, the account can drop quickly before the trader understands what happened.
            </p>
          </InfoBlock>

          <InfoBlock title="2. Max daily loss: 2%">
            <p>
              A daily loss limit stops the EA from continuing to trade after a bad day. For conservative EA testing, a daily loss limit of 2% can help reduce overtrading.
            </p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr><th className="px-4 py-3">Account Balance</th><th className="px-4 py-3">2% Daily Loss Limit</th></tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD100</td><td className="px-4 py-3">USD2</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD300</td><td className="px-4 py-3">USD6</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD500</td><td className="px-4 py-3">USD10</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              If the EA reaches the daily loss limit, it should stop opening new trades for the day. This matters because market conditions can change, spread can widen, and news can create volatility.
            </p>
          </InfoBlock>

          <InfoBlock title="3. Max drawdown stop: 10%">
            <p>
              A maximum drawdown stop is a safety rule that stops the EA if the account drops too much. If the account equity falls by 10%, the EA should stop trading so the trader can review performance instead of letting the EA continue blindly.
            </p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr><th className="px-4 py-3">Account Balance</th><th className="px-4 py-3">Stop EA at 10% Drawdown</th></tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD100</td><td className="px-4 py-3">USD10 loss</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD300</td><td className="px-4 py-3">USD30 loss</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD500</td><td className="px-4 py-3">USD50 loss</td></tr>
                </tbody>
              </table>
            </div>
          </InfoBlock>

          <InfoBlock title="4. Max open trades: 1">
            <p>
              For conservative small account testing, the EA should not open too many trades at once. A safer setting is max open trades: 1. If the EA opens many trades at the same time, the total risk can become much larger than expected.
            </p>
            <p>
              For example, if each trade risks 0.5% and the EA opens 5 trades, the total exposure may become 2.5%. That may be too high for a small account.
            </p>
          </InfoBlock>

          <InfoBlock title="5. Use a cent or micro account">
            <p>
              Small accounts often work better with cent or micro accounts because standard accounts may have a minimum lot size that is too large for conservative risk. A cent account gives more flexibility because it allows smaller position sizing. This does not remove risk, but it can make conservative testing more realistic.
            </p>
          </InfoBlock>

          <InfoBlock title="6. Avoid martingale and unlimited grid">
            <p>
              Many beginners are attracted to EAs that show smooth profits. But some of these systems use martingale or grid logic. A martingale EA may increase lot size after a loss. A grid EA may open multiple trades as price moves against the position. These systems can look stable for a while, but they may create large drawdowns during strong trends or unexpected market moves.
            </p>
            <p>A conservative EA setup should avoid:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>No fixed stop loss.</li>
              <li>Unlimited grid.</li>
              <li>Lot size increasing after losses.</li>
              <li>No equity stop.</li>
              <li>No drawdown protection.</li>
              <li>High monthly return promises.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Example: USD300 conservative EA setup">
            <div className="rounded-2xl bg-zinc-100 p-5 text-zinc-700">
              <p><strong>Deposit:</strong> USD300</p>
              <p><strong>Risk per trade:</strong> 0.25% - 0.5%</p>
              <p><strong>Risk amount:</strong> USD0.75 - USD1.50</p>
              <p><strong>Max daily loss:</strong> 2% = USD6</p>
              <p><strong>Max drawdown stop:</strong> 10% = USD30</p>
              <p><strong>Max open trades:</strong> 1</p>
              <p><strong>Suggested account type:</strong> Cent or Micro</p>
              <p><strong>Testing period:</strong> 14 - 30 days demo first</p>
            </div>
          </InfoBlock>

          <InfoBlock title="Conservative EA settings checklist">
            <ul className="list-disc space-y-2 pl-5">
              <li>Risk per trade is 0.25% - 0.5%.</li>
              <li>Max daily loss is set.</li>
              <li>Max drawdown stop is set.</li>
              <li>Max open trades is limited.</li>
              <li>Stop loss is active.</li>
              <li>Spread filter is active.</li>
              <li>News filter is active.</li>
              <li>No martingale.</li>
              <li>No unlimited grid.</li>
              <li>Demo test is completed first.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Final thoughts">
            <p>
              Conservative EA settings are not exciting, but they are practical. A good small account EA setup should focus on risk control, drawdown protection, small lot size, demo testing and realistic expectations.
            </p>
            <div className="rounded-2xl bg-zinc-100 p-5 font-semibold text-zinc-950">
              If the account is small, the risk must be smaller.
            </div>
          </InfoBlock>

          <div className="rounded-2xl bg-zinc-950 p-8 text-white">
            <h2 className="text-2xl font-bold">Want to calculate your conservative EA risk settings?</h2>
            <p className="mt-3 leading-7 text-zinc-300">
              Use the free BytesTrade EA Calculator or download the Conservative EA Setup Guide for beginners.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="/#ea-calculator" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-zinc-200">
                Use EA Calculator
              </a>
              <a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-zinc-600 px-6 py-3 text-center text-sm font-bold text-white hover:bg-zinc-900">
                Get Free Setup Guide
              </a>
            </div>
          </div>

          <LegacyArticleResources slug="conservative-ea-settings-for-small-accounts" />
        </article>
      </ContentPage>
    </>
  );
}

function HalfPercentRiskArticlePage() {
  return (
    <>
      <PageHero
        eyebrow="EA Risk Management"
        title="Why 0.5% Risk Is Safer for EA Beginners"
        description="Learn why 0.5% risk per trade may be safer for EA beginners, especially when testing automated trading on small forex accounts."
      />
      <ContentPage>
        <article className="space-y-6">
          <Card>
            <p className="leading-7 text-zinc-600">
              Many beginners start EA trading because they want automation. The idea sounds attractive: install an Expert Advisor, let it trade automatically and reduce the need to watch charts all day.
            </p>
            <p className="mt-4 leading-7 text-zinc-600">
              But EA trading does not remove risk. In fact, automated trading can become dangerous if the risk setting is too high. An EA can open trades faster than a beginner can understand what is happening. This is why risk per trade is one of the most important settings for any EA user.
            </p>
            <p className="mt-4 leading-7 text-zinc-600">
              For beginners, a conservative risk setting such as 0.5% per trade may be safer than aggressive settings like 2%, 5% or fixed high lot sizes.
            </p>
          </Card>

          <InfoBlock title="What does 0.5% risk per trade mean?">
            <p>
              0.5% risk per trade means that each trade risks only half of one percent of the account balance. If you have a USD500 account and the EA risks 0.5% per trade, the planned loss on one trade should be around USD2.50 if the stop loss is hit.
            </p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr><th className="px-4 py-3">Account Balance</th><th className="px-4 py-3">0.5% Risk Per Trade</th></tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD100</td><td className="px-4 py-3">USD0.50</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD300</td><td className="px-4 py-3">USD1.50</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD500</td><td className="px-4 py-3">USD2.50</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD1,000</td><td className="px-4 py-3">USD5.00</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">USD10,000</td><td className="px-4 py-3">USD50.00</td></tr>
                </tbody>
              </table>
            </div>
            <p>
              This may look small, but that is the purpose of conservative risk control. The goal is not to get rich quickly. The goal is to survive long enough to test the EA properly.
            </p>
          </InfoBlock>

          <InfoBlock title="Why beginners should avoid high risk">
            <p>
              Many beginners think a small account needs high risk to grow faster. This thinking is dangerous. Small accounts are already fragile. If the risk is too high, a few losing trades can damage the account quickly.
            </p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr><th className="px-4 py-3">Risk Per Trade</th><th className="px-4 py-3">Loss After 5 Losing Trades on USD500</th></tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">0.5%</td><td className="px-4 py-3">Around USD12.50</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">2%</td><td className="px-4 py-3">Around USD50</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">5%</td><td className="px-4 py-3">Around USD125</td></tr>
                  <tr className="border-t border-zinc-200"><td className="px-4 py-3">10%</td><td className="px-4 py-3">Around USD250</td></tr>
                </tbody>
              </table>
            </div>
          </InfoBlock>

          <InfoBlock title="EA trading can lose several trades in a row">
            <p>
              Every trading system can have losing streaks. Even if an EA looks profitable in a backtest, it can still lose several trades in a row in live or demo conditions.
            </p>
            <p>Reasons include:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Market conditions change.</li>
              <li>Spread becomes wider.</li>
              <li>Slippage happens.</li>
              <li>News creates sudden volatility.</li>
              <li>Broker execution differs.</li>
              <li>The strategy enters a bad cycle.</li>
            </ul>
            <p>
              If the EA risks 5% per trade, a short losing streak can become serious. If the EA risks 0.5% per trade, the same losing streak is much easier to survive.
            </p>
          </InfoBlock>

          <InfoBlock title="0.5% risk helps reduce emotional pressure">
            <p>
              Trading psychology matters, even when using an EA. A beginner may believe that automation removes emotion, but once real money is involved, emotions still appear.
            </p>
            <p>When the EA loses money, the user may feel fear, regret, impatience, doubt and pressure to recover quickly. A lower risk setting can reduce emotional pressure.</p>
          </InfoBlock>

          <InfoBlock title="0.5% risk is better for demo testing">
            <p>
              Before using a live account, beginners should test the EA on demo first. But demo testing should still use realistic risk settings. Testing an EA on demo with very high risk may not show whether the EA is suitable for cautious users.
            </p>
            <div className="rounded-2xl bg-zinc-100 p-5 text-zinc-700">
              <p><strong>Demo account:</strong> USD500</p>
              <p><strong>Risk setting:</strong> 0.5% per trade</p>
              <p><strong>Max daily loss:</strong> 2%</p>
              <p><strong>Max drawdown stop:</strong> 10%</p>
              <p><strong>Max open trades:</strong> 1</p>
            </div>
          </InfoBlock>

          <InfoBlock title="0.5% risk and daily loss limit">
            <p>
              Risk per trade is only one part of EA risk management. A beginner should also use a daily loss limit. A conservative setup may look like risk per trade: 0.5%, max daily loss: 2%, max drawdown stop: 10% and max open trades: 1.
            </p>
            <p>
              With a USD500 account, 0.5% risk per trade equals USD2.50, and a 2% daily loss limit equals USD10. This means the EA should stop for the day if total loss reaches around USD10.
            </p>
          </InfoBlock>

          <InfoBlock title="Why 0.5% is safer than fixed lot size">
            <p>
              Many beginners use fixed lot size because it feels simple. For example, they may say: I will just use 0.01 lot. But fixed lot size can be risky because it does not consider account balance, stop loss distance, currency pair, pip value, broker contract size or risk percentage.
            </p>
            <p>
              A 0.5% risk setting is better because it is based on the account size and stop loss. Instead of asking what lot size should I use, a better question is: how much am I willing to risk if this trade loses?
            </p>
          </InfoBlock>

          <InfoBlock title="When 0.5% risk may still be too high">
            <p>Even 0.5% may be too high in some cases:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>The EA opens many trades at once.</li>
              <li>The EA uses martingale.</li>
              <li>The EA uses grid recovery.</li>
              <li>There is no stop loss.</li>
              <li>The spread is too high.</li>
              <li>The account is very small.</li>
              <li>The broker minimum lot size is too large.</li>
            </ul>
            <p>
              Risk per trade is important, but it must work together with max open trades, max lot size, daily loss limit, max drawdown stop, news protection and spread filters.
            </p>
          </InfoBlock>

          <InfoBlock title="Example: USD300 EA beginner setup">
            <div className="rounded-2xl bg-zinc-100 p-5 text-zinc-700">
              <p><strong>Deposit:</strong> USD300</p>
              <p><strong>Risk per trade:</strong> 0.5%</p>
              <p><strong>Risk amount per trade:</strong> USD1.50</p>
              <p><strong>Max daily loss:</strong> 2% = USD6</p>
              <p><strong>Max drawdown stop:</strong> 10% = USD30</p>
              <p><strong>Max open trades:</strong> 1</p>
              <p><strong>Suggested account:</strong> Cent or Micro</p>
              <p><strong>Testing period:</strong> 14 - 30 days demo first</p>
            </div>
          </InfoBlock>

          <InfoBlock title="Checklist before using 0.5% risk on an EA">
            <ul className="list-disc space-y-2 pl-5">
              <li>Does the EA use a real stop loss?</li>
              <li>Can the EA calculate lot size by risk percentage?</li>
              <li>Can you limit maximum open trades?</li>
              <li>Can you set daily loss limit?</li>
              <li>Can you set maximum drawdown stop?</li>
              <li>Is there a spread filter?</li>
              <li>Is there a news filter?</li>
              <li>Does the EA avoid martingale?</li>
              <li>Does the EA avoid unlimited grid?</li>
              <li>Have you tested on demo first?</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Final thoughts">
            <p>
              0.5% risk per trade is safer for EA beginners because it slows down the damage. It gives the trader time to observe, test and understand the EA. It also reduces emotional pressure and helps protect small accounts from fast drawdown.
            </p>
            <div className="rounded-2xl bg-zinc-100 p-5 font-semibold text-zinc-950">
              If you are new to EA trading, risk small first.
            </div>
          </InfoBlock>

          <div className="rounded-2xl bg-zinc-950 p-8 text-white">
            <h2 className="text-2xl font-bold">Want to calculate your EA risk before trading?</h2>
            <p className="mt-3 leading-7 text-zinc-300">
              Use the free BytesTrade EA Calculator or download the Conservative EA Setup Guide for beginners.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="/#ea-calculator" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-zinc-200">
                Use EA Calculator
              </a>
              <a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-zinc-600 px-6 py-3 text-center text-sm font-bold text-white hover:bg-zinc-900">
                Get Free Setup Guide
              </a>
            </div>
          </div>

          <LegacyArticleResources slug="why-0-5-risk-is-safer-for-ea-beginners" />
        </article>
      </ContentPage>
    </>
  );
}



function PropFirmDailyLossArticlePage() {
  return (
    <>
      <PageHero
        eyebrow="Prop Firm Risk Management"
        title="Prop Firm Daily Loss and Max Drawdown Explained"
        description="Understand the difference between daily loss limit and maximum drawdown, and learn how to plan risk before taking a funded account challenge."
      />
      <ContentPage>
        <article className="space-y-6">
          <Card>
            <p className="leading-7 text-zinc-600">
              Prop firm challenges can look attractive because traders can access a larger simulated or funded account without depositing the full account size. But the account size is only one part of the story. The most important part is understanding the risk rules.
            </p>
            <p className="mt-4 leading-7 text-zinc-600">
              Two of the most important rules are usually called daily loss limit and maximum drawdown. These rules are designed to control how much the account can lose in a day and how much it can lose overall.
            </p>
            <p className="mt-4 leading-7 text-zinc-600">
              If a trader does not understand these rules, one bad trading day can violate the challenge even before the strategy has enough time to prove itself.
            </p>
          </Card>

          <InfoBlock title="What is a daily loss limit?">
            <p>
              A daily loss limit is the maximum amount your account is allowed to lose within one trading day. In many prop firm programs, this can include both closed losses and floating losses from open trades.
            </p>
            <p>
              For example, if a USD10,000 challenge has a 5% daily loss limit, the daily loss amount may be USD500. If your account equity drops below the allowed daily limit, the account may violate the rule.
            </p>
            <div className="rounded-2xl bg-zinc-100 p-5 text-zinc-700">
              <p><strong>Example:</strong> USD10,000 account</p>
              <p><strong>Daily loss limit:</strong> 5%</p>
              <p><strong>Maximum allowed daily loss:</strong> USD500</p>
            </div>
            <p>
              Always check the official rules of the prop firm you are using. Some firms calculate daily loss from the starting balance of the day, while others may use starting equity, previous day balance, or another rule.
            </p>
          </InfoBlock>

          <InfoBlock title="What is maximum drawdown or maximum loss?">
            <p>
              Maximum drawdown, also called maximum loss, is the total loss limit for the account. It is usually larger than the daily loss limit, but it applies across the full challenge or funded account period.
            </p>
            <p>
              For example, if a USD10,000 account has a 10% maximum loss rule, the account may not be allowed to drop below USD9,000 equity or balance depending on the firm’s rule.
            </p>
            <div className="rounded-2xl bg-zinc-100 p-5 text-zinc-700">
              <p><strong>Example:</strong> USD10,000 account</p>
              <p><strong>Maximum loss:</strong> 10%</p>
              <p><strong>Maximum allowed total loss:</strong> USD1,000</p>
              <p><strong>Possible account stop level:</strong> USD9,000</p>
            </div>
          </InfoBlock>

          <InfoBlock title="Daily loss vs maximum drawdown">
            <p>
              The daily loss limit controls one trading day. The maximum drawdown controls the full account. A trader must respect both at the same time.
            </p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr>
                    <th className="px-4 py-3">Rule</th>
                    <th className="px-4 py-3">Meaning</th>
                    <th className="px-4 py-3">Example on USD10,000</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3 font-semibold">Daily loss limit</td>
                    <td className="px-4 py-3">Maximum loss allowed in one trading day</td>
                    <td className="px-4 py-3">5% = USD500</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3 font-semibold">Maximum drawdown</td>
                    <td className="px-4 py-3">Maximum total loss allowed on the account</td>
                    <td className="px-4 py-3">10% = USD1,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              A trader can violate the daily loss limit even if the maximum drawdown is not reached. A trader can also violate the maximum drawdown even if the daily loss limit is not broken on that specific day.
            </p>
          </InfoBlock>

          <InfoBlock title="Why prop firm traders must calculate risk before trading">
            <p>
              Many traders fail challenges not because every trade is bad, but because the risk per trade is too large compared with the allowed loss limits.
            </p>
            <p>
              If a trader risks 2% per trade on an account with a 5% daily loss limit, only a few losing trades can put the account near violation. If the trader risks 0.5% to 1% per trade, there is more room to manage losses.
            </p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr>
                    <th className="px-4 py-3">Risk per Trade</th>
                    <th className="px-4 py-3">Loss Amount on USD10,000</th>
                    <th className="px-4 py-3">Losing Trades Before USD500 Daily Limit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">0.5%</td>
                    <td className="px-4 py-3">USD50</td>
                    <td className="px-4 py-3">About 10 trades</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">1%</td>
                    <td className="px-4 py-3">USD100</td>
                    <td className="px-4 py-3">About 5 trades</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">2%</td>
                    <td className="px-4 py-3">USD200</td>
                    <td className="px-4 py-3">About 2 trades</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              These are simple examples. Real results can be affected by spread, slippage, commissions, swaps and floating losses.
            </p>
          </InfoBlock>

          <InfoBlock title="Example: USD10,000 prop firm challenge">
            <p>Here is a simple planning example:</p>
            <div className="rounded-2xl bg-zinc-100 p-5 text-zinc-700">
              <p><strong>Account size:</strong> USD10,000</p>
              <p><strong>Daily loss limit:</strong> 5% = USD500</p>
              <p><strong>Maximum drawdown:</strong> 10% = USD1,000</p>
              <p><strong>Conservative risk per trade:</strong> 0.5% = USD50</p>
              <p><strong>Max suggested trades per day:</strong> 2 - 4 losing trades before stopping manually</p>
            </div>
            <p>
              A conservative trader may choose to stop for the day after losing 2% to 3%, even if the official daily limit is 5%. This creates a safety buffer and reduces the chance of accidental violation.
            </p>
          </InfoBlock>

          <InfoBlock title="Why a safety buffer matters">
            <p>
              Some traders trade until they are very close to the daily loss limit. This is risky. Spread, slippage or a floating loss can push the account past the limit.
            </p>
            <p>
              A safety buffer means stopping before the official limit. For example, if the official daily loss is 5%, a trader may set a personal stop at 2% or 3%.
            </p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr>
                    <th className="px-4 py-3">Official Limit</th>
                    <th className="px-4 py-3">Personal Stop</th>
                    <th className="px-4 py-3">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">5% daily loss</td>
                    <td className="px-4 py-3">2% - 3%</td>
                    <td className="px-4 py-3">Avoid getting too close to violation</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">10% max drawdown</td>
                    <td className="px-4 py-3">6% - 8%</td>
                    <td className="px-4 py-3">Pause and review before deeper drawdown</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </InfoBlock>

          <InfoBlock title="Common daily loss mistakes">
            <ul className="list-disc space-y-2 pl-5">
              <li>Only checking closed trades and ignoring floating loss.</li>
              <li>Opening too many trades at the same time.</li>
              <li>Trading during news without understanding volatility.</li>
              <li>Increasing lot size after losses.</li>
              <li>Thinking the daily loss limit is the amount you should use every day.</li>
              <li>Not knowing when the prop firm resets the daily calculation.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Common maximum drawdown mistakes">
            <ul className="list-disc space-y-2 pl-5">
              <li>Confusing daily loss with total max loss.</li>
              <li>Assuming profit always increases the drawdown limit.</li>
              <li>Not checking whether the firm uses balance, equity or trailing drawdown.</li>
              <li>Using one large trade that risks too much of the account.</li>
              <li>Letting an EA run without an equity stop.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="How EA traders should handle prop firm limits">
            <p>
              EA traders must be extra careful with prop firm rules because the EA can continue opening trades automatically. Before running an EA on a challenge, check whether the EA can control risk properly.
            </p>
            <p>A safer EA setup for prop firm testing may include:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Risk per trade: 0.25% - 0.5% for conservative testing.</li>
              <li>Max daily loss: lower than the official daily limit.</li>
              <li>Max drawdown stop: lower than the official maximum loss.</li>
              <li>Max open trades: limited.</li>
              <li>No martingale or unlimited grid.</li>
              <li>Spread filter and news filter.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Simple prop firm risk checklist">
            <ul className="list-disc space-y-2 pl-5">
              <li>Do you know the daily loss limit?</li>
              <li>Do you know whether floating loss counts?</li>
              <li>Do you know the maximum drawdown rule?</li>
              <li>Do you know the reset time for daily loss?</li>
              <li>Do you have a personal stop before the official limit?</li>
              <li>Do you know your risk amount per trade?</li>
              <li>Do you limit open trades?</li>
              <li>Does your EA have an equity stop?</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Final thoughts">
            <p>
              Prop firm trading is not only about reaching the profit target. It is also about staying within the rules long enough to complete the challenge. Daily loss and maximum drawdown are two rules every trader should understand before placing the first trade.
            </p>
            <div className="rounded-2xl bg-zinc-100 p-5 font-semibold text-zinc-950">
              A good prop firm trader does not only plan profit. A good prop firm trader plans the maximum acceptable loss first.
            </div>
          </InfoBlock>

          <div className="rounded-2xl bg-zinc-950 p-8 text-white">
            <h2 className="text-2xl font-bold">Want to calculate your prop firm risk?</h2>
            <p className="mt-3 leading-7 text-zinc-300">
              Use the free Prop Firm Risk Calculator or download the Conservative EA Setup Guide for beginners.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="/#prop-firm" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-zinc-200">
                Use Prop Firm Calculator
              </a>
              <a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-zinc-600 px-6 py-3 text-center text-sm font-bold text-white hover:bg-zinc-900">
                Get Free Setup Guide
              </a>
            </div>
          </div>

          <LegacyArticleResources slug="prop-firm-daily-loss-and-max-drawdown-explained" />
        </article>
      </ContentPage>
    </>
  );
}



function MartingaleEAArticlePage() {
  return (
    <>
      <PageHero
        eyebrow="EA Risk Management"
        title="Why Martingale EA Is Dangerous for Beginners"
        description="Learn why martingale EAs can look stable at first but may create large drawdowns when the market moves strongly against the strategy."
      />
      <ContentPage>
        <article className="space-y-6">
          <Card>
            <p className="leading-7 text-zinc-600">
              Many beginner traders are attracted to martingale EAs because the results can look smooth in the beginning. The EA may show many small profits, very few losing days and a balance curve that looks easy to trust.
            </p>
            <p className="mt-4 leading-7 text-zinc-600">
              But the danger is often hidden. A martingale EA usually increases lot size after a losing trade or when price moves against the position. This can make losses grow faster than beginners expect.
            </p>
            <p className="mt-4 leading-7 text-zinc-600">
              The biggest risk is not one small losing trade. The biggest risk is a losing cycle that keeps getting larger until the account reaches a deep drawdown or margin problem.
            </p>
          </Card>

          <InfoBlock title="What is a martingale EA?">
            <p>
              A martingale EA is an automated trading system that increases position size after a loss or after price moves against the previous entry. The idea is that if the market eventually reverses, the larger trade may recover previous losses and close the basket in profit.
            </p>
            <p>
              The problem is that markets do not always reverse quickly. When price keeps moving in one direction, the EA may keep adding larger positions. This can cause the floating loss, margin usage and emotional pressure to grow very quickly.
            </p>
            <div className="rounded-2xl bg-zinc-100 p-5 text-zinc-700">
              <p><strong>Simple example:</strong></p>
              <p>Trade 1: 0.01 lot</p>
              <p>Trade 2: 0.02 lot</p>
              <p>Trade 3: 0.04 lot</p>
              <p>Trade 4: 0.08 lot</p>
              <p>Trade 5: 0.16 lot</p>
            </div>
            <p>
              The lot size may look small at first, but it can grow rapidly after several losing steps.
            </p>
          </InfoBlock>

          <InfoBlock title="Why martingale can look safe at first">
            <p>
              Martingale systems can look attractive because they often close many small profits. If the market moves back quickly, the EA may recover the basket and show a winning result.
            </p>
            <p>
              This can create a false sense of safety. The trader may see many profitable days and think the EA is stable. But the real risk is usually waiting inside a larger losing cycle.
            </p>
            <p>
              A martingale EA may have a high win rate, but high win rate does not automatically mean low risk. The account can still suffer a large drawdown when one cycle goes wrong.
            </p>
          </InfoBlock>

          <InfoBlock title="The main danger: lot size grows after losses">
            <p>
              In normal conservative trading, risk per trade is usually controlled. For example, a beginner may risk 0.5% per trade and stop trading after a daily loss limit.
            </p>
            <p>
              In martingale trading, the risk can grow after losses. This is dangerous because the trader is increasing exposure when the market has already moved against the strategy.
            </p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr>
                    <th className="px-4 py-3">Step</th>
                    <th className="px-4 py-3">Lot Size</th>
                    <th className="px-4 py-3">Risk Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">1</td>
                    <td className="px-4 py-3">0.01</td>
                    <td className="px-4 py-3">Looks small</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">2</td>
                    <td className="px-4 py-3">0.02</td>
                    <td className="px-4 py-3">Risk doubles</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">3</td>
                    <td className="px-4 py-3">0.04</td>
                    <td className="px-4 py-3">Exposure grows</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">4</td>
                    <td className="px-4 py-3">0.08</td>
                    <td className="px-4 py-3">Drawdown becomes heavier</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3">5</td>
                    <td className="px-4 py-3">0.16</td>
                    <td className="px-4 py-3">Small account may be stressed</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </InfoBlock>

          <InfoBlock title="Why small accounts are especially vulnerable">
            <p>
              Small accounts have less margin and less room to survive a long losing cycle. If the EA keeps increasing lot size, the floating loss can become too large for the account.
            </p>
            <p>
              For example, a USD100 or USD300 account may not be able to handle many martingale steps, especially if the broker has a minimum lot size or high spread.
            </p>
            <p>
              This is why beginners with small accounts should be careful with any EA that increases lot size after a loss.
            </p>
          </InfoBlock>

          <InfoBlock title="Martingale and grid can become even riskier together">
            <p>
              Some EAs combine martingale and grid logic. A grid EA may open more trades as price moves against the position. A martingale EA may increase lot size after losses. When both are combined, the account can carry many trades with growing lot size.
            </p>
            <p>
              This can make the balance curve look smooth during normal market conditions, but dangerous during strong trends, news volatility or long one-direction movement.
            </p>
            <div className="rounded-2xl bg-zinc-100 p-5 text-zinc-700">
              <p><strong>Warning signs:</strong></p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Many open trades in the same direction.</li>
                <li>Lot size increases after price moves against the basket.</li>
                <li>No clear stop loss.</li>
                <li>Profit target is small but floating loss can become large.</li>
                <li>Backtest looks smooth but drawdown becomes deep during trends.</li>
              </ul>
            </div>
          </InfoBlock>

          <InfoBlock title="High win rate does not mean low risk">
            <p>
              Beginners often trust an EA because it shows a high win rate. But a high win rate can be misleading if the losing trades are much larger than the winning trades.
            </p>
            <p>
              A martingale EA may close many small profits and then suffer one very large floating loss. This means the win rate looks good, but the risk profile may still be dangerous.
            </p>
            <p>
              Instead of looking only at win rate, traders should also check maximum drawdown, floating loss, lot size growth, number of open trades and whether there is a real stop-loss plan.
            </p>
          </InfoBlock>

          <InfoBlock title="Backtests can hide the real stress">
            <p>
              Backtests are useful, but they are not enough. A martingale EA can look good in a backtest if the historical period did not contain a market movement that breaks the system.
            </p>
            <p>
              Real trading can include spread widening, slippage, news spikes, broker execution differences and gaps. These conditions can make martingale exposure more dangerous.
            </p>
            <p>
              A beginner should not rely only on a backtest screenshot. Forward testing on demo and small live testing with strict risk limits is much safer.
            </p>
          </InfoBlock>

          <InfoBlock title="Questions to ask before using a martingale EA">
            <ul className="list-disc space-y-2 pl-5">
              <li>Does the EA increase lot size after a loss?</li>
              <li>How many maximum steps can it open?</li>
              <li>What is the maximum lot size?</li>
              <li>Does it have an equity stop?</li>
              <li>Does it close all trades at a maximum drawdown level?</li>
              <li>Does it use a real stop loss?</li>
              <li>How deep was the maximum drawdown in forward testing?</li>
              <li>What happens during strong trend markets?</li>
              <li>Can the EA survive high spread and news volatility?</li>
              <li>Is the strategy suitable for small accounts?</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Safer alternatives for beginners">
            <p>
              Beginners who want to test EA trading may consider a more conservative setup instead of martingale logic. The goal should be risk control first, not fast profit.
            </p>
            <p>A conservative EA setup may include:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Risk per trade: 0.25% - 0.5%.</li>
              <li>Max daily loss: 2%.</li>
              <li>Max drawdown stop: 10%.</li>
              <li>Max open trades: 1.</li>
              <li>No martingale.</li>
              <li>No unlimited grid.</li>
              <li>Spread filter and news filter.</li>
              <li>Demo testing before live trading.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Example: why fixed low risk is easier to understand">
            <p>
              If a trader uses 0.5% risk per trade, the risk amount is clear before the trade opens. For a USD500 account, 0.5% risk means around USD2.50 per trade.
            </p>
            <p>
              With martingale, the first trade may look small, but the risk can grow after each losing step. This makes it harder for beginners to understand the real account exposure.
            </p>
            <div className="overflow-auto rounded-2xl border border-zinc-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-zinc-100 text-zinc-600">
                  <tr>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Risk Behavior</th>
                    <th className="px-4 py-3">Beginner Suitability</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3 font-semibold">Fixed low risk</td>
                    <td className="px-4 py-3">Risk is planned before trade</td>
                    <td className="px-4 py-3">Easier to understand</td>
                  </tr>
                  <tr className="border-t border-zinc-200">
                    <td className="px-4 py-3 font-semibold">Martingale</td>
                    <td className="px-4 py-3">Risk increases after losses</td>
                    <td className="px-4 py-3">Harder and riskier</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </InfoBlock>

          <InfoBlock title="Common beginner mistakes">
            <ul className="list-disc space-y-2 pl-5">
              <li>Choosing an EA only because the profit curve looks smooth.</li>
              <li>Ignoring floating drawdown.</li>
              <li>Believing high win rate means low risk.</li>
              <li>Using martingale on a small account.</li>
              <li>Not checking maximum lot size and maximum steps.</li>
              <li>Running the EA during news without protection.</li>
              <li>Turning off equity stop to wait for recovery.</li>
              <li>Adding more deposit to save a losing basket without understanding the risk.</li>
            </ul>
          </InfoBlock>

          <InfoBlock title="Final thoughts">
            <p>
              Martingale EAs are dangerous for beginners because the risk can grow after losses. The system may look stable during normal market conditions, but one long losing cycle can create deep drawdown.
            </p>
            <p>
              Beginners should focus on simple, transparent and conservative risk settings before testing any automated trading system.
            </p>
            <div className="rounded-2xl bg-zinc-100 p-5 font-semibold text-zinc-950">
              If an EA needs bigger lot size to recover losses, understand the risk before you trust the profit curve.
            </div>
          </InfoBlock>

          <div className="rounded-2xl bg-zinc-950 p-8 text-white">
            <h2 className="text-2xl font-bold">Want to test EA trading with safer risk settings?</h2>
            <p className="mt-3 leading-7 text-zinc-300">
              Use the free BytesTrade EA Calculator or download the Conservative EA Setup Guide for beginners.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a href="/#ea-calculator" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-zinc-200">
                Use EA Calculator
              </a>
              <a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-zinc-600 px-6 py-3 text-center text-sm font-bold text-white hover:bg-zinc-900">
                Get Free Setup Guide
              </a>
            </div>
          </div>

          <LegacyArticleResources slug="why-martingale-ea-is-dangerous-for-beginners" />
        </article>
      </ContentPage>
    </>
  );
}



function LegacyArticleResources({ slug }) {
  const related = filteredRelatedAll(slug).slice(0, 6);
  return (
    <>
      <Card>
        <h2 className="text-2xl font-bold text-zinc-950">Related articles</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-zinc-700">
          {related.map((item) => (
            <li key={item.slug}><a className="underline" href={`/articles/${item.slug}`}>{item.title}</a></li>
          ))}
        </ul>
      </Card>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-7 text-zinc-600">
        <strong className="text-zinc-950">Risk Disclaimer:</strong> Forex and CFD trading involve risk and may not be suitable for all investors. This article is for educational purposes only and is not financial advice.
      </div>
    </>
  );
}

function ForexMarketHoursPage() {
  const sessions = [
    {
      name: "Sydney Session",
      local: "Approx. 5:00 AM - 2:00 PM Malaysia Time",
      focus: "Early Asia-Pacific movement",
      note: "Usually quieter than London and New York. Spreads can be wider at the start of the trading week.",
    },
    {
      name: "Tokyo Session",
      local: "Approx. 7:00 AM - 4:00 PM Malaysia Time",
      focus: "Asia session liquidity",
      note: "Often watched for JPY pairs and early Asian market direction.",
    },
    {
      name: "London Session",
      local: "Approx. 3:00 PM - 12:00 AM Malaysia Time",
      focus: "High liquidity and volatility",
      note: "One of the most active sessions. Many traders watch EUR, GBP and USD pairs during this time.",
    },
    {
      name: "New York Session",
      local: "Approx. 8:00 PM - 5:00 AM Malaysia Time",
      focus: "US session movement",
      note: "Often active during US news releases and London-New York overlap.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Forex Market Hours"
        title="Forex Market Hours & Trading Session Clock"
        description="A beginner-friendly guide to forex market sessions, Malaysia time reference, EA trading time reminders and session risk planning."
      />
      <ContentPage>
        <div className="grid gap-6 md:grid-cols-[1fr_0.85fr]">
          <Card>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Malaysia Time Reference</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-zinc-950">Plan your trades around market sessions.</h2>
            <p className="mt-4 leading-7 text-zinc-600">
              The forex market is commonly described as a 24-hour market during weekdays because trading activity moves across major financial centers such as Sydney, Tokyo, London and New York.
            </p>
            <p className="mt-4 leading-7 text-zinc-600">
              The times below are approximate Malaysia Time references. Actual trading conditions may vary because of daylight saving time, broker server time, holidays, liquidity and news events.
            </p>
          </Card>

          <Card className="bg-zinc-950 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">Important Reminder</p>
            <h2 className="mt-3 text-2xl font-bold">Session time is not a profit signal.</h2>
            <p className="mt-4 leading-7 text-zinc-300">
              A market session can show when liquidity may be higher, but it does not guarantee direction, profit or lower risk. Always use risk control, especially when testing an EA.
            </p>
            <a href="/#ea-calculator" className="mt-6 inline-flex rounded-full bg-white px-6 py-3 text-sm font-bold text-zinc-950 hover:bg-zinc-200">
              Use EA Risk Calculator
            </a>
          </Card>
        </div>

        <InfoBlock title="Forex session times in Malaysia">
          <p>
            These session times are simplified references for traders in Malaysia. Because daylight saving time changes in some countries, session overlap can shift during the year.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {sessions.map((session) => (
              <div key={session.name} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <h3 className="text-xl font-bold text-zinc-950">{session.name}</h3>
                <p className="mt-2 font-semibold text-zinc-700">{session.local}</p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.15em] text-zinc-500">{session.focus}</p>
                <p className="mt-3 leading-7 text-zinc-600">{session.note}</p>
              </div>
            ))}
          </div>
        </InfoBlock>

        <InfoBlock title="Best session for EA testing">
          <p>
            There is no single best session for every EA. Different strategies behave differently. A breakout EA may prefer high liquidity periods, while a low-volatility strategy may prefer quieter periods.
          </p>
          <p>
            For beginners, the most important step is to test the EA on demo first and record how it behaves in each session.
          </p>
          <div className="overflow-auto rounded-2xl border border-zinc-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-100 text-zinc-600">
                <tr>
                  <th className="px-4 py-3">Session</th>
                  <th className="px-4 py-3">Common Characteristic</th>
                  <th className="px-4 py-3">EA Testing Reminder</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-zinc-200">
                  <td className="px-4 py-3 font-semibold">Asian Session</td>
                  <td className="px-4 py-3">Often calmer than London/New York</td>
                  <td className="px-4 py-3">Watch spread and low-liquidity conditions</td>
                </tr>
                <tr className="border-t border-zinc-200">
                  <td className="px-4 py-3 font-semibold">London Session</td>
                  <td className="px-4 py-3">Often high activity</td>
                  <td className="px-4 py-3">Check volatility and breakout behavior</td>
                </tr>
                <tr className="border-t border-zinc-200">
                  <td className="px-4 py-3 font-semibold">New York Session</td>
                  <td className="px-4 py-3">Often affected by US news</td>
                  <td className="px-4 py-3">Use news filter and risk limits</td>
                </tr>
                <tr className="border-t border-zinc-200">
                  <td className="px-4 py-3 font-semibold">London-New York Overlap</td>
                  <td className="px-4 py-3">Often high liquidity and movement</td>
                  <td className="px-4 py-3">Good for testing, but risk can increase</td>
                </tr>
              </tbody>
            </table>
          </div>
        </InfoBlock>

        <InfoBlock title="Forex market hours and risk management">
          <p>
            Time matters because spread, volatility and liquidity can change across the day. An EA that performs normally during one session may behave differently during another session.
          </p>
          <p>Before running an EA, consider:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Does the EA have a trading hour filter?</li>
            <li>Does the EA avoid high-impact news?</li>
            <li>Does the EA stop after a daily loss limit?</li>
            <li>Does the EA have a maximum drawdown stop?</li>
            <li>Does the broker spread widen during rollover or quiet hours?</li>
            <li>Does your strategy work better in trend or range conditions?</li>
          </ul>
        </InfoBlock>

        <InfoBlock title="Malaysia trader example">
          <p>
            A trader in Malaysia may observe that the London session starts in the afternoon, while the New York session becomes active at night. This means a working adult may see more market movement after office hours, but it also means risk can increase during major US news.
          </p>
          <p>
            For conservative EA testing, a trader may choose to run the EA only during selected sessions and avoid rollover time, high spread conditions and major news events.
          </p>
        </InfoBlock>

        <InfoBlock title="Simple EA market-hours checklist">
          <ul className="list-disc space-y-2 pl-5">
            <li>Test the EA on demo before using real capital.</li>
            <li>Record performance by session: Asian, London and New York.</li>
            <li>Avoid high-impact news unless the strategy is designed for news trading.</li>
            <li>Use a spread filter.</li>
            <li>Use a daily loss limit.</li>
            <li>Use a maximum drawdown stop.</li>
            <li>Do not assume one profitable session means the EA is safe.</li>
          </ul>
        </InfoBlock>

        <div className="rounded-2xl bg-zinc-950 p-8 text-white">
          <h2 className="text-2xl font-bold">Want to combine market timing with risk control?</h2>
          <p className="mt-3 leading-7 text-zinc-300">
            Use the EA Risk Calculator first, then download the free Conservative EA Setup Guide for beginner-friendly risk planning.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a href="/#ea-calculator" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-zinc-200">
              Use EA Calculator
            </a>
            <a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="rounded-full border border-zinc-600 px-6 py-3 text-center text-sm font-bold text-white hover:bg-zinc-900">
              Get Free Setup Guide
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-7 text-zinc-600">
          <strong className="text-zinc-950">Risk Disclaimer:</strong> Session times are approximate and may change due to daylight saving time, holidays, broker server time and market conditions. Forex and CFD trading involve risk. This page is for educational and planning purposes only and does not provide financial advice, trading signals or profit guarantees.
        </div>
      </ContentPage>
    </>
  );
}
function DrawdownCalculatorPage() {
  const [result, setResult] = React.useState(null);

  return (
    <>
      <PageHero
        eyebrow="Forex Risk Calculator"
        title="Drawdown Calculator"
        description="Calculate account drawdown, remaining balance and recovery percentage for forex, EA and prop firm risk planning."
      />
      <ContentPage>
        <article className="space-y-6">
          <Card>
            <h2 className="text-2xl font-bold text-zinc-950 mb-4">Quick Answer: What Is Drawdown?</h2>
            <p className="leading-7 text-zinc-600">
              Drawdown is the percentage loss from your account peak balance to a lower balance. If your account drops from USD1,000 to USD800, the drawdown is 20%. Managing drawdown is important because large losses require much bigger gains to recover.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold text-zinc-950 mb-4">Drawdown Calculator</h2>
            <p className="leading-7 text-zinc-600">
              Use this calculator to estimate remaining balance and recovery needed after a trading loss.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input id="balance" type="number" placeholder="Starting Balance (USD)" className="rounded-xl border border-zinc-300 p-3" />
              <input id="drawdown" type="number" placeholder="Drawdown (%)" className="rounded-xl border border-zinc-300 p-3" />
            </div>

            <button
              className="mt-4 rounded-xl bg-black text-white px-6 py-3"
              onClick={() => {
                const balance = parseFloat(document.getElementById("balance").value);
                const dd = parseFloat(document.getElementById("drawdown").value);

                if (isNaN(balance) || isNaN(dd)) return;

                const remaining = balance * (1 - dd / 100);
                const recovery = (dd / (100 - dd)) * 100;

                setResult({ remaining, recovery });
              }}
            >
              Calculate
            </button>

            {result && (
              <div className="mt-4 rounded-xl border p-4 bg-white">
                <p><strong>Remaining Balance:</strong> ${result.remaining.toFixed(2)}</p>
                <p><strong>Recovery Needed:</strong> {result.recovery.toFixed(2)}%</p>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="font-bold text-zinc-950">Formula:</p>
              <p className="mt-2 text-zinc-600">Remaining balance = Starting balance × (1 - Drawdown %)</p>
              <p className="mt-2 text-zinc-600">Recovery needed = Drawdown % ÷ (100 - Drawdown %) × 100</p>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-bold text-zinc-950 mb-4">Drawdown Recovery Table</h2>
            <ul className="text-zinc-600 leading-7 list-disc pl-5 space-y-2">
              <li>10% loss → need 11% gain</li>
              <li>20% loss → need 25% gain</li>
              <li>50% loss → need 100% gain</li>
              <li>80% loss → need 400% gain</li>
            </ul>
          </Card>
        </article>
      </ContentPage>
    </>
  );
}
function RiskRewardCalculatorPage() {
  const [result, setResult] = React.useState(null);

  return (
    <>
      <PageHero
        eyebrow="Forex Risk Calculator"
        title="Risk Reward Calculator"
        description="Calculate risk reward ratio, potential profit and trading setup efficiency for forex and prop firm risk planning."
      />
      <ContentPage>
        <article className="space-y-6">
          <Card>
            <h2 className="text-2xl font-bold text-zinc-950 mb-4">Quick Answer: What Is Risk Reward Ratio?</h2>
            <p className="leading-7 text-zinc-600">
              Risk reward ratio compares the amount you risk with the potential profit of a trade. For example, if you risk USD50 to make USD150, the risk reward ratio is 1:3. A higher reward compared to risk can help traders stay profitable even with a lower win rate.
            </p>
          </Card>

          <Card>
            <h2 className="text-2xl font-bold text-zinc-950 mb-4">Risk Reward Calculator</h2>
            <p className="leading-7 text-zinc-600">
              Use this calculator to estimate your risk reward ratio before entering a trade.
            </p>

            <p className="mt-3">
              <a
                href="https://tally.so/r/81JKpA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-4 py-2 rounded-lg text-sm font-normal hover:bg-zinc-800"
              >
                🚀 Get FREE EA Setup Guide (Beginner Safe Strategy)
              </a>
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <input id="risk" type="number" placeholder="Risk (USD)" className="rounded-xl border border-zinc-300 p-3" />
              <input id="reward" type="number" placeholder="Reward (USD)" className="rounded-xl border border-zinc-300 p-3" />
            </div>

            <button
              className="mt-4 rounded-xl bg-black text-white px-6 py-3"
              onClick={() => {
                const risk = parseFloat(document.getElementById("risk").value);
                const reward = parseFloat(document.getElementById("reward").value);

                if (isNaN(risk) || isNaN(reward)) return;

                let ratio;

                if (reward > risk) {
                  ratio = `1:${parseFloat((reward / risk).toFixed(2))}`;
                } else {
                  ratio = `${parseFloat((risk / reward).toFixed(2))}:1`;
                }

                setResult({ ratio });
              }}
            >
              Calculate
            </button>

            <p className="text-xs text-zinc-400 mt-2">
              Used by beginner traders to manage risk safely
            </p>

            {result && (
              <div className="mt-4 rounded-xl border p-4 bg-white">
                <p><strong>Risk Reward Ratio:</strong> {result.ratio}</p>
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
              <p className="font-bold text-zinc-950">Formula:</p>
              <p className="mt-2 text-zinc-600">Risk Reward Ratio = Reward ÷ Risk</p>
            </div>
          </Card>
        </article>
      </ContentPage>
    </>
  );
}

function HomePage() {
  return (
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
                <a href="#calculators" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-zinc-200">
                Open Calculators             
                </a>
                <a href="https://tally.so/r/81JKpA" target="_blank" rel="noopener noreferrer" className="rounded-full border border-zinc-600 px-6 py-3 text-center text-sm font-bold text-white hover:bg-zinc-900">
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
            eyebrow="Forex Risk Management Guides"
            title="Why conservative EA risk settings matter"
            description="Learn the core risk principles that help beginners test expert advisors with better discipline and consistency."
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
            eyebrow="More Forex Trading Guides"
            title="Explore more beginner risk topics"
            description="Continue learning with practical guides focused on safer forex risk planning and account protection."
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
  );
}

export default function App() {
  const rawPath = window.location.pathname;
  const path = rawPath !== "/" ? rawPath.replace(/\/$/, "") : "/";

  useEffect(() => {
    const titles = {
      "/": "BytesTrade Risk Tools | Forex, EA & Prop Firm Calculators",
      "/about": "About | BytesTrade Risk Tools",
      "/privacy-policy": "Privacy Policy | BytesTrade Risk Tools",
      "/disclaimer": "Disclaimer | BytesTrade Risk Tools",
      "/contact": "Contact | BytesTrade Risk Tools",
      "/forex-market-hours": "Forex Market Hours & Trading Session Clock | BytesTrade Risk Tools",
      "/drawdown-calculator": "Drawdown Calculator | BytesTrade Risk Tools",
      "/articles": "Forex Risk Management Guides | BytesTrade Risk Tools",
      "/articles/how-to-calculate-lot-size-in-forex-trading": "How to Calculate Lot Size in Forex Trading | BytesTrade",
      "/articles/what-is-risk-reward-ratio-in-forex-trading": "What Is Risk Reward Ratio in Forex Trading? | BytesTrade",
      "/articles/what-is-drawdown-in-forex-trading": "What Is Drawdown in Forex Trading? | BytesTrade",
      "/articles/how-much-should-you-risk-per-trade": "How Much Should You Risk Per Trade? | BytesTrade",
      "/articles/stop-loss-in-forex-how-to-set-it-properly": "Stop Loss in Forex: How to Set It Properly | BytesTrade",
      "/articles/position-size-vs-lot-size": "Position Size vs Lot Size: What Is the Difference? | BytesTrade",
      "/articles/how-to-use-a-forex-lot-size-calculator-correctly": "How to Use a Forex Lot Size Calculator Correctly | BytesTrade",
      "/articles/forex-risk-management-checklist-for-beginners": "Forex Risk Management Checklist for Beginners | BytesTrade",
      "/articles/what-is-leverage-in-forex-and-why-it-increases-risk": "What Is Leverage in Forex and Why It Increases Risk? | BytesTrade",
      "/articles/margin-call-in-forex-what-it-means-and-how-to-avoid-it": "Margin Call in Forex: What It Means and How to Avoid It | BytesTrade",
      "/articles/what-is-risk-per-trade-in-forex": "What Is Risk Per Trade in Forex? | BytesTrade",
      "/articles/conservative-ea-settings-for-small-accounts": "Conservative EA Settings for Small Accounts | BytesTrade",
      "/articles/why-0-5-risk-is-safer-for-ea-beginners": "Why 0.5% Risk Is Safer for EA Beginners | BytesTrade",
      "/articles/prop-firm-daily-loss-and-max-drawdown-explained": "Prop Firm Daily Loss and Max Drawdown Explained | BytesTrade",
      "/articles/why-martingale-ea-is-dangerous-for-beginners": "Why Martingale EA Is Dangerous for Beginners | BytesTrade",
    };
    document.title = titles[path] || "BytesTrade Risk Tools";
  }, [path]);

  let page = <HomePage />;

  if (path === "/about") page = <AboutPage />;
  else if (path === "/privacy-policy") page = <PrivacyPolicyPage />;
  else if (path === "/disclaimer") page = <DisclaimerPage />;
  else if (path === "/contact") page = <ContactPage />;
  else if (path === "/forex-market-hours") page = <ForexMarketHoursPage />;
  else if (path === "/drawdown-calculator") page = <DrawdownCalculatorPage />;
  else if (path === "/risk-reward-calculator") page = <RiskRewardCalculatorPage />;
  else if (path === "/lot-size-calculator") page = <LotSizeCalculatorPage />;
  else if (path === "/articles") page = <ArticlesPage />;
  else if (path === "/articles/how-to-calculate-lot-size-in-forex-trading") page = <LotSizeArticlePage />;
  else if (path === "/articles/what-is-risk-reward-ratio-in-forex-trading") page = <RiskRewardArticlePage />;
  else if (path === "/articles/what-is-drawdown-in-forex-trading") page = <DrawdownArticlePage />;
  else if (path === "/articles/how-much-should-you-risk-per-trade") page = <RiskPerTradeGuidePage />;
  else if (path === "/articles/stop-loss-in-forex-how-to-set-it-properly") page = <StopLossArticlePage />;
  else if (path === "/articles/position-size-vs-lot-size") page = <PositionVsLotArticlePage />;
  else if (path === "/articles/how-to-use-a-forex-lot-size-calculator-correctly") page = <LotSizeCalculatorUsageArticlePage />;
  else if (path === "/articles/forex-risk-management-checklist-for-beginners") page = <ForexRiskChecklistArticlePage />;
  else if (path === "/articles/what-is-leverage-in-forex-and-why-it-increases-risk") page = <LeverageRiskArticlePage />;
  else if (path === "/articles/margin-call-in-forex-what-it-means-and-how-to-avoid-it") page = <MarginCallArticlePage />;
  else if (path === "/articles/what-is-risk-per-trade-in-forex") page = <RiskPerTradeArticlePage />;
  else if (path === "/articles/conservative-ea-settings-for-small-accounts") page = <ConservativeEASettingsArticlePage />;
  else if (path === "/articles/why-0-5-risk-is-safer-for-ea-beginners") page = <HalfPercentRiskArticlePage />;
  else if (path === "/articles/prop-firm-daily-loss-and-max-drawdown-explained") page = <PropFirmDailyLossArticlePage />;
  else if (path === "/articles/why-martingale-ea-is-dangerous-for-beginners") page = <MartingaleEAArticlePage />;
  else if (path !== "/") page = <NotFoundPage />;

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-950">
      <Header />
      {page}
      <footer className="border-t border-zinc-200 bg-white px-5 py-8">
        <div className="mx-auto max-w-7xl flex flex-col gap-4 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
          <p>© 2026 BytesTrade Risk Tools. For educational content only.</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-2">
            <a href="/#calculators" className="hover:text-zinc-950">Calculators</a>
            <a href="/drawdown-calculator" className="hover:text-zinc-950">Drawdown Calculator</a>
            <a href="/risk-reward-calculator" className="hover:text-zinc-950">Risk Reward</a>
            <a href="/lot-size-calculator" className="hover:text-zinc-950">Lot Size Calculator</a>  
            <a href="/articles" className="hover:text-zinc-950">Articles</a>
            <a href="/about" className="hover:text-zinc-950">About</a>
            <a href="/privacy-policy" className="hover:text-zinc-950">Privacy Policy</a>
            <a href="/disclaimer" className="hover:text-zinc-950">Disclaimer</a>
            <a href="/contact" className="hover:text-zinc-950">Contact</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function ArticleLayout({ eyebrow, title, description, sections, related }) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <ContentPage>
        <article className="space-y-6">
          {sections.map((section) => (
            <Card key={section.heading}>
              <h2 className="mb-3 text-2xl font-bold text-zinc-950">{section.heading}</h2>
              {section.paragraphs.map((p, i) => <p key={i} className="mt-3 leading-7 text-zinc-600" dangerouslySetInnerHTML={{ __html: p }} />)}
              {section.table && (
                <div className="mt-4 overflow-auto rounded-2xl border border-zinc-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-100 text-zinc-600"><tr>{section.table.headers.map((h) => <th key={h} className="px-4 py-3">{h}</th>)}</tr></thead>
                    <tbody>{section.table.rows.map((r, idx) => <tr key={idx} className="border-t border-zinc-200">{r.map((c, i) => <td key={i} className="px-4 py-3">{c}</td>)}</tr>)}</tbody>
                  </table>
                </div>
              )}
            </Card>
          ))}
          <Card>
            <h3 className="text-xl font-bold text-zinc-950">Related articles</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-zinc-700">
              {related.map((item) => <li key={item.slug}><a className="underline" href={`/articles/${item.slug}`}>{item.title}</a></li>)}
            </ul>
            <p className="mt-4 text-sm text-zinc-500">Risk disclaimer: Educational content only. Trading involves risk, and losses can occur.</p>
          </Card>
        </article>
      </ContentPage>
    </>
  );
}

const commonRelated = articles;
function filteredRelated(slug){ return articles.filter((a)=>a.slug!==slug); }

const lotSizeSections = [
  { heading: "Introduction: lot size is where risk management becomes real", paragraphs:["When traders ask why two people can take the same chart setup and get very different account outcomes, the answer is usually position sizing. Lot size controls how much your account is exposed per pip. If the lot is too large, a normal loss becomes emotionally and financially heavy. If the lot is aligned with a risk plan, a single loss is just one data point in a long series.","Lot size is not a prediction tool. It is a damage-control tool. You calculate it before entry so your maximum planned loss is known in advance. That protects decision quality: instead of hoping price moves your way, you know exactly what happens if it does not.","This guide is educational and practical. You will see how account balance, risk percentage, stop loss distance, and pip value combine into a repeatable formula. You can also test numbers with the <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a> and evaluate trade structure using the <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a>." ]},
  { heading:"The four required inputs: balance, risk %, stop loss pips, pip value", paragraphs:["A reliable lot-size workflow always starts with four variables. First: account balance (or equity), which represents the capital base. Second: risk percentage per trade, such as 0.5%, 1%, or 2%. Third: stop loss distance in pips, defined by market invalidation. Fourth: pip value for 1.00 lot on the instrument you are trading.","These inputs connect directly. Risk Amount = Account Balance × Risk %. Then, Risk per 1.00 Lot = Stop Loss Pips × Pip Value. Finally, Lot Size = Risk Amount ÷ Risk per 1.00 Lot. This sequence prevents random size decisions and keeps loss exposure stable.","Beginners often skip one of these inputs, especially pip value differences across pairs. That creates hidden risk drift. A disciplined process means checking all four variables on every order ticket."], table:{headers:["Input","Why it matters","Example"], rows:[["Account balance","Sets the dollar base for risk","$6,000"],["Risk percentage","Defines max loss per trade","1%"],["Stop loss in pips","Defines invalidation distance","24 pips"],["Pip value @ 1.00 lot","Converts pips to money","$10/pip"],["Risk amount","Balance × risk %","$60"]]}},
  { heading:"Understanding standard, mini, and micro lots", paragraphs:["In forex, lot labels are unit bundles. A standard lot is typically 100,000 units, a mini lot is 10,000 units, and a micro lot is 1,000 units of base currency. They are not different strategies; they are measurement scales for the same exposure concept.","On many USD-quoted major pairs, rough pip values are: standard lot ≈ $10 per pip, mini lot ≈ $1 per pip, micro lot ≈ $0.10 per pip. If you trade 0.35 standard lots, your approximate pip value is $3.50 per pip in that context. These approximations are useful for planning, but platform-specific values should be verified.","Thinking in units helps avoid confusion. For example, 0.07 lots equals 7,000 units. This can be described as 7 micro lots or 0.7 mini lots. The wording changes, but risk comes from the same arithmetic: units × pip movement × stop distance." ]},
  { heading:"Full lot size calculation example (step by step)", paragraphs:["Assume account balance is $8,500. Your risk rule is 1%, so maximum planned loss is $85. You identify a setup with a technically valid stop loss at 34 pips. On this pair, pip value at 1.00 lot is approximately $10 per pip.","First compute risk per full lot: 34 pips × $10 = $340. Then compute lot size: $85 ÷ $340 = 0.25 lots. In unit terms, that is 25,000 units. If stop is hit under normal execution, expected loss is about $85 plus/minus transaction costs.","Now test sensitivity. If your stop needed to be 17 pips instead, risk per full lot would be $170, so lot size for the same $85 risk becomes 0.50 lots. If stop needed 51 pips, risk per full lot is $510 and lot size becomes about 0.17 lots. The same account and risk% produce different lot sizes because stop distance changed. This is exactly how risk-normalized sizing should behave.","Practical note: always round down to your broker’s lot increment to avoid accidental over-risking. If your result is 0.257 and your platform allows 0.01 steps, using 0.25 is usually safer than 0.26."], table:{headers:["Step","Formula","Output"], rows:[["Risk amount","$8,500 × 1%","$85"],["Risk per 1.00 lot","34 × $10","$340"],["Lot size","$85 ÷ $340","0.25 lots"],["Units","0.25 × 100,000","25,000 units"],["Approx. pip value at 0.25 lot","$10 × 0.25","$2.50/pip"]]}},
  { heading:"How lot size interacts with strategy quality", paragraphs:["Lot size does not create edge by itself, but it determines whether your edge can survive variance. Even good strategies have losing streaks. If your sizing is aggressive, variance can push you into emotionally reactive decisions, which then harms execution quality.","Risk-normalized sizing also improves journal analysis. When each trade risks a similar fraction of account value, your results are comparable across time. This helps you detect whether problems come from entries, exits, or rule violations instead of random size changes.","Another benefit is scenario planning. Before the week starts, you can model what 5 losses in a row would look like at 0.5%, 1%, and 2% risk. This forward-looking discipline connects directly to account longevity and stress control." ]},
  { heading:"Common mistakes in lot-size calculation", paragraphs:["A frequent error is setting lot size first, then forcing stop loss to match preferred exposure. This usually creates technically weak stop placement. Proper order is: define invalidation, measure stop pips, then calculate size.","Another mistake is ignoring correlation. Taking three highly correlated USD trades at 1% each can behave like a concentrated 2–3% directional bet. Trade-level risk can look fine while portfolio-level risk is too high.","Many traders also forget costs. Spreads, commissions, and slippage can slightly increase realized loss beyond planned loss. This is especially relevant for short-term trading where costs consume a larger share of expected reward.","Finally, some traders rely on memory for pip value assumptions. Pair-specific checks reduce avoidable errors. When in doubt, verify with platform data or a calculator before execution." ]},
  { heading:"Beginner tips for consistent sizing and execution", paragraphs:["Start with a conservative fixed-fraction model, usually 0.5% to 1% risk per trade. Keep it unchanged long enough to gather clean data. Constant rules are easier to evaluate than constantly changing risk settings.","Create a one-minute pre-trade checklist: account value, risk %, stop pips, pip value, calculated lot, and target logic. If one field is missing, skip execution until it is complete. This process-based approach reduces emotional impulse entries.","Review weekly: compare planned loss versus realized loss on stopped trades. If realized losses are consistently larger, check slippage handling, spread assumptions, and whether stops were moved after entry.","Use tool support to reduce manual mistakes: <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a> for exposure, <a class='underline' href='/drawdown-calculator'>Drawdown Calculator</a> for survivability, and <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a> for payoff planning." ]},
  { heading:"FAQ", paragraphs:["<strong>Should I use balance or equity for lot size?</strong><br/>Either can work if you are consistent. Equity is often more conservative during active drawdown because it reflects floating P/L.","<strong>Can I keep the same lot on every trade?</strong><br/>Only if stop distance and pip value are identical, which is uncommon. Most risk-based traders recalculate each setup.","<strong>What risk percentage is reasonable for beginners?</strong><br/>Many beginners start around 0.5% to 1% per trade to reduce drawdown pressure while building execution consistency.","<strong>Does smaller lot size mean weaker strategy?</strong><br/>No. Smaller size often means stronger process discipline. Strategy quality comes from edge and execution, not from oversized exposure.","<strong>Do calculators remove trading risk?</strong><br/>No. They improve planning accuracy, but market gaps and execution conditions can still affect outcomes." ]}
];

const rrSections = [
  { heading:"Introduction: risk reward ratio is a payoff framework", paragraphs:["Risk reward ratio describes the relationship between planned downside and planned upside on a trade. If you risk 15 pips to target 30 pips, the ratio is 1:2. If you risk 20 pips to target 20 pips, it is 1:1. This framework does not predict direction; it defines the payoff structure of your plan.","Why this matters: long-term results are driven by expectancy, and expectancy depends on both win rate and average win/loss size. Traders who focus only on hit rate often miss this. A system can win less than half its trades and still be profitable if average winners are meaningfully larger than losers.","Before execution, many traders calculate ratio with the <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a>, then align position size through the <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a>." ]},
  { heading:"1:1, 1:2, and 1:3 ratios explained with context", paragraphs:["A 1:1 trade means reward distance equals risk distance. It can work well when a strategy has strong accuracy and fast rotation. A 1:2 trade seeks double the reward versus risk; this often gives better protection against variance. A 1:3 profile aims for larger asymmetry but usually requires more patience and stronger trend continuation.","There is no universal best ratio. The correct ratio depends on market structure, timeframe, and your strategy’s tested behavior. For example, mean-reversion setups may naturally achieve smaller targets, while trend continuation setups may support larger R multiples.","The key is consistency between what charts realistically offer and what your plan demands. Forcing 1:3 targets in low-range conditions can reduce achievable win rate and damage expectancy."], table:{headers:["Ratio","Risk (pips)","Target (pips)","Typical implication"], rows:[["1:1","20","20","Higher win-rate requirement"],["1:2","20","40","Balanced payoff profile"],["1:3","20","60","Lower win rate tolerated, harder target"]]}},
  { heading:"Stop loss distance and target distance: structure first", paragraphs:["Risk reward starts with valid stop placement. Stop loss distance should represent the point where your trade idea is invalid, not where losses feel uncomfortable. If stop is arbitrarily tight, you can be right on direction but still be stopped by normal noise.","Target distance should be anchored to realistic market opportunity: nearby support/resistance, session volatility, and timeframe context. A mathematically attractive target that conflicts with structure is not a high-quality plan.","A practical workflow is: identify invalidation level, measure stop pips, locate realistic target zone, then compute ratio. If ratio is below your minimum threshold, you can refine entry or skip the setup. This protects quality rather than forcing quantity." ]},
  { heading:"Win-rate connection and break-even math", paragraphs:["A useful approximation for break-even win rate is 1 divided by (1 + reward multiple), before costs. So 1:1 needs about 50% wins, 1:2 needs about 33.3%, and 1:3 needs about 25%. Once spread and commission are included, required win rates are slightly higher.","This relationship clarifies trade-offs. If your journaled win rate is around 38%, a 1:1 approach may struggle unless costs are very low and execution is excellent. A consistent 1:2 average payoff may be more compatible. Conversely, if your strategy historically wins 62% with fast exits, forcing 1:3 may reduce hit rate too much.","The objective is not to chase the largest ratio. The objective is to align ratio with real execution statistics. Planned ratio on chart markup matters less than realized ratio in your trade journal."], table:{headers:["Ratio","Approx. break-even win rate (before costs)","What to monitor"], rows:[["1:1","50%","Execution accuracy and costs"],["1:2","33.3%","Target realism and patience"],["1:3","25%","Trend strength and hold discipline"]]}},
  { heading:"Practical calculation example: same risk, different ratios", paragraphs:["Assume account size is $12,000 and risk per trade is 1%, so risk amount is $120. Trade A has a 1:1 setup. If stop is hit, -$120; if target hits, +$120. Trade B has 1:2: stop -$120, target +$240. Trade C has 1:3: stop -$120, target +$360.","Now model ten trades with four winners and six losers. At 1:1, outcome is 4×120 - 6×120 = -$240. At 1:2, outcome is 4×240 - 6×120 = +$240. At 1:3, outcome is 4×360 - 6×120 = +$720. Same win rate, different expectancy due to payoff asymmetry.","This is simplified math; real results vary because of partial closes, missed fills, spread, and slippage. But the directional lesson is reliable: ratio and win rate must be evaluated together, not separately."], table:{headers:["Model","Wins","Losses","Net result"], rows:[["1:1 with 4W/6L","+$480","-$720","-$240"],["1:2 with 4W/6L","+$960","-$720","+$240"],["1:3 with 4W/6L","+$1,440","-$720","+$720"]]}},
  { heading:"Common mistakes when using risk reward ratios", paragraphs:["One common error is widening stop loss after entry to avoid being stopped out. This changes initial risk and often breaks expectancy. Another mistake is taking profit too early on fear, which reduces realized reward and drifts real ratio toward 1:1 even when plan was 1:2 or better.","Traders also overestimate ratio by drawing targets through low-probability zones without structural support. A screenshot may show 1:3, but if that target is rarely reached, the effective ratio is lower.","Finally, some traders judge strategy quality from a handful of trades. Ratio performance should be evaluated over a meaningful sample under consistent rules." ]},
  { heading:"Beginner tips for applying ratio in real trading", paragraphs:["Define entry, stop, and target before execution. If you cannot define all three clearly, skip the trade. This prevents post-entry improvisation that damages statistical consistency.","Track both planned R and realized R in your journal. The gap between these numbers often reveals process issues such as early exits, moved stops, or poor fill conditions.","Set a context-aware minimum ratio rule, such as 1:1.5 or 1:2, but apply it only when market structure supports it. No-trade decisions are part of risk management.","Pair ratio planning with drawdown awareness using the <a class='underline' href='/drawdown-calculator'>Drawdown Calculator</a>. Survivability matters as much as raw expectancy. Also review session conditions: during low-volatility windows, demanding very high R multiples can produce many missed targets. During stronger directional sessions, moderate pullbacks may allow better reward expansion. By tagging each trade with session type and volatility context, you can see where your ratio rules perform best and where they need adjustment. This turns ratio from a static number into a context-aware decision framework over time." ]},
  { heading:"FAQ", paragraphs:["<strong>Is 1:2 always better than 1:1?</strong><br/>Not automatically. If your market context rarely reaches 2R targets, forcing 1:2 can reduce practical performance.","<strong>Can I be profitable with a 40% win rate?</strong><br/>Yes, if average realized winners are sufficiently larger than losers and costs are controlled.","<strong>Should spread be included in ratio planning?</strong><br/>Yes. Especially on lower timeframes, costs can meaningfully alter realized R.","<strong>What matters more, ratio or win rate?</strong><br/>Neither alone. Expectancy depends on both, so they must be evaluated together.","<strong>How many trades are needed to evaluate ratio quality?</strong><br/>Usually dozens of trades with consistent rules; very small samples can be misleading." ]}
];

const drawdownSections = [
  { heading:"Introduction: drawdown is the cost of being wrong before being right", paragraphs:["Drawdown is the decline from a previous account high to a lower point after losses. In forex trading, this number is not just a statistic in your history tab. It is a practical measure of stress, recovery burden, and account survival probability. Two traders can run similar strategies and even similar win rates, yet the one with deeper drawdowns often quits sooner because the psychological and mathematical recovery load becomes too heavy.","Many beginners think only in terms of “How much can I make this week?” while experienced risk managers ask, “How much can I lose and still execute my plan next month?” Drawdown answers the second question. It tells you whether your strategy and position sizing are robust enough to survive normal losing phases without triggering panic changes.","This guide explains the core drawdown types (balance drawdown, equity drawdown, and maximum drawdown), why losing streaks matter more than single losses, and how to use the <a class='underline' href='/drawdown-calculator'>Drawdown Calculator</a>, <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a>, and <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a> to protect account longevity." ]},
  { heading:"Balance drawdown vs equity drawdown: know which one you are measuring", paragraphs:["Balance drawdown uses closed trades only. If your account balance peaked at $10,000 and later dropped to $9,100 after closed losses, your balance drawdown is 9%. This metric is stable and easy to audit because it ignores floating positions.","Equity drawdown includes open profit and loss. If your balance is still $10,000 but open trades are currently -$700, your equity is $9,300 and your equity drawdown is 7% right now. Equity drawdown can change second by second as price moves.","Why this distinction matters: prop firms and risk rules often monitor equity in real time, not just closed balance. A trader can believe they are “safe” based on balance, while equity is already near violation levels. Conservative traders therefore track both metrics: balance drawdown for performance history and equity drawdown for live risk control."], table:{headers:["Metric","What it includes","Best use case","Limitation"], rows:[["Balance drawdown","Closed P/L only","Performance review and journaling","Can hide floating risk"],["Equity drawdown","Closed + floating P/L","Live risk monitoring and survival control","More volatile intraday"],["Peak reference","Highest historical balance/equity","Consistent % drawdown calculation","Must be updated correctly"]]}},
  { heading:"Maximum drawdown: the number that defines your pain threshold", paragraphs:["Maximum drawdown (MDD) is the largest peak-to-trough decline over a period. If your account rises to $12,000, falls to $9,600, then later recovers and grows, the MDD remains 20% for that window because 20% was the deepest drop from a prior high.","MDD matters because it compresses your worst historical stress into one number. Investors, prop firms, and serious traders all use it to judge whether a strategy is survivable. A system with high returns but extreme MDD may be statistically impressive and practically untradeable for many people.","Do not treat MDD as a target or fixed limit that can never be breached. Treat it as a warning sign. If your live drawdown approaches or exceeds backtested MDD, market regime may have changed, or execution quality may have deteriorated. Either way, it is a signal to reduce risk and investigate." ]},
  { heading:"Losing streaks and account survival: why streak math beats optimism", paragraphs:["Single-trade loss size is important, but losing streaks are what usually break accounts. Even strategies with positive expectancy can experience clusters of losses. If you risk too much per trade, a normal streak can create abnormal drawdown.","Suppose a strategy has a real win rate near 45%. It can still produce 6, 8, or even 10 consecutive losses over a long sample. A trader risking 2% per trade who hits 8 losses faces roughly a 14.9% compounded drawdown (not 16% exactly because the base shrinks). That may be manageable for some traders, but psychologically difficult for many.","Now compare with 0.5% risk per trade: the same 8-loss streak is about 3.9% drawdown. The strategy did not change. Only position sizing changed, but survival odds improved dramatically. This is why risk planning should start from worst-case streak tolerance, not best-case profit fantasy."], table:{headers:["Risk per trade","5-loss streak","8-loss streak","10-loss streak"], rows:[["0.5%","~2.5%","~3.9%","~4.9%"],["1.0%","~4.9%","~7.7%","~9.6%"],["2.0%","~9.6%","~14.9%","~18.3%"],["3.0%","~14.1%","~21.6%","~26.3%"]]}},
  { heading:"Recovery difficulty: why deeper drawdown needs disproportionately larger returns", paragraphs:["Many beginners underestimate recovery math. A 10% drawdown needs about 11.1% gain to recover. A 20% drawdown needs 25%. A 40% drawdown needs 66.7%. A 50% drawdown needs 100%. The deeper the drawdown, the steeper the recovery slope.","This asymmetry explains why account protection is more important than aggressive compounding. If you avoid deep losses, your required recovery remains realistic. If you allow very deep losses, recovery often demands risk-taking behavior that creates another drawdown loop.","Professional risk control therefore focuses on preventing large equity holes in the first place: smaller fixed risk per trade, strict stop discipline, and temporary risk reduction when live performance degrades. Prevention is easier than mathematical rescue."], table:{headers:["Drawdown","Account after drop (from $10,000)","Gain needed to return to $10,000"], rows:[["5%","$9,500","5.26%"],["10%","$9,000","11.11%"],["20%","$8,000","25.00%"],["30%","$7,000","42.86%"],["40%","$6,000","66.67%"],["50%","$5,000","100.00%"]]}},
  { heading:"Practical drawdown calculation example (step by step)", paragraphs:["Assume you start the month with $15,000. After a strong week, your account peaks at $15,900. Over the next ten trades, you take a mixed sequence and equity falls to $14,640 at the lowest point before stabilizing.","Step 1: identify peak equity = $15,900. Step 2: identify trough equity = $14,640. Step 3: compute drawdown amount = $1,260. Step 4: compute drawdown percentage = $1,260 ÷ $15,900 = 7.92%. That is your peak-to-trough equity drawdown for this phase.","If your risk plan says reduce size after 8% drawdown, this sequence nearly triggers a defensive action. A disciplined trader might cut risk from 1% to 0.5% until performance improves. This simple rule can prevent a moderate drawdown from becoming a major one.","You can model these scenarios quickly using the <a class='underline' href='/drawdown-calculator'>Drawdown Calculator</a>, then check revised position sizes with the <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a> before placing new trades." ]},
  { heading:"Common drawdown mistakes traders make", paragraphs:["One common mistake is tracking only closed balance and ignoring floating equity losses. This can delay risk response until damage is larger than expected.","Another frequent error is increasing trade size during a drawdown to “win it back faster.” This usually raises variance at the worst possible moment and can accelerate account decline.","Some traders also move stop losses farther away after entry, which silently increases risk per trade and inflates drawdown beyond the original plan. Others keep trading correlated pairs as if each trade were independent, effectively multiplying exposure during bad market phases.","Finally, many people have no pre-defined drawdown actions. Without rules like “reduce risk after 6%” or “pause after 10%,” decisions become emotional and inconsistent." ]},
  { heading:"Beginner tips to keep drawdown survivable", paragraphs:["Use a fixed-fraction risk model (often 0.5% to 1% per trade) and keep it stable while collecting data. Constant risk makes drawdown behavior easier to evaluate.","Create explicit drawdown response rules before trading: for example, reduce risk by half after 6% equity drawdown, stop new entries at 10%, and review journal execution before resuming.","Think in streak scenarios, not single trades. Plan for what happens if you lose 6 to 10 trades in a row. If that scenario feels unbearable, your risk is too high for your psychology.","Review weekly metrics: current equity drawdown, monthly maximum drawdown, and average realized R multiple. Pair this with the <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a> so your payoff profile supports long-term recovery.","Most importantly, treat survival as the first objective. You can only compound from an account that still exists." ]},
  { heading:"FAQ", paragraphs:["<strong>What is a good maximum drawdown for beginners?</strong><br/>Many beginners aim to keep live drawdown in a conservative zone, often under 10% to 15%, though exact limits depend on strategy and psychology.","<strong>Is equity drawdown more important than balance drawdown?</strong><br/>For live risk control, yes. Equity reflects current exposure and can prevent late reactions.","<strong>Can a profitable strategy still have large drawdowns?</strong><br/>Yes. Profitability and drawdown are different dimensions; a strategy can make money and still be too volatile for your tolerance.","<strong>Should I stop trading after every drawdown?</strong><br/>Not necessarily. Use pre-defined thresholds for risk reduction, temporary pause, and structured review rather than emotional stops.","<strong>How do calculators help with drawdown?</strong><br/>They do not remove risk, but they improve planning accuracy and help you compare survival outcomes before placing trades." ]}
];

const riskPerTradeSections = [
  { heading:"Introduction: risk per trade is your most important control lever", paragraphs:["Risk per trade is the percentage of your account you are willing to lose if one trade reaches stop loss. This single setting has a bigger impact on survival than most entry techniques. You can have a decent strategy and still fail from oversizing; you can also have an average strategy and stay stable long enough to improve if risk is controlled.","When beginners ask whether they should risk 0.5%, 1%, or 2%, the best answer is not a universal number. It depends on strategy volatility, losing streak tolerance, and emotional consistency. The right risk model is the one you can execute repeatedly through good and bad weeks without abandoning your rules.","A useful way to think about risk per trade is that it is your “tuition fee” for information. Every trade outcome teaches you something about market behavior and your execution quality. If your tuition fee is small, you can afford many lessons. If each lesson is expensive, one difficult week can remove your ability to keep learning in live conditions.","Good traders protect consistency first and scale second; this order matters more than any single strategy tweak.","In this guide, you will compare 0.5%, 1%, and 2% models, run practical calculations, evaluate losing-streak survival, and connect planning tools such as the <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a>, <a class='underline' href='/drawdown-calculator'>Drawdown Calculator</a>, and <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a>." ]},
  { heading:"What 0.5%, 1%, and 2% really mean in money terms", paragraphs:["Percentages look small, but money impact becomes meaningful as account size changes. On a $2,000 account, 0.5% risk is $10, 1% is $20, and 2% is $40. On a $25,000 account, those become $125, $250, and $500. The percentage is the same; emotional pressure is not.","Because risk scales with account size, percentage-based sizing is usually more consistent than fixed lot sizing. It naturally decreases exposure after losses and increases exposure after growth, helping keep risk proportional.","The key is to convert percentage into exact dollar risk before every trade. Then compute lot size from stop distance. If you skip this conversion and choose size by feeling, your risk model is not actually fixed."], table:{headers:["Account size","0.5% risk","1% risk","2% risk"], rows:[["$2,000","$10","$20","$40"],["$5,000","$25","$50","$100"],["$10,000","$50","$100","$200"],["$25,000","$125","$250","$500"]]}},
  { heading:"Risk-per-trade comparison: stability vs growth speed trade-off", paragraphs:["Lower risk per trade usually means smoother equity and lower stress, but slower compounding. Higher risk may accelerate gains during winning periods, yet it also increases drawdown depth during inevitable losing streaks.","For most beginners, stability is more valuable than speed. If your risk is too high, you may abandon your strategy after a normal drawdown, which destroys long-term edge. A slower but consistent path often outperforms aggressive starts that end in emotional mistakes.","Think of risk per trade as a throttle, not an ego signal. You are not “better” because you risk 2%. You are simply accepting higher variance, which only makes sense if your tested system and psychology can handle it."], table:{headers:["Model","Typical profile","Pros","Main risk"], rows:[["0.5%","Conservative","High survivability, lower stress","Slower account growth"],["1.0%","Balanced","Good compromise for many traders","Can still feel pressure in long streaks"],["2.0%","Aggressive retail standard","Faster gains in strong phases","Drawdown escalates quickly"]]}},
  { heading:"Practical calculation example: fixed risk per trade in action", paragraphs:["Assume account equity is $8,000 and your chosen risk model is 1%. Risk amount per trade is $80. You identify a setup requiring a 25-pip stop. If pip value at 1.00 lot is about $10, then risk per 1.00 lot is $250.","Lot size = $80 ÷ $250 = 0.32 lots. If stop loss is hit, expected loss is about $80 (plus costs). If a different setup requires a 40-pip stop, risk per 1.00 lot becomes $400, and lot size drops to 0.20 lots. Same risk model, different position size, controlled downside.","Now compare if you used 2% risk instead. Risk amount would be $160. With the same 25-pip stop, lot size becomes 0.64 lots. Profit potential doubles, but so does loss pressure. This is why percentage selection should be based on survivability, not excitement." ]},
  { heading:"Losing streak survival math: where over-risking becomes visible", paragraphs:["The danger of over-risking appears clearly during consecutive losses. A 10-loss streak at 0.5% risk is uncomfortable but often recoverable. The same streak at 2% can produce a drawdown near 18.3%, which changes trader behavior dramatically.","When traders feel urgent recovery pressure, they often break rules: widen stops, revenge trade, or skip position sizing checks. So risk per trade is not only a math choice; it is a behavior-management choice.","If your tested strategy can realistically face 8–12 losses in a bad phase, choose a risk level that still lets you execute normally after that sequence. Survival first, optimization second."], table:{headers:["Risk per trade","Approx. drawdown after 6 losses","After 10 losses","After 12 losses"], rows:[["0.5%","~3.0%","~4.9%","~5.8%"],["1.0%","~5.9%","~9.6%","~11.4%"],["2.0%","~11.4%","~18.3%","~21.5%"]]}},
  { heading:"Common mistakes with risk-per-trade rules", paragraphs:["A classic mistake is changing risk size based on confidence in a single setup. Unless you have a rigorously tested framework for variable risk, this usually introduces inconsistency and larger drawdowns.","Another error is confusing fixed lot with fixed risk. If stop distance changes but lot size does not, your percentage risk drifts trade to trade and can exceed plan without noticing.","Traders also forget portfolio exposure. Three correlated positions at 1% each may behave like one large concentrated bet. Risk per trade looked compliant, but total risk was not.","Many newer traders also set a percentage rule but break it when volatility expands. For example, they keep the same lot through a much wider stop, effectively doubling risk. This often happens during high-impact news releases when execution quality is already worse.","Finally, many beginners ignore transaction costs and slippage. Realized loss can exceed planned loss, especially in volatile news conditions. Conservative buffers help keep actual risk closer to intended risk." ]},
  { heading:"Beginner tips for disciplined risk control", paragraphs:["Start with 0.5% or 1% until you have a meaningful sample of live trades executed under one ruleset. Increase only if both performance and discipline are proven, not because of impatience.","Use a pre-trade checklist: account equity, chosen risk %, dollar risk, stop distance, computed lot size, and correlation check. If one element is missing, do not enter.","Set drawdown-based throttle rules in advance. Example: reduce risk from 1% to 0.5% after 6% drawdown, pause new trades at 10%, and resume only after review.","Track planned versus realized risk in your journal. If realized losses are consistently above plan, investigate spreads, slippage, and execution timing.","Add a weekly review ritual focused on three questions: Did I follow fixed risk on every trade? Did I break rules during losing days? Did my real risk match my planned risk? This routine turns risk control into a skill you actively train, rather than a one-time rule you hope to remember.","If you are transitioning from demo to live, consider temporarily reducing your normal risk by half for the first month. Live execution pressure is different from demo execution pressure. Lower initial risk helps preserve decision quality while you adapt to real slippage, spreads, and emotional responses.","Leverage tools every session: <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a> for sizing, <a class='underline' href='/drawdown-calculator'>Drawdown Calculator</a> for survival modeling, and <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a> for payoff quality." ]},
  { heading:"FAQ", paragraphs:["<strong>Should beginners use 2% risk per trade?</strong><br/>Many beginners find 2% too stressful during normal losing streaks. 0.5% to 1% is often easier to execute consistently.","<strong>Is fixed risk per trade better than fixed lot size?</strong><br/>Usually yes, because fixed risk adjusts lot size when stop distance changes and keeps downside more consistent.","<strong>Can I increase risk after a winning streak?</strong><br/>You can, but frequent discretionary changes often hurt consistency. Use pre-defined rules, not emotions.","<strong>What if my strategy has very high win rate?</strong><br/>High win rate can still experience streaks and regime shifts. Keep risk moderate until long-sample robustness is proven.","<strong>How do I choose between 0.5% and 1%?</strong><br/>Pick the level that lets you follow your plan during losing phases without panic changes. Consistency beats theoretical speed. If uncertain, start at 0.5% and scale only after documented consistency." ]}
];
const stopLossSections = [
  { heading:"Introduction: stop loss is your pre-defined exit when the trade idea is invalid", paragraphs:["A stop loss in forex is a protective order that closes a position when price reaches a level proving your setup is wrong. The purpose is not to be right all the time. The purpose is to keep a single loss small enough that you can continue trading your plan tomorrow, next week, and next month.","Many beginners treat stop loss as a broker feature. In professional risk management, it is a decision framework. You define invalidation before entry, then size the trade so that if stop loss is hit, the account damage matches your risk-per-trade rule. This links technical analysis to money management.","Without stop loss discipline, traders usually drift into emotional decisions: moving stops wider, averaging into losers, or closing winners too early to compensate for larger losses. A clear stop process helps prevent all three. You can plan size using the <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a>, validate payoff with the <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a>, and model equity pressure with the <a class='underline' href='/drawdown-calculator'>Drawdown Calculator</a>." ]},
  { heading:"What stop loss is (and what it is not)", paragraphs:["A stop loss is an invalidation boundary, not a prediction. It does not guarantee perfect fills, and it does not mean the market will never wick through your level before reversing. It simply defines the point where your original idea no longer has the same probability profile.","A useful distinction: stop location is technical, while stop consequence is financial. Technical logic decides where invalidation belongs (below structure, above swing, beyond volatility noise). Financial logic decides how many lots you can trade so that the loss at that stop remains acceptable.","If you place stops based only on fear (too tight) or hope (too wide), you often distort both parts of the process. The best workflow is: define setup thesis, define invalidation point, measure stop distance in pips, then compute position size from your fixed risk percentage." ]},
  { heading:"Structure-based stop loss: placing stops at real invalidation points", paragraphs:["Structure-based stops use chart context such as swing highs/lows, support/resistance breaks, range boundaries, and trend structure. For a long trade, a common invalidation is below the most recent swing low that must hold for the thesis to remain valid. For a short trade, it is often above the key swing high.","The advantage of structure-based placement is logic clarity. If price breaks that structure with acceptance, your premise is likely wrong or early. The stop is therefore meaningful, not random. This improves review quality because each stopped trade tells you exactly which market assumption failed.","The downside is that structural stops can be wide in volatile phases. That is not a reason to tighten them arbitrarily. It is a reason to reduce lot size. Traders who force tight stops to keep larger lots often increase stop-out frequency without improving expectancy.","A practical guideline: place the stop beyond structure with a small volatility buffer, then verify whether the resulting position size still fits your plan. If size becomes too small for your strategy economics, skip the trade instead of compromising invalidation quality." ], table:{headers:["Structure context","Example invalidation idea","Common placement logic"], rows:[["Range long","Range floor fails","A few pips below clear support"],["Trend pullback long","Higher-low structure breaks","Below pullback swing low"],["Breakout short failure","Breakout reclaim invalidates short","Above failed-break high"],["News spike fade","Extreme level should hold","Beyond spike extreme + buffer"]]}},
  { heading:"ATR stop loss: adapting to volatility instead of guessing", paragraphs:["ATR (Average True Range) is a volatility measure showing how much price typically moves over a selected period. ATR-based stops scale with current market conditions, which can reduce the problem of stops that are too tight during high volatility and too wide during quiet sessions.","A common method is Stop Distance = ATR × Multiplier. Example: if ATR(14) on your trading timeframe is 18 pips and you use a 1.5 multiplier, stop distance becomes 27 pips. If volatility expands and ATR rises to 28 pips, the same rule yields a 42-pip stop, automatically acknowledging bigger price swings.","ATR stops work best when combined with structure. Pure ATR without context can place exits in technically awkward areas. Structure tells you where invalidation may be; ATR helps choose a realistic buffer so normal noise is less likely to trigger premature exits.","There is no universal best multiplier. Many traders test ranges such as 1.0 to 2.5 and evaluate results by instrument and timeframe. The key is consistency and documented review, not frequent discretionary changes after one or two losses." ]},
  { heading:"Fixed pip stop loss: when simple rules help and when they hurt", paragraphs:["A fixed pip stop means every trade uses the same distance, such as 20 pips or 30 pips. This can simplify execution and journal comparison, especially for one-pair intraday systems with stable volatility windows.","However, fixed pip stops can fail when market regimes change. A 20-pip stop may be reasonable during calm sessions and too small during major news volatility. On other pairs, 20 pips may be excessively wide relative to normal movement. The same number does not always represent the same market meaning.","If you use fixed pip stops, apply strict filters: pair selection, session selection, and volatility condition checks. You can also combine a fixed baseline with a minimum ATR threshold so you avoid trading when your static stop becomes unrealistic.","The central rule remains unchanged: never choose a fixed pip stop only to preserve a preferred lot size. Stop distance should reflect market behavior first. Lot size should adapt second." ], table:{headers:["Method","Strength","Main weakness","Best use case"], rows:[["Fixed pip","Fast and simple","Regime mismatch risk","Narrow strategy with stable volatility"],["Structure-based","Strong market logic","Can be wider stops","Discretionary chart-based trading"],["ATR-based","Adapts to volatility","Needs parameter testing","Systematic or hybrid workflows"],["Structure + ATR buffer","Balanced logic + adaptation","Slightly more complex","Most traders seeking robust consistency"]]}},
  { heading:"Practical calculation example: stop loss placement and lot size connection", paragraphs:["Assume account balance is $10,000 and your risk rule is 1% per trade. Maximum planned loss is therefore $100. You identify a long setup and place a structure-based stop 25 pips away after adding a small ATR-informed buffer.","On a USD-quoted major pair, approximate pip value at 1.00 lot is $10. Risk per 1.00 lot = 25 pips × $10 = $250. Position size = $100 ÷ $250 = 0.40 lots. If stop is hit, planned loss is about $100 before costs.","Now compare two alternative stop methods on the same setup. If a tight fixed stop is 15 pips, risk per 1.00 lot is $150, so size would be 0.67 lots for the same $100 risk. If ATR expansion suggests 40 pips is needed, risk per 1.00 lot is $400, so size falls to 0.25 lots. Same account, same risk%, different stop logic, different lot size.","This is the core connection many beginners miss: stop loss decides distance, and distance decides size. Trying to lock size first usually degrades stop quality. Plan invalidation first, then compute lots." ], table:{headers:["Scenario","Stop distance","Risk per 1.00 lot","Lot size for $100 risk"], rows:[["Fixed tight stop","15 pips","$150","0.67 lots"],["Structure + buffer","25 pips","$250","0.40 lots"],["High-volatility ATR stop","40 pips","$400","0.25 lots"]]}},
  { heading:"Common stop-loss placement mistakes", paragraphs:["A frequent mistake is placing stops at obvious crowd levels with no buffer, then getting clipped by routine liquidity sweeps. Another common error is moving the stop farther after entry because the trader does not want to take the planned loss. This changes risk mid-trade and breaks your statistics.","Some traders place stops based on money only (for example, always risking exactly 10 pips) without checking whether that level invalidates anything technical. Others do the opposite: they choose a technically valid 60-pip stop but forget to reduce lot size, accidentally risking far more than planned.","Beginners also overlook volatility timing. A stop that was reasonable pre-news may be unrealistic during high-impact releases. If execution conditions are unstable, reducing size or skipping entries is often safer than forcing normal rules into abnormal conditions.","Finally, many traders ignore spread and slippage effects. Realized losses can exceed planned losses, especially around news. Using conservative sizing buffers and avoiding thin-liquidity periods can improve consistency." ]},
  { heading:"Beginner tips for setting stop loss properly", paragraphs:["Write a one-line invalidation statement before entry: What exactly must remain true for this trade to make sense? Your stop should sit where that statement is false. If you cannot write this clearly, the trade idea is probably not ready.","Use one primary stop method for at least 30 to 50 trades before judging it. Constantly switching between fixed, ATR, and structural styles makes data noisy. Consistency first, optimization second.","Always calculate position size after finalizing stop distance. If your calculated lot is below broker minimum or too small for your plan, skip the setup rather than forcing a weaker stop.","Review stopped trades weekly and classify them: valid stop-out, avoidable premature stop, rule violation, or volatility anomaly. This turns stop loss from a painful event into a feedback tool that improves execution quality over time." ]},
  { heading:"FAQ", paragraphs:["<strong>Should I ever trade without a stop loss?</strong><br/>For most retail traders, no. A defined stop is a core risk-control mechanism, especially when unexpected volatility appears.","<strong>Is ATR stop loss better than structure-based stop loss?</strong><br/>Not universally. Structure defines invalidation logic, ATR improves volatility adaptation. Many traders combine both.","<strong>Can I keep the same lot size and only change stop distance?</strong><br/>You can, but then your risk percentage changes each trade. Risk-based traders usually keep risk% constant and adapt lot size.","<strong>What if my stop is technically valid but too wide?</strong><br/>Reduce lot size to maintain planned risk, or skip the trade if the required size is impractical.","<strong>Do calculators guarantee safe trading?</strong><br/>No. They improve planning accuracy, but slippage, gaps, and execution conditions can still affect outcomes." ]}
];

const positionVsLotSections = [
  { heading:"Introduction: position size and lot size are related but not identical", paragraphs:["Many forex beginners use the terms position size and lot size as if they mean the same thing. They are connected, but they are different layers of the same decision. Position size describes total market exposure (usually in units or monetary risk). Lot size is the order-format expression your broker platform uses to execute that exposure.","Understanding this difference is essential for risk control. If you only think in lots, you may miss how much account risk you are actually taking. If you only think in dollars without converting to lots correctly, execution errors occur. The safest process moves from risk amount to units, then from units to broker lot format.","In this guide you will learn how units, contract size, standard/mini/micro lots, and pip value connect to practical position sizing. You can test calculations with the <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a>, check trade payoff with the <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a>, and model account pressure with the <a class='underline' href='/drawdown-calculator'>Drawdown Calculator</a>." ]},
  { heading:"Core definitions: position size, lot size, units, and contract size", paragraphs:["Position size is the amount you choose to expose in a trade based on your risk plan. You can express it as units (for example, 18,000 units), as lots (0.18 lots if standard contract size is 100,000), or as expected dollar risk at stop loss.","Lot size is the broker execution label. In spot forex, 1 standard lot usually represents 100,000 units of base currency. A mini lot is 10,000 units, and a micro lot is 1,000 units. Some brokers allow fractional lot increments such as 0.01 or even 0.001.","Contract size is the conversion bridge. If contract size for 1.00 lot is 100,000 units, then 0.35 lots equals 35,000 units. If you misunderstand contract size, you can oversize dramatically even when your risk formula is correct." ], table:{headers:["Term","Meaning","Typical expression"], rows:[["Position size","Chosen market exposure based on risk","25,000 units or 0.25 lots"],["Lot size","Broker order format","1.00, 0.10, 0.01 lots"],["Units","Raw quantity of base currency","100,000 / 10,000 / 1,000"],["Contract size","Units represented by 1.00 lot","Usually 100,000 in spot forex"]]}},
  { heading:"Standard, mini, and micro lots: translating exposure into practical order size", paragraphs:["Standard, mini, and micro lots are scaling tools, not strategy types. Standard lot = 100,000 units. Mini lot = 10,000 units. Micro lot = 1,000 units. A 0.23 lot trade equals 23,000 units, which can also be viewed as 2.3 mini lots or 23 micro lots.","These labels matter because traders often think psychologically in rounded lot numbers. But risk control is cleaner when you think first in units or dollar risk, then convert to lots your platform accepts.","For small accounts, micro-lot precision can be the difference between disciplined risk and accidental over-risking. If your calculation says 0.03 lots and broker minimum is 0.10, you cannot execute that risk model on the same instrument without adjusting account choice, instrument, or stop distance.","Always confirm broker lot step size and minimum trade size before finalizing a system. Execution constraints are part of risk design, not an afterthought." ]},
  { heading:"Pip value and why it changes the position-size decision", paragraphs:["Pip value converts market movement into money impact. On many USD-quoted major pairs, a rough estimate is $10 per pip at 1.00 standard lot, $1 per pip at 0.10 lot, and $0.10 per pip at 0.01 lot. But this is not universal across all pairs and account currencies.","Because pip value can vary, two trades with identical lot size and stop distance can still produce different money risk. That is why robust position sizing uses actual pip value (or broker-provided approximation) instead of fixed assumptions.","Risk formula in practice: Risk Amount = Account × Risk%. Risk per 1.00 lot = Stop Pips × Pip Value. Lot Size = Risk Amount ÷ Risk per 1.00 lot. This formula links position size directly to risk control.","If pip value is misestimated, position size errors follow immediately. Conservative traders either verify pip value in platform order tickets or use dedicated calculators before execution." ], table:{headers:["Lot size","Approx pip value (USD-quoted majors)","P/L impact of 25-pip move"], rows:[["1.00 lot","~$10/pip","~$250"],["0.10 lot","~$1/pip","~$25"],["0.01 lot","~$0.10/pip","~$2.50"],["0.25 lot","~$2.50/pip","~$62.50"]]}},
  { heading:"Practical calculation example: from risk plan to final lot", paragraphs:["Assume account equity is $7,500 and you risk 1% per trade. Risk amount is $75. You find a setup requiring a 30-pip stop. Pip value at 1.00 lot is approximately $10 on this pair.","Risk per 1.00 lot = 30 × $10 = $300. Therefore lot size = $75 ÷ $300 = 0.25 lots. In units, 0.25 × 100,000 = 25,000 units. If stop is hit, expected loss is around $75 plus costs.","Now test what happens if the same setup requires a wider 45-pip stop. Risk per 1.00 lot becomes $450, so lot size falls to about 0.17 lots (17,000 units). Position size changed because market invalidation distance changed, while risk% stayed constant.","This demonstrates the key difference: position size is the risk-driven outcome; lot size is the execution format. When traders lock lot size first, risk becomes unstable." ], table:{headers:["Input","Case A","Case B"], rows:[["Account equity","$7,500","$7,500"],["Risk %","1%","1%"],["Dollar risk","$75","$75"],["Stop distance","30 pips","45 pips"],["Risk per 1.00 lot","$300","$450"],["Final lot size","0.25 lots","0.17 lots"],["Units","25,000","17,000"]]}},
  { heading:"How position size connects to risk control and account survival", paragraphs:["Risk control is the reason position sizing exists. A technically good setup with oversized exposure can still damage the account during normal variance. A moderate setup with disciplined exposure can be survivable long enough to realize its edge.","When you keep risk per trade consistent, your drawdown behavior becomes more predictable. This allows better planning for losing streaks, easier emotional control, and clearer strategy evaluation.","Position sizing also affects portfolio concentration. Three correlated positions at 1% each may behave like one larger directional bet. So risk control should include both trade-level size and total simultaneous exposure.","A practical framework is to cap single-trade risk and cap total open risk. Example: 1% max per trade and 3% max across all open positions. This reduces the chance that one correlated move causes outsized equity damage." ]},
  { heading:"Common mistakes when comparing position size vs lot size", paragraphs:["A common mistake is saying 'I always trade 0.10 lot' regardless of stop distance, pair volatility, or account growth. This is fixed lot sizing, not fixed risk sizing, and it causes hidden risk drift.","Another mistake is ignoring units and contract size. Traders may think 0.50 means half-risk in every context, but without understanding contract specs, they can misread true exposure.","Some beginners also confuse leverage with safe position size. Higher leverage availability does not mean higher risk capacity. Risk capacity is defined by your stop-based loss plan, not by maximum margin offered.","Finally, traders often skip post-trade auditing. If planned risk was $50 but realized stop losses frequently print $58 to $65, you need to account for spreads, slippage, and execution timing instead of assuming the formula failed." ]},
  { heading:"Beginner tips for using both terms correctly", paragraphs:["Start every trade plan with these three lines: account equity, risk percentage, and invalidation stop in pips. Then compute dollar risk and convert to lot size. This keeps terminology and execution aligned.","Think in units when learning. If 0.12 lots feels abstract, rewrite it as 12,000 units. This often improves intuition about exposure.","Create a broker-spec sheet containing minimum lot, lot step, contract size, and average spread for each pair you trade. Keep it visible near your order checklist.","Use consistent tools: <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a> for pre-trade size, <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a> for target quality, and <a class='underline' href='/drawdown-calculator'>Drawdown Calculator</a> for stress testing your risk model.","Most importantly, avoid optimizing for 'big lot numbers.' Optimize for repeatable risk control. Position size discipline is what keeps you in the game long enough for skill to matter." ]},
  { heading:"FAQ", paragraphs:["<strong>Is position size the same as lot size?</strong><br/>Not exactly. Position size is the risk-driven exposure decision; lot size is the broker format used to execute it.","<strong>What is a standard lot in forex?</strong><br/>Typically 100,000 units of base currency, though you should always confirm broker contract specifications.","<strong>Why does my lot size change if my risk % stays the same?</strong><br/>Because stop distance and pip value can change between setups. Fixed risk% means lot size must adapt.","<strong>Can micro lots help beginners?</strong><br/>Yes. Smaller increments allow finer risk control, especially on small accounts.","<strong>Does using smaller lots mean lower-quality trading?</strong><br/>No. Smaller lots often indicate stronger risk discipline and better long-term survivability." ]}
];

const lotSizeCalculatorUsageSections = [
  { heading:"Introduction: a lot size calculator is only as good as the inputs", paragraphs:["A forex lot size calculator can prevent oversizing, but only when you enter accurate numbers. Many beginners think the tool itself creates safe trades. In reality, the calculator simply converts your assumptions into a position size. If your assumptions are wrong, the output is wrong.","This guide explains exactly how to use the <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a> before placing a trade: account balance, risk percentage, stop loss in pips, pip value, and result validation. You will also compare 0.5%, 1%, and 2% risk settings and learn common input mistakes that quietly increase risk.","Treat this process as a pre-trade risk routine, not a one-time lesson. The goal is consistent execution across many trades so your risk profile stays stable while strategy performance is evaluated." ]},
  { heading:"Step 1: Enter account balance (or equity) correctly", paragraphs:["Start with the real base you are risking. If your platform balance is $5,000 but your open positions show floating loss, equity may be lower. Using balance can be acceptable when no other trades are open; using equity is often safer when exposure already exists.","The key is consistency. Switching between balance and equity randomly makes risk tracking messy. Pick one rule and keep it in your journal. Beginners commonly use equity for live execution because it reflects current account condition.","Do not inflate this number to a future target. Enter the current value only. Lot size should reflect what the account can safely lose now, not what you hope it becomes later." ]},
  { heading:"Step 2: Set risk percentage and compare 0.5%, 1%, and 2%", paragraphs:["Risk percentage is the maximum planned loss for the trade if stop loss is hit. New traders often test 0.5%, 1%, and 2%. The difference looks small, but streak impact is large.","Example with a $4,000 account: 0.5% risks $20, 1% risks $40, and 2% risks $80. If you take six losses in a row, those models produce very different drawdowns. Lower risk gives more room to learn and keeps emotions calmer during normal variance.","You can model survivability with the <a class='underline' href='/drawdown-calculator'>Drawdown Calculator</a>. Then choose a setting you can execute consistently. For most beginners, 0.5% to 1% is easier to sustain than 2%."] , table:{headers:["Risk setting","Dollar risk on $4,000","Approx 6-loss streak impact"], rows:[["0.5%","$20","about -3.0%"],["1.0%","$40","about -5.9%"],["2.0%","$80","about -11.4%"],["Practical note","Lower risk = slower growth","but better survival"]]}},
  { heading:"Step 3: Enter stop loss in pips from market structure", paragraphs:["Stop loss pips should come from chart invalidation, not from a preferred lot size. Decide where the setup is objectively wrong, then measure pip distance from entry to that level.","If you arbitrarily tighten stops to get bigger lot sizes, your stop is more likely to be hit by normal noise. If you place very wide stops with no structure logic, reward requirements may become unrealistic.","A good routine is: define entry, define invalidation level, calculate stop pips, and only then run calculator inputs. After that, use the <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a> to confirm your target still offers acceptable payoff." ]},
  { heading:"Step 4: Verify pip value before trusting the result", paragraphs:["Pip value is often approximated as $10 per pip at 1.00 lot for many USD-quoted major pairs, but this is not universal. Cross pairs and non-USD account currencies can differ.","If pip value is entered incorrectly, lot size output can be materially wrong. A 20% pip value error means your real risk may also be off by about 20%.","Check pip value from your platform or trusted forex risk tools before execution. When uncertain, reduce size slightly rather than assuming the highest possible lot."], table:{headers:["Input","Correct example","Common mistake"], rows:[["Pip value","Use pair-specific value","Assume all pairs are $10/pip"],["Stop pips","Measured from chart invalidation","Random fixed 20 pips every trade"],["Risk %","Matches written plan","Changed impulsively after wins/losses"],["Final lot","Rounded down to step size","Rounded up and over-risked"]]}},
  { heading:"Practical full example: using calculator output before placing a trade", paragraphs:["Suppose account equity is $6,200, risk is 1%, stop loss is 28 pips, and pip value is $10 per pip at 1.00 lot. Risk amount is $62. Risk per full lot is $280. Calculated lot size is $62 ÷ $280 = 0.22 lots.","Before placing the order, validate execution constraints: broker minimum lot, lot increment, spread conditions, and whether correlated open trades already exist. If your broker uses 0.01 steps, 0.22 is valid. If slippage is likely around news, a conservative trader may reduce to 0.21.","Then confirm reward structure. If target is 56 pips, the setup is roughly 1:2. If target is only 20 pips, payoff may not justify the risk unless your strategy has high win-rate evidence.","This extra minute of verification is where many bad trades are filtered out. The calculator gives a number; your process decides whether the trade quality deserves that exposure." ]},
  { heading:"Common input mistakes that distort lot-size results", paragraphs:["Using account balance from last week instead of current equity is a frequent error. Another is forgetting to update stop pips when entry price changes.","Some traders enter risk percentage as whole dollars by mistake, or mix decimal conventions. For example, entering 1 as 1% is correct in many tools, but entering 0.01 may be interpreted as 0.01% depending on interface. Always re-check risk amount output.","Another issue is copying pip value from EURUSD and reusing it on every pair. This leads to hidden under- or over-risking. Finally, beginners may round lot size up to the nearest preferred number, which breaks the risk cap."]},
  { heading:"Beginner tips: how to use the lot size calculator before every trade", paragraphs:["Create a fixed pre-trade checklist: account equity, risk %, stop pips, pip value, calculator result, reward ratio, and current total open risk. If one field is missing, do not click buy/sell.","Compare three risk profiles in advance (0.5%, 1%, 2%) and decide your default setting before market hours. Pre-commitment reduces emotional changes after wins or losses.","Use a simple journal tag called 'calculator compliant: yes/no'. Reviewing this tag weekly quickly shows whether losses are strategy-driven or discipline-driven.","Keep all three tools in one workflow: <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a> for trade size, <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a> for payoff quality, and <a class='underline' href='/drawdown-calculator'>Drawdown Calculator</a> for account-level survivability." ]},
  { heading:"FAQ", paragraphs:["<strong>Should I use 0.5%, 1%, or 2% risk as a beginner?</strong><br/>Many beginners start at 0.5% to 1% because it is easier to maintain during losing streaks.","<strong>Can I calculate lot size once and reuse it all week?</strong><br/>Not reliably. Stop distance, equity, and pip value can change, so recalculate each trade.","<strong>Why is my real loss slightly bigger than calculator risk?</strong><br/>Spread, commission, and slippage can increase realized loss versus planned loss.","<strong>Is a larger lot size better if I feel confident?</strong><br/>Confidence should not override the risk plan. Oversizing during emotional periods often causes larger drawdowns."]}
];

const forexRiskChecklistSections = [
  { heading:"Introduction: risk management is a routine, not a prediction", paragraphs:["Most beginners search for entries first and risk rules later. Professional development is the opposite: define risk first, then decide whether a setup deserves capital. A simple checklist can reduce impulse trades and help you stay consistent in changing market conditions.","This guide gives a beginner-friendly forex risk management checklist covering risk per trade, stop loss placement, position sizing, drawdown limits, risk-reward ratio, journal habits, and overtrading control. You will also see where calculators fit before every order.","The objective is not to avoid all losses. The objective is to keep losses planned, measurable, and survivable so you can improve over time." ]},
  { heading:"Checklist item 1: define risk per trade before chart analysis", paragraphs:["Write a fixed risk range such as 0.5% to 1% per trade. This converts uncertainty into a known maximum loss. Without this number, every trade can accidentally become a different bet size.","Choose a percentage based on psychological tolerance, not excitement. If three normal losses make you want to break rules, your risk is probably too high.","Pre-calculate dollar risk for your account tiers so decisions are faster during market hours. Example: on $3,000, 0.5% is $15 and 1% is $30."] , table:{headers:["Account size","0.5% risk","1% risk","2% risk"], rows:[["$2,000","$10","$20","$40"],["$5,000","$25","$50","$100"],["$10,000","$50","$100","$200"],["Use case","Learning phase","Balanced","Aggressive for beginners"]]}},
  { heading:"Checklist item 2: place stop loss using invalidation logic", paragraphs:["A stop loss should mark the price level where your trade idea is no longer valid. It is not a random fixed number of pips.","Structure-based stops (beyond swing highs/lows, range boundaries, or invalidation zones) are generally more robust than arbitrary stops. After identifying stop location, measure pips and use that distance for position sizing.","Never widen stops after entry just to avoid a loss. That changes risk mid-trade and usually worsens drawdown behavior." ]},
  { heading:"Checklist item 3: calculate position size every time", paragraphs:["Position sizing links your risk rule to actual order size. Use the <a class='underline' href='/lot-size-calculator'>Lot Size Calculator</a> before each trade. Required inputs are account value, risk %, stop pips, and pip value.","If result is not executable due to broker lot step or minimum lot, do not round up aggressively. Either round down or skip the trade.","Also check portfolio exposure. Three correlated trades at 1% each can create concentrated risk beyond your intended cap. A common beginner safeguard is 1% max per trade and 2% to 3% total open risk." ]},
  { heading:"Checklist item 4: confirm risk-reward ratio and trade quality", paragraphs:["Before entry, compute expected reward relative to planned risk using the <a class='underline' href='/risk-reward-calculator'>Risk Reward Calculator</a>. Many traders use a minimum threshold such as 1:1.5 or 1:2 when structure supports it.","A high ratio on paper is not enough. Target must be realistic for session volatility and market context. Forcing distant targets often reduces practical win rate.","This step helps filter low-quality trades and reinforces patience. Sometimes the best risk decision is no trade." ]},
  { heading:"Checklist item 5: set drawdown limits and response rules", paragraphs:["Drawdown limits protect the account when performance degrades. Use the <a class='underline' href='/drawdown-calculator'>Drawdown Calculator</a> to simulate losing streaks at your current risk setting.","Define response actions before the week starts. Example: reduce risk by half after 6% drawdown, pause new trades at 10%, and review journal before resuming.","Without response rules, traders often increase size during stress and deepen losses. With response rules, decisions remain structured under pressure." ]},
  { heading:"Checklist item 6: maintain a basic trading journal habit", paragraphs:["A beginner journal does not need complex analytics. Track setup type, session, planned risk, planned R multiple, realized result, and rule compliance.","Add one behavioral note per trade: rushed, calm, revenge impulse, or patient execution. Over time, this reveals patterns that chart screenshots alone miss.","Weekly review should answer three questions: Did I follow risk limits? Did I move stops or targets emotionally? Which setup types respected my checklist most consistently?" ]},
  { heading:"Checklist item 7: avoid overtrading with hard limits", paragraphs:["Overtrading is often a risk-management failure disguised as effort. Too many low-quality trades increase transaction costs and psychological fatigue.","Set hard limits such as max trades per day, max consecutive losses before pause, and no new trades after daily loss threshold. These limits reduce emotional spirals.","Use a 'pre-trade calculator check' rule: no calculator inputs, no trade. This one rule alone can remove many impulsive entries."]},
  { heading:"Common mistakes beginners make with risk management", paragraphs:["Changing risk size after a win streak, moving stop loss farther, and skipping calculator checks are common execution errors. Another frequent issue is focusing on win rate while ignoring average loss size.","Some traders track balance only and ignore floating equity drawdown. Others keep adding correlated positions and unknowingly exceed account-level risk.","A final mistake is trying to recover quickly after losses. Recovery urgency often leads to overtrading and larger position sizes, creating deeper drawdowns." ]},
  { heading:"Beginner tips: a one-page checklist you can use daily", paragraphs:["Before session: confirm account value, daily loss limit, and maximum open risk. During setup: validate stop loss, calculate lot size, and check risk-reward ratio. Before entry: confirm no rule conflicts and no revenge motivation.","After trade: log planned vs realized risk, note any deviation, and rate execution quality from 1 to 5. End of day: stop trading if daily limits are hit.","Keep the checklist short enough to use under pressure. Consistency beats complexity. As your data grows, refine rules using evidence rather than emotions.","A practical print-friendly checklist can include twelve yes/no prompts: (1) Is risk per trade within plan? (2) Is stop loss based on invalidation? (3) Was lot size calculated with current equity? (4) Is pip value verified for this pair? (5) Is risk-reward acceptable for current market structure? (6) Are there correlated open trades already? (7) Is total open risk below cap? (8) Have major news conditions been considered? (9) Is this setup in my tested playbook? (10) Am I below daily trade limit? (11) Am I emotionally neutral right now? (12) Did I define exit conditions before entry?", "You can score this checklist quickly. If any critical risk item fails, mark the trade as no-go. Critical items usually include risk %, stop logic, lot size, and total open risk. This binary method prevents you from negotiating with rules mid-session.", "At week end, summarize checklist compliance as a percentage. For example, 42 trades with 38 full-compliance entries equals 90.5% process quality. Then compare that with performance metrics like average R, drawdown, and rule violations. Over time, you will often find that stronger checklist compliance correlates with smoother equity behavior even when win rate is unchanged." ]},
  { heading:"FAQ", paragraphs:["<strong>What is a good risk per trade for beginners?</strong><br/>Many beginners use 0.5% to 1% because it improves survivability and emotional control.","<strong>Do I need a trading journal if I am on demo?</strong><br/>Yes. Demo journaling builds habits and reveals process issues before real-money exposure.","<strong>How do I avoid overtrading after losses?</strong><br/>Use predefined pause rules, daily loss caps, and mandatory calculator checks before each new trade.","<strong>Should I use calculators on every trade?</strong><br/>Yes. Recalculating risk and position size each setup helps prevent hidden exposure drift."]}
];


const leverageRiskSections = [
  { heading:"Introduction", paragraphs:["Leverage in forex is a tool that lets you control a larger trade value using a smaller amount of your own capital. Traders often hear leverage described as a shortcut to bigger returns, but that framing is incomplete and can be dangerous. A more accurate way to view leverage is this: leverage is exposure amplification. It increases the speed at which your account can move in either direction. If your plan is disciplined and your sizing is controlled, leverage can be an execution mechanism. If your sizing is careless, leverage can accelerate drawdown and margin stress very quickly.","In practical terms, leverage is usually shown as a ratio such as 1:10, 1:50, or 1:100. The first number represents your margin capital, and the second number represents how much notional position value you can control. At 1:50, each $1 of required margin controls $50 of position value. That does not mean your trade risk is automatically safe or automatically unsafe; risk depends on your stop distance, lot size, and total exposure. This is why professional risk planning treats leverage, lot size, and stop loss as a connected system rather than separate decisions."]},
  { heading:"What leverage means in forex", paragraphs:["Forex positions are quoted in units or lots, and every position has a notional value. Without leverage, many retail traders would not be able to access meaningful position sizes because the full notional amount would need to be funded. Leverage reduces the upfront capital required to open and hold that position. The reduced capital is called margin. Margin is not a fee; it is collateral reserved by the broker while the position remains open.","A key distinction for beginners is the difference between access and affordability. Leverage gives access to larger positions, but it does not make those positions affordable from a risk perspective. A trader with a $2,000 account can open a very large position when high leverage is available, but one unfavorable move can still cause losses that are outsized relative to the account. So the correct sequence is: define acceptable risk first, calculate position size second, and only then check whether margin requirements allow execution."]},
  { heading:"How leverage controls larger positions with smaller margin", paragraphs:["Suppose EUR/USD notional exposure is $10,000. At 1:10 leverage, margin requirement is about $1,000. At 1:50 leverage, margin requirement drops to about $200. At 1:100 leverage, margin requirement is around $100. The position exposure is still $10,000 in all three cases. What changes is how much of your account is locked as collateral and how much free margin remains as a buffer against adverse moves.","This is where many mistakes happen. Traders may see low margin requirements and assume the position is small enough to be safe. In reality, the price sensitivity of the position is unchanged by the leverage setting. If the market moves 50 pips against the trade, the profit or loss from that move depends on position size, not on how little margin was posted. Lower margin requirements can create a false sense of safety, encouraging oversizing and tighter tolerance to drawdown."]},
  { heading:"Leverage examples: 1:10 vs 1:50 vs 1:100", paragraphs:["A simple side-by-side comparison helps. Imagine a trader with $5,000 equity considering a 0.50 lot EUR/USD position (roughly $50,000 notional). At 1:10, required margin is about $5,000, meaning nearly all equity is tied up and the trade may not be practical. At 1:50, used margin is about $1,000. At 1:100, used margin is about $500. As leverage increases, the same position becomes easier to open, but risk from price movement remains tied to lot size and stop distance.","Now assume a 40-pip stop and roughly $5 per pip for 0.50 lot. Planned risk is about $200 before costs. That $200 risk does not become smaller at 1:100; it remains a function of pip value and stop distance. The only thing that changed is margin usage and free-margin cushion. If the trader instead increases size to 1.50 lots only because margin allows it, risk triples immediately. This is why higher leverage can indirectly increase loss size: it tempts larger positions that exceed the trader’s risk budget."], table:{headers:["Leverage","Notional Position","Approx. Margin Required","Risk if 40-pip stop at $5/pip equivalent"], rows:[["1:10","$50,000","$5,000","~$200 (if size remains 0.50 lot equivalent)"],["1:50","$50,000","$1,000","~$200 (same size, same stop)"],["1:100","$50,000","$500","~$200 (same size, same stop)"]] }},
  { heading:"Connection between leverage and lot size", paragraphs:["Lot size is the direct driver of pip value, and pip value drives how quickly P/L changes. Leverage does not change pip value by itself; it changes how much margin is required to carry that lot size. Because of this, leverage and lot size are tightly linked at the execution stage. Higher leverage enables larger lot sizes for the same account balance, which can be helpful only if your risk model supports those sizes. If it does not, high leverage becomes a risk amplifier.","A robust process is to start with risk-per-trade (for example, 0.5% to 1%), then use stop distance to calculate lot size. Traders can use the <a class='underline' href='/#lot-size'>Lot Size Calculator</a> to size by risk rather than by impulse. After lot size is chosen, check margin impact and free-margin headroom. If free margin is too thin, reduce size. This sequence keeps lot size aligned with risk control instead of letting maximum available leverage dictate exposure."]},
  { heading:"Practical example: conservative vs aggressive leverage behavior", paragraphs:["Trader A and Trader B both have $3,000 accounts and both want to trade the same setup with a 30-pip stop. Trader A risks 0.75% ($22.50) and calculates lot size accordingly, resulting in a small position. Trader B ignores risk percentage, notices high leverage availability, and opens a position four times larger. If the stop is hit, Trader A takes a manageable planned loss and can continue following the system. Trader B takes a much larger hit, which can trigger emotional trading and potentially a second oversized attempt to recover.","After two or three losses, the difference becomes structural. Trader A still has margin flexibility and lower drawdown pressure. Trader B may face reduced free margin and be forced into reactive decisions. The lesson is not that leverage is inherently bad; the lesson is that leverage without position-sizing discipline is unstable. Conservative planning focuses on account survival first, because survival is what allows long-term performance metrics to matter."]},
  { heading:"Common mistakes beginners make with leverage", paragraphs:["First, confusing low margin requirement with low risk. Second, choosing lot size based on maximum allowed leverage rather than predefined risk percentage. Third, ignoring total portfolio exposure when multiple positions are open at the same time. Fourth, tightening stops unrealistically to justify bigger size, which often increases stop-out frequency. Fifth, escalating position size after wins due to overconfidence.","Another common error is neglecting drawdown math. A 20% drawdown requires a 25% recovery just to break even, and deeper drawdowns require disproportionately larger gains. Traders can model these scenarios with the <a class='underline' href='/#drawdown'>Drawdown Calculator</a>. Pairing drawdown awareness with the <a class='underline' href='/#risk-reward'>Risk Reward Calculator</a> helps set realistic targets instead of chasing oversized exposure."]},
  { heading:"Beginner tips for using leverage more safely", paragraphs:["Start with lower effective exposure even if the broker offers high leverage. Keep risk per trade small and consistent, and cap total simultaneous risk across open trades. Recalculate lot size every trade instead of reusing old numbers when volatility conditions change. Use hard stop losses and avoid removing stops after entry. Focus on process metrics such as rule adherence, average loss size, and maximum drawdown.","Build a written risk protocol inside your <a class='underline' href='/'>forex risk tools</a> workflow: pre-trade sizing, post-trade journal, and weekly exposure audit. If you are new, prioritize consistency over speed of account growth. Smaller position sizes can feel slow, but they reduce decision stress and improve the chance of executing your strategy correctly over a meaningful sample."]},
  { heading:"FAQ", paragraphs:["<strong>Is higher leverage always more dangerous?</strong><br/>Higher available leverage is not automatically dangerous by itself. Danger comes from using it to oversize positions relative to your risk plan.","<strong>Should beginners use 1:100 leverage?</strong><br/>Beginners should avoid treating high leverage as a target. A conservative approach is to size by risk first and keep effective exposure low.","<strong>Does lower leverage guarantee lower losses?</strong><br/>No. Loss size still depends on lot size and stop distance. Lower leverage can reduce the ability to oversize, but discipline remains essential.","<strong>What tool should I use before placing a leveraged trade?</strong><br/>Use the lot size and risk-reward calculators first, then check drawdown impact and margin headroom before execution."]},
  { heading:"Risk disclaimer", paragraphs:["Forex and CFD trading involves substantial risk of loss and is not suitable for every trader. Leverage can magnify both gains and losses. Educational content on BytesTrade is not financial advice."]},
];

const marginCallSections = [
  { heading:"Introduction", paragraphs:["A margin call in forex is a warning state that your account no longer has enough free margin to comfortably support open positions. It is not just a technical alert from a platform; it is a sign that exposure, leverage, and drawdown are out of balance. When traders ignore margin pressure, the process can escalate from warning to forced liquidation, where positions are closed automatically at unfavorable times.","Understanding margin mechanics is essential for risk control. Many traders learn entry patterns before learning margin structure, then discover too late that good analysis can still fail under poor exposure management. The goal of this guide is practical: explain how used margin and free margin work, show how leverage changes margin requirements, and provide conservative ways to reduce margin-call risk without relying on predictions."]},
  { heading:"What a margin call means in practical terms", paragraphs:["Brokers define margin-call levels differently, but the core idea is similar: account equity has dropped close to a threshold relative to used margin. At that point, you may receive warnings, restrictions on opening new trades, or both. If losses continue, the account can hit stop-out level, where positions are closed automatically to protect against negative balance risk.","For traders, margin call should be treated like a risk-governance event. It signals that your current position size is too large for your account volatility tolerance. Instead of looking for a quick recovery trade, the correct response is usually to reduce exposure, reassess open risk, and stabilize free margin. Margin pressure is often a symptom of earlier decisions: oversized lots, correlated positions, or no clear drawdown limits."]},
  { heading:"Used margin, free margin, and margin level", paragraphs:["Used margin is the capital reserved to maintain open positions. Free margin is the remaining equity available to absorb losses or open additional trades. Margin level is commonly calculated as equity divided by used margin, multiplied by 100. A higher margin level generally means more breathing room; a falling margin level indicates growing stress.","Example: If account equity is $4,000 and used margin is $1,000, margin level is 400%. If floating losses reduce equity to $2,000 while used margin stays $1,000, margin level falls to 200%. If equity drops near broker thresholds, margin call risk rises sharply. This is why monitoring only balance is not enough; equity and margin level are real-time safety indicators."]},
  { heading:"How leverage affects margin requirements", paragraphs:["Leverage changes how much margin is needed per position. With higher leverage, each trade requires less used margin, which can leave more free margin initially. That sounds positive, but it can encourage traders to stack more or larger positions than the account can tolerate during adverse moves. In other words, high leverage can postpone visible pressure at entry while increasing hidden pressure during drawdown.","At lower leverage, margin requirements are larger, which can act as a natural brake on oversizing. This does not remove risk, but it can make risk misuse harder. Regardless of leverage setting, exposure must still be sized from risk percentage and stop distance. A trader using modest lot sizes can remain safe under higher leverage, while a trader using oversized lots can reach margin call even under moderate leverage."]},
  { heading:"Practical example: how oversized positions trigger margin calls", paragraphs:["Consider a $2,500 account where a trader opens multiple positions with total used margin of $1,250. Margin level starts around 200% assuming no floating loss. If market moves against the basket and floating loss reaches $800, equity falls to $1,700 and margin level drops to 136%. Another adverse move of $500 reduces equity to $1,200, bringing margin level near 96%, where some brokers may trigger margin call behavior.","The key issue is not one bad tick; it is cumulative exposure relative to account size. If the same trader had used smaller lots and kept used margin at $500, the same dollar drawdown would create much less margin stress. This demonstrates why position sizing and concentration control are more important than trying to guess exact turning points."] , table:{headers:["Scenario","Equity","Used Margin","Free Margin","Margin Level"], rows:[["Initial state","$2,500","$1,250","$1,250","200%"],["After -$800 floating loss","$1,700","$1,250","$450","136%"],["After -$1,300 floating loss","$1,200","$1,250","-$50","96% (high risk)"]]}},
  { heading:"Drawdown and margin pressure connection", paragraphs:["Drawdown and margin pressure are two sides of the same risk event. Drawdown measures decline from peak equity, while margin pressure reflects whether remaining equity is enough to support current exposure. As drawdown deepens, free margin shrinks and margin level falls. That means even a strategy with eventual recovery potential can be forced out early by margin constraints.","Use the <a class='underline' href='/#drawdown'>Drawdown Calculator</a> to map how different loss sequences affect account resilience. Then compare trade planning with the <a class='underline' href='/#risk-reward'>Risk Reward Calculator</a>. If projected drawdown paths bring margin level too close to broker thresholds, reduce size before trading. Margin safety should be designed pre-trade, not improvised during volatility."]},
  { heading:"How to avoid margin calls: practical framework", paragraphs:["Set a maximum risk-per-trade and maximum total open risk. Many beginners start near 0.5% to 1% risk per trade and avoid stacking correlated positions in the same directional theme. Use the <a class='underline' href='/#lot-size'>Lot Size Calculator</a> on every setup, and cap used margin at a conservative internal threshold rather than waiting for broker limits.","Add behavioral rules: pause after a predefined daily loss, reduce size during drawdown, and avoid revenge entries. Keep an emergency rule to cut exposure when margin level falls below your internal warning band. You can build this workflow around BytesTrade <a class='underline' href='/'>forex risk tools</a> so risk checks happen before order placement. Conservative routines reduce both financial and emotional stress."]},
  { heading:"Common mistakes that lead to margin calls", paragraphs:["A frequent mistake is opening several trades that are effectively the same bet, such as highly correlated USD positions, while assuming they are diversified. Another is adding to losing trades without a predefined risk cap. Some traders also ignore overnight volatility and event risk, leaving large exposure through major data releases.","Other errors include using extremely tight stops with oversized lots, then re-entering repeatedly after stop-outs, and relying on balance instead of equity when evaluating safety. Finally, many traders lack a written de-risking protocol. Without predefined actions, decisions under pressure become reactive and often increase risk."]},
  { heading:"Beginner tips for healthier margin management", paragraphs:["Keep leverage as an access tool, not a sizing target. Think in terms of survival: how much adverse movement can your account handle while maintaining decision quality? Track margin level daily, not only when it is already low. Use smaller position sizes during uncertain periods and prioritize consistency over frequency.","Study related guides such as <a class='underline' href='/articles/how-much-should-you-risk-per-trade'>How Much Should You Risk Per Trade?</a> and <a class='underline' href='/articles/what-is-drawdown-in-forex-trading'>What Is Drawdown in Forex Trading?</a>. These help connect trade-level risk with account-level resilience. The strongest beginner edge is not prediction; it is avoiding preventable risk concentration."]},
  { heading:"FAQ", paragraphs:["<strong>Is a margin call the same as stop-out?</strong><br/>Not exactly. Margin call is usually a warning or restriction stage; stop-out is forced position closure when margin conditions worsen.","<strong>Can I avoid margin calls by using lower leverage only?</strong><br/>Lower leverage can help limit oversizing, but it does not replace position-sizing discipline and drawdown control.","<strong>Should I add funds immediately after a margin call warning?</strong><br/>Adding funds may temporarily relieve pressure, but the core solution is usually reducing exposure and improving risk structure.","<strong>What is a healthy margin level target?</strong><br/>There is no universal number, but maintaining a large buffer above broker thresholds is generally safer than operating near minimum limits."]},
  { heading:"Risk disclaimer", paragraphs:["Trading leveraged products involves significant risk, including loss of capital. This article is educational and does not provide investment advice or trading recommendations."]},
];

function LeverageRiskArticlePage(){return <ArticleLayout eyebrow="Forex Risk Management" title="What Is Leverage in Forex and Why It Increases Risk?" description="Expanded educational guide." sections={leverageRiskSections} related={filteredRelated("what-is-leverage-in-forex-and-why-it-increases-risk")}/>}
function MarginCallArticlePage(){return <ArticleLayout eyebrow="Forex Risk Management" title="Margin Call in Forex: What It Means and How to Avoid It" description="Expanded educational guide." sections={marginCallSections} related={filteredRelated("margin-call-in-forex-what-it-means-and-how-to-avoid-it")}/>}

function LotSizeArticlePage(){return <ArticleLayout eyebrow="Forex Risk Management" title="How to Calculate Lot Size in Forex Trading" description="Expanded educational guide." sections={lotSizeSections} related={filteredRelated("how-to-calculate-lot-size-in-forex-trading")}/>}
function RiskRewardArticlePage(){return <ArticleLayout eyebrow="Forex Risk Management" title="What Is Risk Reward Ratio in Forex Trading?" description="Expanded educational guide." sections={rrSections} related={filteredRelated("what-is-risk-reward-ratio-in-forex-trading")}/>}
function DrawdownArticlePage(){return <ArticleLayout eyebrow="Forex Risk Management" title="What Is Drawdown in Forex Trading?" description="Expanded educational guide." sections={drawdownSections} related={filteredRelated("what-is-drawdown-in-forex-trading")}/>}
function RiskPerTradeGuidePage(){return <ArticleLayout eyebrow="Forex Risk Management" title="How Much Should You Risk Per Trade?" description="Expanded educational guide." sections={riskPerTradeSections} related={filteredRelated("how-much-should-you-risk-per-trade")}/>}
function StopLossArticlePage(){return <ArticleLayout eyebrow="Forex Risk Management" title="Stop Loss in Forex: How to Set It Properly" description="Expanded educational guide." sections={stopLossSections} related={filteredRelated("stop-loss-in-forex-how-to-set-it-properly")}/>}
function PositionVsLotArticlePage(){return <ArticleLayout eyebrow="Forex Risk Management" title="Position Size vs Lot Size: What Is the Difference?" description="Expanded educational guide." sections={positionVsLotSections} related={filteredRelated("position-size-vs-lot-size")}/>}
function LotSizeCalculatorUsageArticlePage(){return <ArticleLayout eyebrow="Forex Risk Management" title="How to Use a Forex Lot Size Calculator Correctly" description="Expanded educational guide." sections={lotSizeCalculatorUsageSections} related={filteredRelated("how-to-use-a-forex-lot-size-calculator-correctly")}/>}
function ForexRiskChecklistArticlePage(){return <ArticleLayout eyebrow="Forex Risk Management" title="Forex Risk Management Checklist for Beginners" description="Expanded educational guide." sections={forexRiskChecklistSections} related={filteredRelated("forex-risk-management-checklist-for-beginners")}/>}
