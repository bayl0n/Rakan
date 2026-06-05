# Rakan

Rakan is a personal finance dashboard for estimating Australian take-home pay,
turning that income into a practical budget, and tracking expenses against the
plan.

[View the live app](https://www.rakan.app/)

## Features

- **Pay calculator**: estimate annual taxable income, income tax, Medicare levy,
  HELP repayments, super, and net pay across supported tax years.
- **Flexible income inputs**: enter income by period, choose whether super is on
  top or included, adjust the super rate, and toggle HELP debt repayments.
- **Budget planner**: use preset splits or create a custom allocation across
  fixed expenses, lifestyle expenses, and future savings.
- **Expense tracker**: record one-off or recurring expenses, group by payer and
  category, move between budget periods, and compare spending against remaining
  budget.
- **Local persistence**: expenses are stored in the browser with `localStorage`.
- **Theme support**: switch between light, dark, and system themes.

> Rakan provides estimates for planning and comparison. Always verify tax,
> Medicare levy, super, and HELP repayment details against official ATO guidance
> before making financial decisions.

## Tech Stack

- [Next.js 13](https://nextjs.org/) App Router
- [React](https://react.dev/) and [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Radix UI and shadcn-style components
- [Recharts](https://recharts.org/) for charts
- [React Hook Form](https://react-hook-form.com/) and [Zod](https://zod.dev/)
- Browser `localStorage` for saved expenses

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local environment file if you want to override the default browser
storage key:

```bash
cp .env.example .env.local
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_EXPENSES_STORAGE_KEY` | Optional browser `localStorage` key for saved expenses. Defaults to `rakan:expenses:v1`. |

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Project Structure

```text
app/                  Next.js App Router pages and layout
components/           Dashboard, pay, budget, expense, finance, and UI components
lib/finance/          Pay, tax, budget, expense, and period calculation helpers
styles/               Global Tailwind styles and design tokens
public/               Static assets
```
