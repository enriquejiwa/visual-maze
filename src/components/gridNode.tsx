import React, { memo } from "react";
import { GridNodeData } from "../types/grid.type";

interface GridNodeProps extends GridNodeData {
    onMouseDown: () => void;
    onMouseUp: () => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
}

function GridNode({
    isWall,
    isStart,
    isFinish,
    isVisited,
    isPath,
    onMouseDown,
    onMouseUp,
    onMouseEnter,
    onMouseLeave,
}: GridNodeProps) {
    return (
        <div
            className={getClassNames(
                isWall,
                isStart,
                isFinish,
                isVisited,
                isPath
            )}
            onMouseDown={(e: React.MouseEvent) => {
                e.button === 0 && onMouseDown();
            }}
            onMouseUp={(e: React.MouseEvent) => {
                e.button === 0 && onMouseUp();
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onDragStart={(e) => e.preventDefault()}
        ></div>
    );
}

function getClassNames(
    isWall?: boolean,
    isStart?: boolean,
    isFinish?: boolean,
    isVisited?: boolean,
    isPath?: boolean
) {
    const classNames = ["border w-6 h-6 border-slate-500 dark:border-slate-400"];
    if (isWall) {
        classNames.push(
            "bg-slate-800 dark:bg-slate-300",
        );
    } else if (isStart) {
        classNames.push("bg-green-500 cursor-move");
    } else if (isFinish) {
        classNames.push("bg-red-500 cursor-move");
    } else if (isPath) {
        classNames.push("bg-yellow-500");
    } else if (isVisited) {
        classNames.push("bg-blue-500 animate-fill-in");
    }
    return classNames.join(" ");
}

function areEqual(prevProps: GridNodeProps, nextProps: GridNodeProps) {
    return (
        prevProps.isWall === nextProps.isWall &&
        prevProps.isStart === nextProps.isStart &&
        prevProps.isFinish === nextProps.isFinish &&
        prevProps.isVisited === nextProps.isVisited &&
        prevProps.isPath === nextProps.isPath
    );
}

export default memo(GridNode, areEqual);
