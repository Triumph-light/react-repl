import Playground from "../src/component/playground/index.tsx";
import { Analytics } from "@vercel/analytics/react"

function App() {
  return <>
    <Playground />
    <Analytics></Analytics>
  </>;
}

export default App;
