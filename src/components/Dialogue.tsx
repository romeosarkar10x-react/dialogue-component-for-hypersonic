import { useHistory } from "@/hooks/useHistory";
import { Icons } from "@/icons";
import { useEffect, useReducer, useRef, useState, type ChangeEvent } from "react";
import Btn from "./Btn";
import Badge from "./Badge";
import Divider from "./Divider";
import MiniAudioPlayer, { type AudioPlayerAdapterResourceStateType } from "./MiniAudioPlayer";
import { produce } from "immer";
import { PeaksAudioPlayerAdapter } from "@/utils/audio/PeaksAudioPlayerAdapter";
import type { DialogueType } from "@/DialogueType";
import { LuRedoDot, LuUndoDot } from "react-icons/lu";
import { RxDividerVertical } from "react-icons/rx";

const VARIANT_OPTIONS = [1, 2, 3, 4];

/* ═══════════════════════════════════════════════════════════
   Single Dialogue Item
   ═══════════════════════════════════════════════════════════ */

type GenerationSettingsType = {
    numVariants: number;
};

export default function Dialogue({
    dialogue,
    isExpanded,
    onToggle,
    isFirst,
    isLast,
}: {
    dialogue: DialogueType;
    isExpanded: boolean;
    onToggle: () => void;
    isFirst: boolean;
    isLast: boolean;
}) {
    const history = useHistory(dialogue.text);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [numVariants, setNumVariants] = useState(2);
    const [enhancing, setEnhancing] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [generations, setGenerations] = useState(new Array<AudioPlayerAdapterResourceStateType>(0));
    const [settings] = useState<GenerationSettingsType>({
        numVariants: 2,
    });
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && e.target instanceof Node && !dropdownRef.current.contains(e.target))
                setDropdownOpen(false);
        };

        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const startEditing = () => {
        setEditedText(history.value);
        setIsEditing(true);
    };

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            const ta = textareaRef.current;
            ta.focus();
            ta.style.height = "auto";
            ta.style.height = ta.scrollHeight + "px";
        }
    }, [isEditing]);

    const handleInput = (e: ChangeEvent<HTMLTextAreaElement, HTMLTextAreaElement>) => {
        setEditedText(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    };

    const handleSave = () => {
        const trimmed = editedText.trim();
        if (trimmed && trimmed !== history.value) history.push(trimmed);
        setIsEditing(false);
    };
    const handleCancel = () => {
        setEditedText(history.value);
        setIsEditing(false);
    };

    const handleEnhance = () => {
        setEnhancing(true);
        setTimeout(() => {
            history.push(history.value + " — enhanced with deeper emotional resonance.");
            setEnhancing(false);
        }, 1500);
    };
    const [genCount, dispatchActionForGenCount] = useReducer(function reducer(
        state: number,
        action: keyof { 0: "increment"; 1: "decrement" },
    ) {
        switch (action) {
            case 0:
                return state + 1;

            case 1:
                return state - 1;
        }
    }, 0);

    function generate() {
        // const text = dialogue.text;

        const generateOne = async (index: number) => {
            dispatchActionForGenCount(0);
            setGenerations((value) =>
                produce(value, (draft) => {
                    draft[index] = { status: "pending" };
                }),
            );

            // const url = `https://samplelib.com/lib/preview/mp3/sample-${values[randomIndex]}s.mp3`;
            const url = `https://upload.wikimedia.org/wikipedia/commons/a/a9/Tromboon-sample.ogg`;
            let response: Response;

            try {
                response = await fetch(url);
            } catch (thrownError) {
                let error: Error = new Error(`Failed to fetch '${url}'`);

                if (thrownError instanceof Error) {
                    error = thrownError;
                }

                setGenerations((value) =>
                    produce(value, (draft) => {
                        draft[index] = { status: "error", error };
                    }),
                );
                dispatchActionForGenCount(1);
                return;
            }

            if (response.status !== 200) {
                setGenerations((value) =>
                    produce(value, (draft) => {
                        draft[index] = { status: "error", error: new Error(`Response status: ${response.status}`) };
                    }),
                );
                dispatchActionForGenCount(1);
                return;
            }

            const contentType = response.headers.get("content-type");

            if (contentType === null) {
                setGenerations((value) =>
                    produce(value, (draft) => {
                        draft[index] = { status: "error", error: new Error(`'Content-Type' header not present`) };
                    }),
                );
                dispatchActionForGenCount(1);
                return;
            }

            if (contentType !== "audio/mpeg" && contentType !== "audio/wav" && contentType !== "application/ogg") {
                setGenerations((value) =>
                    produce(value, (draft) => {
                        draft[index] = { status: "error", error: new Error(`'Content-Type': ${contentType}`) };
                    }),
                );
                dispatchActionForGenCount(1);
                return;
            }

            const arrayBuffer = await response.arrayBuffer();
            console.log("arrayBuffer:", arrayBuffer);
            const audioPlayer = await PeaksAudioPlayerAdapter.fromArrayBuffer(arrayBuffer);

            setGenerations((value) =>
                produce(value, (draft) => {
                    draft[index] = { status: "success", data: audioPlayer };
                }),
            );
            dispatchActionForGenCount(1);
        };

        setGenerations(Array.from({ length: settings.numVariants }));

        for (let i = 0; i < settings.numVariants; i++) {
            generateOne(i);
        }
    }

    const handleTextareaKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        }
        if (e.key === "Escape") handleCancel();
    };

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (isEditing || !isExpanded) return;
            const mod = e.metaKey || e.ctrlKey;
            if (mod && e.key === "z" && !e.shiftKey) {
                e.preventDefault();
                history.undo();
            }
            if (mod && e.key === "z" && e.shiftKey) {
                e.preventDefault();
                history.redo();
            }
            if (mod && e.key === "y") {
                e.preventDefault();
                history.redo();
            }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [isEditing, isExpanded, history, history.undo, history.redo]);

    return (
        <article
            onClick={() => {
                if (!isExpanded) onToggle();
            }}
            className={[
                "transition-all duration-200 border-b border-border/40",
                !isExpanded && "cursor-pointer hover:bg-muted/20",
                isExpanded && "bg-secondary/30",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className={["px-6", isExpanded ? "pt-5 pb-2" : "py-4"].join(" ")}>
                {/* ── HEADER ── */}
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        {genCount !== 0 && (
                            <span className="text-primary">
                                <Icons.Loader />
                            </span>
                        )}
                        <span className="text-[11px] font-bold tracking-[0.14em] text-primary/90 uppercase">
                            {dialogue.character}
                        </span>
                        <span className="text-[11px] text-muted-foreground">{dialogue.gender}</span>
                        <span className="text-border">·</span>
                        <span className="text-[11px] text-muted-foreground">{dialogue.voice}</span>
                    </div>

                    {/* Undo/Redo in header — always visible when there's history, even when collapsed */}
                    <div className="flex items-center gap-1">
                        {(history.canUndo || history.canRedo) && (
                            <>
                                <Btn
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        history.undo();
                                    }}
                                    disabled={!history.canUndo}
                                    title="Undo"
                                >
                                    {/*<Icons.Undo />*/}
                                    <LuUndoDot size="20px" />
                                </Btn>
                                {/*{history.undoDepth > 0 && <Badge count={history.undoDepth} />}*/}
                                <RxDividerVertical />
                                <Btn
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        history.redo();
                                    }}
                                    disabled={!history.canRedo}
                                    title="Redo"
                                >
                                    {/*<Icons.Redo />*/}
                                    <LuRedoDot size="20px" />
                                </Btn>
                                {/*{history.redoDepth > 0 && <Badge count={history.redoDepth} />} */}
                            </>
                        )}
                        {isExpanded && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isEditing) onToggle();
                                }}
                                className="ml-1 h-7 w-7 inline-flex items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                                title="Collapse"
                            >
                                <Icons.X />
                            </button>
                        )}
                    </div>
                </div>

                {/* ── TEXT ── */}
                {isEditing ? (
                    <div className="space-y-3 mt-1">
                        <textarea
                            ref={textareaRef}
                            value={editedText}
                            onChange={handleInput}
                            onKeyDown={handleTextareaKeyDown}
                            rows={3}
                            className="w-full text-sm text-foreground leading-relaxed bg-background/60 border border-border rounded-lg px-4 py-3 resize-none outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/10 transition-colors"
                        />
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-muted-foreground/70 font-mono">
                                enter → save · esc → cancel
                            </span>
                            <div className="flex items-center gap-2">
                                <Btn onClick={handleCancel} variant="label">
                                    <Icons.X /> Cancel
                                </Btn>
                                <Btn onClick={handleSave} variant="primary">
                                    <Icons.Check /> Save
                                </Btn>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-foreground/90 leading-relaxed select-text">{history.value}</p>
                )}
            </div>

            {/* ── TOOLBAR — only when expanded & not editing ── */}
            {isExpanded && !isEditing && (
                <div className="flex items-center gap-1 px-5 py-2 mt-1 border-t border-border/30">
                    <Btn onClick={startEditing} variant="label" title="Edit">
                        <Icons.Edit /> Edit
                    </Btn>
                    <Btn onClick={handleEnhance} disabled={enhancing} variant="label" title="Enhance with AI">
                        {enhancing ? <Icons.Loader /> : <Icons.Sparkles />} Enhance
                    </Btn>

                    <Divider />

                    <span className="text-[10px] text-muted-foreground mr-1 select-none">Variants</span>
                    <div className="flex gap-px border border-border rounded-lg p-px">
                        {VARIANT_OPTIONS.map((opt) => (
                            <button
                                key={opt}
                                onClick={() => setNumVariants(opt)}
                                className={[
                                    "h-6 w-6 rounded-md text-[10px] font-medium transition-all duration-100",
                                    numVariants === opt
                                        ? "bg-primary text-primary-foreground font-bold"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                                ].join(" ")}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>

                    <div className="ml-auto flex items-center gap-1">
                        <Btn onClick={generate} variant="primary" title="Generate speech">
                            <Icons.Play /> Generate
                        </Btn>

                        <div className="relative" ref={dropdownRef}>
                            <Btn onClick={() => setDropdownOpen((v) => !v)} title="More">
                                <Icons.MoreVert />
                            </Btn>
                            {dropdownOpen && (
                                <div className="absolute right-0 bottom-full mb-1.5 w-40 bg-card border border-border rounded-xl shadow-xl shadow-black/50 py-1 z-50">
                                    <button
                                        disabled={isFirst}
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                    >
                                        <Icons.ArrowUp /> Move Up
                                    </button>
                                    <button
                                        disabled={isLast}
                                        onClick={() => setDropdownOpen(false)}
                                        className="flex items-center gap-2.5 w-full px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
                                    >
                                        <Icons.ArrowDown /> Move Down
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ── GENERATIONS ── */}
            {generations.length > 0 && isExpanded && (
                <div className="px-6 py-3 border-t border-border/30">
                    <ul className="flex flex-wrap gap-2">
                        {generations.map((generation, index) => (
                            <Generation key={index} {...{ generation, index }} />
                        ))}
                    </ul>
                </div>
            )}
        </article>
    );
}

function Generation({ index, generation }: { index: number; generation: AudioPlayerAdapterResourceStateType }) {
    const downloadFileNameWithoutExtension = crypto.randomUUID().toString();

    return (
        <MiniAudioPlayer key={index} audioPlayerResourceState={generation} {...{ downloadFileNameWithoutExtension }} />
    );
}
