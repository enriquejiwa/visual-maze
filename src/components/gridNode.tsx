import { memo } from "react";
import { GridNodeData } from "../types/grid.type";

export interface GridNodeProps extends GridNodeData {
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
    isShortestPath,
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
                isShortestPath
            )}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
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
    isShortestPath?: boolean
) {
    const classNames = ["border", "w-6", "h-6"];
    if (isWall) {
        classNames.push("bg-slate-800", "border-slate-800");
    } else if (isStart) {
        classNames.push("bg-green-500", "cursor-move");
    } else if (isFinish) {
        classNames.push("bg-red-500", "cursor-move");
    } else if (isVisited) {
        classNames.push("bg-blue-500");
    } else if (isShortestPath) {
        classNames.push("bg-yellow-500");
    }
    classNames.push("border-slate-500");
    return classNames.join(" ");
}

function areEqual(prevProps: GridNodeProps, nextProps: GridNodeProps) {
    return (
        prevProps.isWall === nextProps.isWall &&
        prevProps.isStart === nextProps.isStart &&
        prevProps.isFinish === nextProps.isFinish &&
        prevProps.isVisited === nextProps.isVisited &&
        prevProps.isShortestPath === nextProps.isShortestPath
    );
}

export default memo(GridNode, areEqual);
