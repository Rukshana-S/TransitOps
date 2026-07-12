'use client';

const base = 'inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F66F14]/40';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-[#F66F14] text-white shadow-[0_0_25px_rgba(246,111,20,0.25)] hover:-translate-y-0.5 hover:shadow-[0_0_35px_rgba(246,111,20,0.35)]',
    secondary: 'border border-[rgba(247,114,24,0.15)] bg-[rgba(33,33,33,0.30)] text-[#CAC4DA] hover:border-[#F66F14]/40 hover:text-white',
    ghost: 'bg-transparent text-[#CAC4DA] hover:bg-[rgba(255,255,255,0.04)] hover:text-white',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
