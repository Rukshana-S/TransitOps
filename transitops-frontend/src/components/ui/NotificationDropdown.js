'use client';

export default function NotificationDropdown() {
  const items = [
    { title: 'Maintenance due', body: 'Brake inspection required for V-214' },
    { title: 'Fuel alert', body: 'V-198 is running low on fuel' },
    { title: 'License expiry', body: 'Ravi requires document renewal soon' },
  ];

  return (
    <div className="absolute right-0 top-12 z-20 w-72 rounded-[20px] border border-[rgba(247,114,24,0.15)] bg-[rgba(6,9,16,0.95)] p-3 shadow-[0_0_35px_rgba(246,111,20,0.15)]">
      {items.map((item) => (
        <div key={item.title} className="rounded-2xl border border-white/5 p-3 text-sm text-[#CAC4DA]">
          <p className="font-medium text-white">{item.title}</p>
          <p className="mt-1 text-xs">{item.body}</p>
        </div>
      ))}
    </div>
  );
}
