import { createContext } from "react";
import { Theme } from "../../types";

const ThemeContext = createContext<Theme | undefined>(undefined);
export default ThemeContext 