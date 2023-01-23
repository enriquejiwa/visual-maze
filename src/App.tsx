import { useRef, useState } from "react";
import GridNode from "./components/gridNode";
import useWindowDimensions from "./hooks/useWindowDimensions";
import { GridNodeData, MouseDownState } from "./types/grid.type";

function App() {
    const { height, width } = useWindowDimensions();
    const [grid, setGrid] = useState<GridNodeData[][]>(
        createGrid(Math.floor(height / 24) - 4, Math.floor(width / 24) - 4)
    );
    const [mouseDown, setMouseDown] = useState<MouseDownState>({});
    const isMouseDownState = useRef<MouseDownState>();
    isMouseDownState.current = mouseDown;

    const setGridWall = (row: number, col: number) => {
        setGrid((prevGrid) =>
            updateSingleGridNode(prevGrid, row, col, { isWall: true })
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
    const handleMouseUp = () => {
        setMouseDown({});
    };
    const handleMouseEnter = (row: number, col: number) => {
        if (isMouseDownState.current?.isStart) {
            setGrid((prevGrid) => updateSingleGridNode(prevGrid, row, col, { isStart: true }));
            return;
        } else if (isMouseDownState.current?.isFinish) {
            setGrid((prevGrid) => updateSingleGridNode(prevGrid, row, col, { isFinish: true }));
            return;
        }
        if (!isMouseDownState.current?.isMouseDown) return;
        if (grid[row][col].isStart || grid[row][col].isFinish) return;
        setGridWall(row, col);
    };
    const handleMouseLeave = (row: number, col: number) => {
        if (isMouseDownState.current?.isStart) {
            setGrid((prevGrid) => updateSingleGridNode(prevGrid, row, col, { isStart: true }));
            return;
        }
        if (isMouseDownState.current?.isFinish) {
            setGrid((prevGrid) => updateSingleGridNode(prevGrid, row, col, { isFinish: true }));
            return;
        }
    };

    return (
        <div className="w-full h-screen flex items-center justify-center">
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
                                            handleMouseDown(rowIndex, nodeIndex)
                                        }
                                        onMouseUp={() => handleMouseUp()}
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
    if (rows > 20 && columns > 20) {
        grid[10][10].isStart = true;
        grid[rows - 11][columns - 11].isFinish = true;
    } else {
        grid[0][0].isStart = true;
        grid[rows - 1][columns - 1].isFinish = true;
    }
    return grid;
};

const createNode = (): GridNodeData => {
    return {
        isWall: false,
        isStart: false,
        isFinish: false,
        isVisited: false,
        isShortestPath: false,
    };
};

const updateSingleGridNode = (
    grid: GridNodeData[][],
    row: number,
    col: number,
    { isWall, isStart, isFinish }: GridNodeData
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
                return newNode;
            }
            return node;
        });
    });
};

export default App;
