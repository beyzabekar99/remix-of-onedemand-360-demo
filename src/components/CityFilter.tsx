import { MapPin } from "lucide-react";
import { cities } from "@/lib/demo-data";

export function CityFilter({
  value,
  onChange,
  label = "İl",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5">
      <MapPin className="h-3.5 w-3.5 text-primary" />
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
      >
        <option value="all">Tümü</option>
        {cities.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  );
}
