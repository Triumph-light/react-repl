# React Repl

React component for editing React components, it is similar to vue repl。

You can experience React Playground online on react-repl-vercel.app(https://react-repl.vercel.app/)

# Props

```ts
export interface ReplProps {
  /**
   * 全局数据
   */
  store?: ReplStore;
  /**
   * 是否自动保存
   * @default true
   */
  autoSave?: boolean;
  /**
   * 主题色
   * @default "light"
   */
  theme?: Theme;
  /**
   * 布局
   * @default 'horizontal'
   */
  layout?: "horizontal" | "vertical";
}
```
