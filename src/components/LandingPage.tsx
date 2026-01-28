"use client";

import { useLanguage } from "@/lib/i18n";

export function LandingPage() {
  const { copy } = useLanguage();
  const { landing } = copy;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16 space-y-20">
      {/* HERO */}
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-brand-slate">
          {landing.hero.title}
        </h1>
        <p className="text-xl text-slate-600">{landing.hero.subtitle}</p>
        <p className="max-w-2xl mx-auto text-slate-500">
          {landing.hero.description}
        </p>

        <button className="mt-6 rounded-2xl bg-brand-slate px-8 py-4 text-lg font-semibold text-white hover:shadow-xl transition">
          {landing.hero.cta}
        </button>
      </section>

      {/* PROBLEM */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-brand-slate">
          {landing.problem.title}
        </h2>
        <ul className="space-y-2 text-slate-600 list-disc list-inside">
          {landing.problem.items.map((item: string, idx: number) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <p className="font-semibold text-slate-700">
          {landing.problem.conclusion}
        </p>
      </section>

      {/* SOLUTION */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-brand-slate">
          {landing.solution.title}
        </h2>
        <p className="text-slate-600">{landing.solution.description}</p>
        <ul className="grid sm:grid-cols-2 gap-3 text-slate-600">
          {landing.solution.items.map((item: string, idx: number) => (
            <li
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* COMPARISON */}
      <section className="grid sm:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 p-6 space-y-4">
          <h3 className="text-xl font-bold text-slate-700">
            {landing.comparison.free.title}
          </h3>
          <ul className="space-y-2 text-slate-600">
            {landing.comparison.free.features.map(
              (item: string, idx: number) => (
                <li key={idx}>• {item}</li>
              )
            )}
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-brand-slate bg-brand-rose/5 p-6 space-y-4">
          <h3 className="text-xl font-bold text-brand-slate">
            {landing.comparison.pro.title}
          </h3>
          <ul className="space-y-2 text-slate-700">
            {landing.comparison.pro.features.map(
              (item: string, idx: number) => (
                <li key={idx}>✔ {item}</li>
              )
            )}
          </ul>
        </div>
      </section>

      {/* PRICING */}
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-brand-slate">
          {landing.pricing.title}
        </h2>
        <p className="text-4xl font-extrabold">{landing.pricing.price}</p>
        <p className="text-slate-500">{landing.pricing.note}</p>

        <button className="mt-4 rounded-2xl bg-brand-slate px-8 py-4 text-lg font-semibold text-white hover:shadow-xl transition">
          {landing.pricing.cta}
        </button>
      </section>

      {/* TRUST */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-brand-slate">
          {landing.trust.title}
        </h2>
        <ul className="grid sm:grid-cols-2 gap-3 text-slate-600">
          {landing.trust.items.map((item: string, idx: number) => (
            <li
              key={idx}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* FINAL CTA */}
      <section className="text-center space-y-6">
        <h2 className="text-3xl font-bold text-brand-slate">
          {landing.finalCta.title}
        </h2>
        <button className="rounded-2xl bg-brand-slate px-10 py-4 text-lg font-semibold text-white hover:shadow-xl transition">
          {landing.finalCta.cta}
        </button>
      </section>
    </main>
  );
}
