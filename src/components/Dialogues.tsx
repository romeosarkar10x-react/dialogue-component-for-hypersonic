import { useState } from "react";
import Dialogue from "./Dialogue";
import { DIALOGUES } from "@/data/dialogues";

export default function Dialogues() {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-100">
            <div className="max-w-3xl mx-auto py-12">
                {DIALOGUES.map((d, i) => (
                    <Dialogue
                        key={i}
                        dialogue={d}
                        isFirst={i === 0}
                        isLast={i === DIALOGUES.length - 1}
                        isExpanded={expandedIndex === i}
                        onToggle={() => setExpandedIndex(expandedIndex === i ? null : i)}
                    />
                ))}
            </div>
        </div>
    );
}
