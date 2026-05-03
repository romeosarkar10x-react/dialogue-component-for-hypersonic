export default function Badge({ count }: { count: number }) {
    return count > 0 ? (
        <span className="text-[9px] font-bold bg-primary/90 text-primary-foreground rounded-full min-w-4 h-4 inline-flex items-center justify-center px-1 tabular-nums leading-none">
            {count}
        </span>
    ) : null;
}
