import { Category } from "./category";

export interface Purchase {
    id: number;
    name: string;
    category: Category;
    isCrossOut: boolean;
}

