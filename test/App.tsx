import { Analytics } from "@vercel/analytics/react";
import Playground from "../src/component/playground/index.tsx";

function App() {
  return (
    <>
      <Playground />
      <Analytics></Analytics>
    </>
  );
}

export default App;
