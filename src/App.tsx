import { useRef, useState } from "react";
import GridNode from "./components/gridNode";
import Player from "./components/player";
import useWindowDimensions from "./hooks/useWindowDimensions";
import { dfs } from "./pathfinding/dfs";
import { Control } from "./types/control.type";
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
    const [control, setControl] = useState<Control>({});
    const [mouseDown, setMouseDown] = useState<MouseDownState>({});
    const isMouseDownState = useRef<MouseDownState>();
    isMouseDownState.current = mouseDown;

    const setGridWall = (row: number, col: number) => {
        setGrid((prevGrid) =>
            invertSingleGridNode(prevGrid, row, col, { isWall: true })
        );
    };

    const handleMouseDown = (row: number, col: number) => {
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
        const { visited, path } = dfs(
            grid.map((row) => row.map((node) => ({ ...node }))),
            start
        );
        visualizeAlgorithm(visited, path);
    };

    const visualizeAlgorithm = (
        visited: Coordinates[],
        path?: Coordinates[]
    ) => {
        for (let i = 0; i < visited.length; i++) {
            setTimeout(() => {
                const { row, col } = visited[i];
                setGrid((prevGrid) =>
                    invertSingleGridNode(prevGrid, row, col, {
                        isVisited: true,
                    })
                );
            }, 100 * i);
        }
        if (!path) return;
        const delay = 100 * visited.length;
        for (let i = 0; i < path.length; i++) {
            setTimeout(() => {
                const { row, col } = path[i];
                setGrid((prevGrid) =>
                    invertSingleGridNode(prevGrid, row, col, {
                        isPath: true,
                    })
                );
            }, delay + 100 * i);
        }
    };

    const handlePlayPause = () => {
        if (!control.isPlaying) {
            handleDFS();
        }
        setControl((prevControl) => ({
            ...prevControl,
            isPlaying: !prevControl.isPlaying,
        }));
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
            <Player isPlaying={!!control.isPlaying} onPlayPause={handlePlayPause} />
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
