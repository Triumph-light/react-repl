import { createContext } from "react";
import type { Theme } from "../../types";

const ThemeContext = createContext<Theme | undefined>(undefined);
export default ThemeContext;
