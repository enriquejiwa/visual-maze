import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import RedoIcon from "@material-ui/icons/Redo";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import UndoIcon from "@material-ui/icons/Undo";
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';

interface PlayerProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onStepBack: () => void;
    onStepForward: () => void;
    onSkip: () => void;
    onClear: () => void;
}

function Player({
    isPlaying,
    onPlayPause,
    onStepBack,
    onStepForward,
    onSkip,
    onClear,
}: PlayerProps) {
    return (
        <div className="w-1/3 bg-slate-50 text-slate-500 dark:bg-slate-600 dark:text-slate-200 rounded-b-xl flex items-center">
            <div className="flex-auto flex items-center justify-evenly">
                <button type="button" aria-label="Add to favorites">
                    <svg width="24" height="24">
                        <path
                            d="M7 6.931C7 5.865 7.853 5 8.905 5h6.19C16.147 5 17 5.865 17 6.931V19l-5-4-5 4V6.931Z"
                            fill="currentColor"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <button
                    type="button"
                    className="hidden sm:block lg:hidden xl:block"
                    aria-label="Clear"
                    onClick={onClear}
                >
                    <SkipPreviousIcon fontSize="large" />
                </button>
                <button
                    type="button"
                    aria-label="Step back"
                    onClick={onStepBack}
                >
                    <UndoIcon fontSize="large" />
                </button>
            </div>
            <button
                type="button"
                className="bg-white text-slate-900 dark:bg-slate-100 dark:text-slate-700 flex-none -my-2 mx-auto w-20 h-20 rounded-full ring-1 ring-slate-900/5 shadow-md flex items-center justify-center"
                aria-label="Play/Pause"
                onClick={onPlayPause}
            >
                {isPlaying ? (
                    <PauseIcon fontSize="large" />
                ) : (
                    <PlayArrowIcon fontSize="large" />
                )}
            </button>
            <div className="flex-auto flex items-center justify-evenly">
                <button
                    type="button"
                    aria-label="Step forward"
                    onClick={onStepForward}
                >
                    <RedoIcon fontSize="large" />
                </button>
                <button
                    type="button"
                    className="hidden sm:block lg:hidden xl:block"
                    aria-label="Skip"
                    onClick={onSkip}
                >
                    <SkipNextIcon fontSize="large" />
                </button>
                <button
                    type="button"
                    className="rounded-lg text-xs leading-6 font-semibold px-2 ring-2 ring-inset ring-slate-500 text-slate-500 dark:text-slate-100 dark:ring-0 dark:bg-slate-500"
                >
                    1x
                </button>
            </div>
        </div>
    );
}

export default Player;
