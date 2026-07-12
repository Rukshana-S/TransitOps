'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#060910] px-6 py-10 text-white sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <header className="flex items-center justify-between rounded-3xl border border-[rgba(247,114,24,0.15)] bg-[rgba(33,33,33,0.30)] px-5 py-4 shadow-[0_0_45px_rgba(246,111,20,0.08)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[radial-gradient(circle,rgba(246,111,20,0.35),rgba(246,111,20,0.08))]">
              <Truck className="h-5 w-5 text-[#F66F14]" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#F66F14]">TransitOps</p>
              <p className="text-sm text-[#CAC4DA]">Transport command platform</p>
            </div>
          </div>
          <Link href="/login" className="rounded-full border border-[rgba(247,114,24,0.15)] px-4 py-2 text-sm text-[#CAC4DA] transition hover:border-[#F66F14]/40 hover:text-white">
            Admin Login
          </Link>
        </header>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="rounded-4xl border border-[rgba(247,114,24,0.15)] bg-[radial-gradient(circle_at_top_left,rgba(246,111,20,0.18),transparent_35%)] p-8 shadow-[0_0_60px_rgba(246,111,20,0.12)] backdrop-blur-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(247,114,24,0.15)] bg-[rgba(246,111,20,0.12)] px-3 py-1 text-sm text-[#F66F14]">
              <Sparkles className="h-4 w-4" />
              Premium fleet intelligence
            </div>
            <h1 className="mt-6 text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Orchestrate every route with clarity and control.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-[#CAC4DA]">
              TransitOps combines dispatch visibility, preventive maintenance, and operations reporting into one futuristic control center.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="inline-flex items-center rounded-2xl bg-[#F66F14] px-5 py-3 font-medium text-white shadow-[0_0_25px_rgba(246,111,20,0.25)]">
                Enter dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center rounded-2xl border border-[rgba(247,114,24,0.15)] px-5 py-3 font-medium text-[#CAC4DA] transition hover:text-white">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Protected access
              </Link>
            </div>
          </div>

          <div className="rounded-4xl border border-[rgba(247,114,24,0.15)] bg-[rgba(33,33,33,0.30)] p-6 shadow-[0_0_45px_rgba(246,111,20,0.1)] backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[#F66F14]">What’s included</p>
            <div className="mt-6 space-y-3">
              {[
                'Vehicle registry and health overview',
                'Live trip dispatch and queue management',
                'Fuel, maintenance, and expense intelligence',
                'Executive dashboards for fleet performance',
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-3 text-[#CAC4DA]">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
