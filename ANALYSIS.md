# 实现 react 代码运行在浏览器

实现步骤：
1、编译 jsx、tsx 代码
@babel/standalone 是一个能够单独运行在浏览器里的 babel 包，提供了和 babel 一样编译的能力。
通过 transform 将代码编译成 js

2、处理第三方包 import 引入
浏览器是无法处理第三方包的，而 vite 对于第三方包的处理是在 node 环境，会将第三方的裸包转为 node_modules 里的绝对地址。
而我们现在是需要在浏览器中去处理掉第三方包，因此可以通过 import map

3、将代码运行
由于我们运行的代码期望是一个独立环境，不影响外部，那么就需要通过 iframe 来实现

一、代码书写平台
简单来的话，可以通过 textarea 去写。

用编辑器的话，就是采用 monaco 去书写，而 monaco 是不支持高亮的。这样的话就无法和我们平常一样去代码高亮。
实现高亮这里有两种方式：
1、在 vue-repl 里采用 shiki（样式）来实现。具体使用参考；https://shiki.tmrs.site/packages/monaco
2、采用@monaco-editor/react
