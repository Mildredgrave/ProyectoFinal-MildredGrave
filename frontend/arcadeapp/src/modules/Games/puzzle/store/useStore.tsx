import { create } from "zustand";

type Store= {
    name: string;
    score: number; 
    
}

type PlayerListStore = {
    List: Store[];
    saveList: (name: string, score: number) => void;
};

export const useStore = create<PlayerListStore>( (set) => ({
    List: [],
    saveList:  (name, score) => 
        set((state) => ({
        List: [
            ...state.List,
            {
                name, score
            }
        ],
    })),
}));