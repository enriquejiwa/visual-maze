import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { AlgorithmOption } from "../types/control.type";

const algorithms: AlgorithmOption[] = [
    { value: "bfs", label: "Breadth-first search" },
    { value: "dfs", label: "Depth-first search" },
];

interface AlgorithmSelectorProps {
    selected: AlgorithmOption;
    setSelected: (selected: AlgorithmOption) => void;
}

export default function AlgorithmSelector({
    selected,
    setSelected,
}: AlgorithmSelectorProps) {
    return (
        <div className="w-48">
            <Listbox value={selected} onChange={setSelected}>
                <div className="relative">
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="absolute -top-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm -translate-y-full">
                            {algorithms.map((algorithm) => (
                                <Listbox.Option
                                    key={algorithm.value}
                                    className={({ active }) =>
                                        `relative cursor-default select-none py-2 px-4 ${
                                            active
                                                ? "bg-amber-100 text-amber-900"
                                                : "text-gray-900"
                                        }`
                                    }
                                    value={algorithm}
                                >
                                    {({ selected }) => (
                                        <span
                                            className={`block truncate ${
                                                selected
                                                    ? "font-medium"
                                                    : "font-normal"
                                            }`}
                                        >
                                            {algorithm.label}
                                        </span>
                                    )}
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                    <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                        <span className="block truncate text-slate-500">
                            {selected.label}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-slate-500"
                                aria-hidden="true"
                            />
                        </span>
                    </Listbox.Button>
                </div>
            </Listbox>
        </div>
    );
}
