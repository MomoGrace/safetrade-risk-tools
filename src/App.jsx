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

const articles = [
  {
    title: "What Is Risk per Trade in Forex?",
    slug: "what-is-risk-per-trade-in-forex",
    description: "Learn what risk per trade means in forex, how to calculate it, and why conservative risk settings matter for EA and prop firm traders.",
    status: "Published",
  },
  {
    title: "Conservative EA Settings for Small Accounts",
    slug: "conservative-ea-settings-for-small-accounts",
    description: "Understand why small accounts often need lower risk, fewer open trades and clear drawdown stop rules.",
    status: "Published",
  },
  {
    title: "Why 0.5% Risk Is Safer for EA Beginners",
    slug: "why-0-5-risk-is-safer-for-ea-beginners",
    description: "A beginner-friendly explanation of why lower risk may help traders survive losing streaks during EA testing.",
    status: "Published",
  },
  {
    title: "Prop Firm Daily Loss and Max Drawdown Explained",
    slug: "prop-firm-daily-loss-and-max-drawdown-explained",
    description: "Learn the difference between daily loss limit and maximum drawdown when trading funded account challenges.",
    status: "Published",
  },
  {
    title: "Why Martingale EA Is Dangerous for Beginners",
    slug: "why-martingale-ea-is-dangerous-for-beginners",
    description: "A simple explanation of why increasing lot size after losses can create large drawdowns during strong trends.",
    status: "Published",
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


const TALLY_URL = "https://tally.so/r/81JKpA";

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <a href="/" className="text-lg font-black tracking-tight">BytesTrade Risk Tools</a>
        <nav className="hidden items-center gap-6 text-sm font-medium text-zinc-600 md:flex">
          <a href="/#ea-calculator" className="hover:text-zinc-950">EA Calculator</a>
          <a href="/#prop-firm" className="hover:text-zinc-950">Prop Firm</a>
          <a href="/#drawdown" className="hover:text-zinc-950">Drawdown</a>
          <a href="/articles" className="hover:text-zinc-950">Articles</a>
            <a href="/about" className="hover:text-zinc-950">About</a>
          <a href="/disclaimer" className="hover:text-zinc-950">Disclaimer</a>
          <a href="/contact" className="hover:text-zinc-950">Contact</a>
        </nav>
        <a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="rounded-full bg-zinc-950 px-5 py-2 text-sm font-semibold text-white hover:bg-zinc-800">
          Get Setup Guide
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
              The fastest way to contact us is through the setup guide form. Your submission will be saved and we will follow up when possible.
            </p>
            <a href={TALLY_URL} target="_blank" rel="noopener noreferrer" className="inline-flex rounded-full bg-zinc-950 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800">
              Open Contact Form
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
        eyebrow="Articles"
        title="Forex risk management articles"
        description="Beginner-friendly guides about forex risk per trade, conservative EA settings, prop firm limits and automated trading risk."
      />
      <ContentPage>
        <div className="grid gap-5 md:grid-cols-2">
          {articles.map((article) => (
            <Card key={article.slug}>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
                  {article.status}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-zinc-950">{article.title}</h2>
              <p className="mt-3 leading-7 text-zinc-600">{article.description}</p>
              {article.status === "Published" ? (
                <a
                  href={`/articles/${article.slug}`}
                  className="mt-5 inline-flex rounded-full bg-zinc-950 px-5 py-2 text-sm font-bold text-white hover:bg-zinc-800"
                >
                  Read article
                </a>
              ) : (
                <p className="mt-5 text-sm font-semibold text-zinc-500">Article draft planned.</p>
              )}
            </Card>
          ))}
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

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-7 text-zinc-600">
            <strong className="text-zinc-950">Risk Disclaimer:</strong> Forex and CFD trading involve risk and may not be suitable for all investors. This article is for educational purposes only and does not provide financial advice, investment advice, trading signals or profit guarantees. Past performance does not guarantee future results. Trade only with money you can afford to lose.
          </div>
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

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-7 text-zinc-600">
            <strong className="text-zinc-950">Risk Disclaimer:</strong> Forex and CFD trading involve risk and may not be suitable for all investors. This article is for educational and risk-planning purposes only. It does not provide financial advice, investment advice, trading signals or profit guarantees. Past performance does not guarantee future results. Trade only with money you can afford to lose.
          </div>
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

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-7 text-zinc-600">
            <strong className="text-zinc-950">Risk Disclaimer:</strong> Forex and CFD trading involve risk and may not be suitable for all investors. This article is for educational and risk-planning purposes only. It does not provide financial advice, investment advice, trading signals or profit guarantees. Past performance does not guarantee future results. Trade only with money you can afford to lose.
          </div>
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

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-7 text-zinc-600">
            <strong className="text-zinc-950">Risk Disclaimer:</strong> Prop firm rules vary by company and can change. Always read the official rules of the prop firm you use. This article is for educational and risk-planning purposes only. It does not provide financial advice, investment advice, trading signals or profit guarantees. Forex and CFD trading involve risk. Past performance does not guarantee future results.
          </div>
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

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 text-sm leading-7 text-zinc-600">
            <strong className="text-zinc-950">Risk Disclaimer:</strong> Forex and CFD trading involve risk and may not be suitable for all investors. This article is for educational and risk-planning purposes only. It does not provide financial advice, investment advice, trading signals or profit guarantees. Past performance does not guarantee future results. Trade only with money you can afford to lose.
          </div>
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
                <a href="#ea-calculator" className="rounded-full bg-white px-6 py-3 text-center text-sm font-bold text-zinc-950 hover:bg-zinc-200">
                  Start Calculating
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
  );
}

export default function App() {
  const path = window.location.pathname;

  useEffect(() => {
    const titles = {
      "/": "BytesTrade Risk Tools | Forex, EA & Prop Firm Calculators",
      "/about": "About | BytesTrade Risk Tools",
      "/privacy-policy": "Privacy Policy | BytesTrade Risk Tools",
      "/disclaimer": "Disclaimer | BytesTrade Risk Tools",
      "/contact": "Contact | BytesTrade Risk Tools",
      "/articles": "Articles | BytesTrade Risk Tools",
      "/articles/what-is-risk-per-trade-in-forex": "What Is Risk per Trade in Forex? | BytesTrade Risk Tools",
      "/articles/conservative-ea-settings-for-small-accounts": "Conservative EA Settings for Small Accounts | BytesTrade Risk Tools",
      "/articles/why-0-5-risk-is-safer-for-ea-beginners": "Why 0.5% Risk Is Safer for EA Beginners | BytesTrade Risk Tools",
      "/articles/prop-firm-daily-loss-and-max-drawdown-explained": "Prop Firm Daily Loss and Max Drawdown Explained | BytesTrade Risk Tools",
      "/articles/why-martingale-ea-is-dangerous-for-beginners": "Why Martingale EA Is Dangerous for Beginners | BytesTrade Risk Tools",
    };
    document.title = titles[path] || "BytesTrade Risk Tools";
  }, [path]);

  let page = <HomePage />;

  if (path === "/about") page = <AboutPage />;
  else if (path === "/privacy-policy") page = <PrivacyPolicyPage />;
  else if (path === "/disclaimer") page = <DisclaimerPage />;
  else if (path === "/contact") page = <ContactPage />;
  else if (path === "/articles") page = <ArticlesPage />;
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
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-zinc-600 md:flex-row md:items-center md:justify-between">
          <p>© 2026 BytesTrade Risk Tools. Educational content only.</p>
          <nav className="flex flex-wrap gap-4">
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
