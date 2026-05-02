import { useCallback, useState } from "react";

/* ═══════════════════════════════════════════════════════════
   useHistory
   ═══════════════════════════════════════════════════════════ */
export function useHistory(initialValue: string) {
    const [past, setPast] = useState<string[]>([]);
    const [present, setPresent] = useState<string>(initialValue);
    const [future, setFuture] = useState<string[]>([]);

    const push = useCallback(
        (newValue: string) => {
            setPast((p) => [...p, present]);
            setPresent(newValue);
            setFuture([]);
        },
        [present],
    );

    const undo = useCallback(() => {
        if (past.length === 0) return;
        setPast((p) => p.slice(0, -1));
        setFuture((f) => [present, ...f]);
        setPresent(past[past.length - 1]);
    }, [past, present]);

    const redo = useCallback(() => {
        if (future.length === 0) return;
        setFuture((f) => f.slice(1));
        setPast((p) => [...p, present]);
        setPresent(future[0]);
    }, [future, present]);

    return {
        value: present,
        push,
        undo,
        redo,
        canUndo: past.length > 0,
        canRedo: future.length > 0,
        undoDepth: past.length,
        redoDepth: future.length,
    };
}
