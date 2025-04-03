# 实现react代码运行在浏览器

实现步骤： 
1、编译jsx、tsx代码 
@babel/standalone 是一个能够单独运行在浏览器里的babel包，提供了和babel一样编译的能力。
通过transform将代码编译成js

2、处理第三方包import引入
浏览器是无法处理第三方包的，而vite对于第三方包的处理是在node环境，会将第三方的裸包转为node_modules里的绝对地址。
而我们现在是需要在浏览器中去处理掉第三方包，因此可以通过import map

3、将代码运行
由于我们运行的代码期望是一个独立环境，不影响外部，那么就需要通过iframe来实现