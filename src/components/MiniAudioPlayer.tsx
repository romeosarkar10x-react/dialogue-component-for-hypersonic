"use client";

import type { AsyncStateType } from "@/types/AsyncState";
import { getGlobalAudioContext } from "@/lib/globalAudioContext";
import { PeaksAudioPlayerAdapter } from "@/utils/audio/PeaksAudioPlayerAdapter";
import { Download, ExternalLink, Pause, Play } from "lucide-react";
import Peaks from "peaks.js";
import type { PeaksInstance, PeaksOptions } from "peaks.js";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { pcmFloat32ToWAV } from "@/utils/audio/pcmFloat32ToWAV";

export type AudioPlayerAdapterResourceStateType = AsyncStateType<PeaksAudioPlayerAdapter>;

export default function MiniAudioPlayer({
    audioPlayerResourceState,
    downloadFileNameWithoutExtension = crypto.randomUUID(),
}: {
    downloadFileNameWithoutExtension?: string;
    audioPlayerResourceState: AudioPlayerAdapterResourceStateType;
}) {
    const [playing, setPlaying] = useState(() => {
        if (audioPlayerResourceState.status === "success") {
            return audioPlayerResourceState.data.isPlaying();
        }

        return false;
    });

    const togglePlayPause = useCallback(() => {
        (async function () {
            if (audioPlayerResourceState.status === "success") {
                await audioPlayerResourceState.data.togglePlayPause();
                setPlaying(audioPlayerResourceState.data.isPlaying());
            }
        })();
    }, [setPlaying, audioPlayerResourceState]);

    const download = useCallback(() => {
        if (audioPlayerResourceState.status !== "success") {
            return;
        }

        const audioBuffer = audioPlayerResourceState.data.getAudioBuffer();
        const wav = pcmFloat32ToWAV(audioBuffer);
        const blob = new Blob([wav], { type: "audio/wav" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = `${downloadFileNameWithoutExtension}.wav`;
        a.click();
    }, [audioPlayerResourceState, downloadFileNameWithoutExtension]);

    if (audioPlayerResourceState.status === "pending") {
        return "Loading...";
    }

    if (audioPlayerResourceState.status === "error") {
        return "Error...";
    }

    return (
        <div className="flex items-center gap-4 border-border border rounded-lg px-4">
            <Button variant="wrapper" size="wrapper" onClick={togglePlayPause}>
                {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            </Button>
            <AudioWaveform audioPlayerAdapter={audioPlayerResourceState.data} />
            <Button variant="wrapper" size="wrapper" onClick={download}>
                <Download className="size-4" />
            </Button>
            <ExternalLink className="size-4" />
        </div>
    );
}

function AudioWaveform({ audioPlayerAdapter }: { audioPlayerAdapter: PeaksAudioPlayerAdapter }) {
    const [, setPeaksInstance] = useState<PeaksInstance | null>(null);
    const overviewContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        (async function () {
            if (!overviewContainerRef.current) {
                return;
            }

            const style = getComputedStyle(document.documentElement);
            const accentColor = style.getPropertyValue("--accent").trim();
            const primaryColor = style.getPropertyValue("--primary").trim();

            const options: PeaksOptions = {
                axisTopMarkerHeight: 0,
                axisBottomMarkerHeight: 0,

                overview: {
                    waveformColor: accentColor || "oklch(0.9869 0.0214 95.2774)",
                    playedWaveformColor: primaryColor || "oklch(0.7686 0.1647 70.0804)",
                    playheadWidth: 0,
                    container: overviewContainerRef.current,
                    showAxisLabels: false,
                },
                webAudio: {
                    audioContext: getGlobalAudioContext(),
                    audioBuffer: audioPlayerAdapter.getAudioBuffer(),
                },
                player: audioPlayerAdapter,
            };

            Peaks.init(options, (error, instance) => {
                if (!instance) {
                    console.error("Peaks init error:", error);
                    return;
                }

                setPeaksInstance(instance);
            });
        })();
    }, [setPeaksInstance, audioPlayerAdapter]);

    return <div ref={overviewContainerRef} className="peaks_overview_container h-16 w-72"></div>;
}
