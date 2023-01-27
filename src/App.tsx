import { useRef, useState } from "react";
import GridNode from "./components/gridNode";
import Player from "./components/player";
import useWindowDimensions from "./hooks/useWindowDimensions";
import { dfs } from "./pathfinding/dfs";
import { AlgorithmOption, Control, Resolution } from "./types/control.type";
import { Coordinates, GridNodeData, MouseDownState } from "./types/grid.type";

function App() {
    const { height, width } = useWindowDimensions();
    const [grid, setGrid] = useState<GridNodeData[][]>(
        createGrid(Math.floor(height / 24) - 4, Math.floor(width / 24) - 4)
    );
    const [start, setStart] = useState<Coordinates>(
        getStartCoordinates(
            Math.floor(height / 24) - 4,
            Math.floor(width / 24) - 4
        )
    );
    const [control, setControl] = useState<Control>({
        speed: 1,
        algorithm: { value: "dfs", label: "Depth-first search" },
    });
    const [resolution, setResolution] = useState<Resolution | undefined>();
    const [animation, setAnimation] = useState<NodeJS.Timeout[]>([]);
    const [mouseDown, setMouseDown] = useState<MouseDownState>({});
    const isMouseDownState = useRef<MouseDownState>();
    const controlState = useRef<Control>();
    isMouseDownState.current = mouseDown;
    controlState.current = control;

    const setGridWall = (row: number, col: number) => {
        setGrid((prevGrid) =>
            invertSingleGridNode(prevGrid, row, col, { isWall: true })
        );
    };

    const handleMouseDown = (row: number, col: number) => {
        if (controlState.current?.step) return;
        if (controlState.current?.step === 0) clearControl();

        if (grid[row][col].isStart) {
            setMouseDown({ isStart: true });
            return;
        } else if (grid[row][col].isFinish) {
            setMouseDown({ isFinish: true });
            return;
        }
        setMouseDown({ isMouseDown: true });
        setGridWall(row, col);
    };
    const handleMouseUp = (row: number, col: number) => {
        if (isMouseDownState.current?.isStart) {
            setStart({ row, col });
        }
        setMouseDown({});
    };
    const handleMouseEnter = (row: number, col: number) => {
        if (isMouseDownState.current?.isStart) {
            setGrid((prevGrid) =>
                invertSingleGridNode(prevGrid, row, col, { isStart: true })
            );
            return;
        } else if (isMouseDownState.current?.isFinish) {
            setGrid((prevGrid) =>
                invertSingleGridNode(prevGrid, row, col, { isFinish: true })
            );
            return;
        }
        if (!isMouseDownState.current?.isMouseDown) return;
        if (grid[row][col].isStart || grid[row][col].isFinish) return;
        setGridWall(row, col);
    };
    const handleMouseLeave = (row: number, col: number) => {
        if (isMouseDownState.current?.isStart) {
            setGrid((prevGrid) =>
                invertSingleGridNode(prevGrid, row, col, { isStart: true })
            );
            return;
        }
        if (isMouseDownState.current?.isFinish) {
            setGrid((prevGrid) =>
                invertSingleGridNode(prevGrid, row, col, { isFinish: true })
            );
            return;
        }
    };

    const handleDFS = () => {
        const { visited, path, solved } = dfs(
            grid.map((row) => row.map((node) => ({ ...node }))),
            start
        );
        setResolution({ visited, path, solved, initial: grid });
        visualizeAlgorithm(visited, path);
    };

    const visualizeAlgorithm = (
        visited: Coordinates[],
        path?: Coordinates[],
        from: number = 0
    ) => {
        const timeouts = new Array<NodeJS.Timeout>(
            visited.length + (path?.length || 0)
        );
        const pathFrom = from < visited.length ? 0 : from - visited.length;
        if (from < visited.length) {
            for (let i = from; i < visited.length; i++) {
                const timeout = setTimeout(() => {
                    const { row, col } = visited[i];
                    setGrid((prevGrid) =>
                        invertSingleGridNode(prevGrid, row, col, {
                            isVisited: true,
                        })
                    );
                    if (!path && i === visited.length - 1) {
                        setControl((prev) => ({
                            ...prev,
                            step: i,
                            isPlaying: false,
                        }));
                    } else {
                        setControl((prev) => ({ ...prev, step: i }));
                    }
                }, (100 * (i - from)) / (controlState.current?.speed || 1));
                timeouts[i] = timeout;
            }
        }
        if (path) {
            const delay = from < visited.length ? visited.length - from : 0;
            for (let i = pathFrom; i < path.length; i++) {
                const timeout = setTimeout(() => {
                    const { row, col } = path[i];
                    setGrid((prevGrid) =>
                        invertSingleGridNode(prevGrid, row, col, {
                            isPath: true,
                        })
                    );
                    if (i === path.length - 1) {
                        setControl((prev) => ({
                            ...prev,
                            step: visited.length + i,
                            isPlaying: false,
                        }));
                    } else {
                        setControl((prev) => ({
                            ...prev,
                            step: visited.length + i,
                        }));
                    }
                }, (100 * (delay + i)) / (controlState.current?.speed || 1));
                timeouts[visited.length + i] = timeout;
            }
        }
        setAnimation(timeouts);
    };

    const handlePlayPause = () => {
        if (control.isPlaying) {
            animation.forEach((timeout) => clearTimeout(timeout));
        } else {
            if (resolution) {
                const { visited, path } = resolution;
                visualizeAlgorithm(visited, path, (control.step || 0) + 1);
            } else {
                handleDFS();
            }
        }
        setControl((prevControl) => ({
            ...prevControl,
            isPlaying: !prevControl.isPlaying,
        }));
    };

    const handleStep = (step: 1 | -1) => {
        if (control.isPlaying) return;
        if (!resolution) return;
        const { visited, path } = resolution;
        const target_step = (control.step || 0) + (step === 1 ? 1 : 0);
        const next_step = (control.step || 0) + step;
        if (target_step < 0) return;
        if (target_step >= visited.length + (path?.length || 0)) return;
        if (target_step < visited.length) {
            setGrid((prevGrid) =>
                invertSingleGridNode(
                    prevGrid,
                    visited[target_step].row,
                    visited[target_step].col,
                    {
                        isVisited: true,
                    }
                )
            );
            if (!path && next_step === visited.length - 1) {
                setControl((prev) => ({
                    ...prev,
                    step: next_step,
                    isPlaying: false,
                }));
            } else {
                setControl((prev) => ({ ...prev, step: next_step }));
            }
        } else if (path) {
            setGrid((prevGrid) =>
                invertSingleGridNode(
                    prevGrid,
                    path[target_step - visited.length].row,
                    path[target_step - visited.length].col,
                    {
                        isPath: true,
                    }
                )
            );
            if (next_step === path.length - 1) {
                setControl((prev) => ({
                    ...prev,
                    step: next_step,
                    isPlaying: false,
                }));
            } else {
                setControl((prev) => ({
                    ...prev,
                    step: next_step,
                }));
            }
        }
    };

    const handleSkip = () => {
        if (!resolution) return;
        if (control.isPlaying) {
            animation.forEach((timeout) => clearTimeout(timeout));
        }
        const { visited, path, solved } = resolution;
        setGrid(solved);
        setControl((prev) => ({
            ...prev,
            step: visited.length + (path?.length || 0) - 1,
            isPlaying: false,
        }));
    };

    const handleClear = () => {
        if (!resolution) return;
        if (control.isPlaying) {
            animation.forEach((timeout) => clearTimeout(timeout));
        }
        setGrid(resolution.initial);
        setControl((prev) => ({
            ...prev,
            step: 0,
            isPlaying: false,
        }));
    };

    const handleSpeedChange = () => {
        if (control.isPlaying) return;
        let speed: 1 | 2 | 4;
        switch (control.speed) {
            case 1:
                speed = 2;
                break;
            case 2:
                speed = 4;
                break;
            case 4:
            default:
                speed = 1;
                break;
        }
        setControl((prev) => ({ ...prev, speed }));
    };

    const handleAlgorithmChange = (algorithm: AlgorithmOption) => {
        if (control.isPlaying) return;
        setControl((prev) => ({ ...prev, algorithm }));
    };

    const clearControl = () => {
        setControl((prev) => ({
            speed: prev.speed,
            algorithm: prev.algorithm,
        }));
        setResolution(undefined);
        setAnimation([]);
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div className="w-full h-fit flex items-center justify-center">
                <div>
                    {grid.map((row, rowIndex) => {
                        return (
                            <div key={rowIndex} className="flex">
                                {row.map((node, nodeIndex) => {
                                    return (
                                        <GridNode
                                            key={nodeIndex}
                                            {...node}
                                            onMouseDown={() =>
                                                handleMouseDown(
                                                    rowIndex,
                                                    nodeIndex
                                                )
                                            }
                                            onMouseUp={() =>
                                                handleMouseUp(
                                                    rowIndex,
                                                    nodeIndex
                                                )
                                            }
                                            onMouseEnter={() =>
                                                handleMouseEnter(
                                                    rowIndex,
                                                    nodeIndex
                                                )
                                            }
                                            onMouseLeave={() =>
                                                handleMouseLeave(
                                                    rowIndex,
                                                    nodeIndex
                                                )
                                            }
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
            <Player
                isPlaying={!!control.isPlaying}
                isReady={!!resolution}
                algorithm={control.algorithm}
                onPlayPause={handlePlayPause}
                onStepBack={() => handleStep(-1)}
                onStepForward={() => handleStep(1)}
                onSkip={handleSkip}
                onClear={handleClear}
                speed={control.speed}
                onAlgorithmChange={handleAlgorithmChange}
                onSpeedChange={handleSpeedChange}
            />
        </div>
    );
}

const createGrid = (rows: number, columns: number): GridNodeData[][] => {
    const grid = new Array(rows);
    for (let i = 0; i < rows; i++) {
        const currentRow: GridNodeData[] = new Array(columns);
        for (let j = 0; j < columns; j++) {
            currentRow[j] = createNode();
        }
        grid[i] = currentRow;
    }
    const { row, col } = getStartCoordinates(rows, columns);
    grid[row][col].isStart = true;
    grid[rows - row - 1][columns - col - 1].isFinish = true;
    return grid;
};

const getStartCoordinates = (rows: number, columns: number): Coordinates => {
    if (rows > 20 && columns > 20) {
        return { row: 10, col: 10 };
    }
    return { row: 0, col: 0 };
};

const createNode = (): GridNodeData => {
    return {};
};

const invertSingleGridNode = (
    grid: GridNodeData[][],
    row: number,
    col: number,
    { isWall, isStart, isFinish, isVisited, isPath }: GridNodeData
) => {
    return grid.map((rowOfNodes, rowIndex) => {
        return rowOfNodes.map((node, nodeIndex) => {
            if (rowIndex === row && nodeIndex === col) {
                const newNode = { ...node };
                if (isWall) {
                    newNode.isWall = !node.isWall;
                }
                if (isStart) {
                    newNode.isStart = !node.isStart;
                }
                if (isFinish) {
                    newNode.isFinish = !node.isFinish;
                }
                if (isVisited) {
                    newNode.isVisited = !node.isVisited;
                }
                if (isPath) {
                    newNode.isPath = !node.isPath;
                }
                return newNode;
            }
            return node;
        });
    });
};

export default App;
