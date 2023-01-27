import {
    ArrowPathIcon,
    ArrowUturnLeftIcon,
    ArrowUturnRightIcon,
    ChevronDoubleRightIcon,
    PauseIcon,
    PlayIcon,
} from "@heroicons/react/20/solid";
import { AlgorithmOption } from "../types/control.type";
import AlgorithmSelector from "./algorithmSelector";

interface PlayerProps {
    isPlaying: boolean;
    isReady: boolean;
    algorithm: AlgorithmOption;
    speed: number;
    onPlayPause: () => void;
    onStepBack: () => void;
    onStepForward: () => void;
    onSkip: () => void;
    onClear: () => void;
    onAlgorithmChange: (selected: AlgorithmOption) => void;
    onSpeedChange: () => void;
}

function Player({
    isPlaying,
    isReady,
    algorithm,
    speed,
    onPlayPause,
    onStepBack,
    onStepForward,
    onSkip,
    onClear,
    onAlgorithmChange,
    onSpeedChange,
}: PlayerProps) {
    return (
        <div className="w-fit px-8 bg-slate-50 text-slate-500 dark:bg-slate-600 dark:text-slate-200 rounded-b-xl flex items-center space-x-8">
            <AlgorithmSelector
                selected={algorithm}
                setSelected={onAlgorithmChange}
            />
            {isReady && (
                <button
                    type="button"
                    className="hidden sm:block lg:hidden xl:block hover:text-cyan-500"
                    aria-label="Step back"
                    onClick={onStepBack}
                >
                    <ArrowUturnLeftIcon className="h-6 w-6" />
                </button>
            )}
            <button
                type="button"
                className="bg-white dark:bg-slate-100 dark:text-slate-700 hover:text-cyan-500 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
                aria-label="Play/Pause"
                onClick={onPlayPause}
            >
                {isPlaying ? (
                    <PauseIcon className="h-8 w-8" />
                ) : (
                    <PlayIcon className="h-8 w-8" />
                )}
            </button>
            {isReady && (
                <>
                    <button
                        type="button"
                        className="hidden sm:block lg:hidden xl:block hover:text-cyan-500"
                        aria-label="Step forward"
                        onClick={onStepForward}
                    >
                        <ArrowUturnRightIcon className="h-6 w-6" />
                    </button>
                    <button
                        type="button"
                        className="hidden sm:block lg:hidden xl:block hover:text-cyan-500"
                        aria-label="Skip"
                        onClick={onSkip}
                    >
                        <ChevronDoubleRightIcon className="h-6 w-6" />
                    </button>
                    <button
                        type="button"
                        className="hidden sm:block lg:hidden xl:block hover:text-cyan-500"
                        aria-label="Clear"
                        onClick={onClear}
                    >
                        <ArrowPathIcon className="h-6 w-6" />
                    </button>
                </>
            )}
            <button
                type="button"
                className={`rounded-lg text-xs leading-6 font-semibold px-2 ring-2 ring-inset ring-slate-500 text-slate-500 dark:text-slate-100 dark:ring-0 dark:bg-slate-500 ${
                    !isPlaying && "hover:text-cyan-500 hover:ring-cyan-500"
                }`}
                aria-label="Speed"
                onClick={onSpeedChange}
                disabled={isPlaying}
            >
                {speed}x
            </button>
        </div>
    );
}

export default Player;
