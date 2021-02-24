# 编译器

## 大多数编译器有三个步骤

- Parsing：将原始代码转换为抽象语法树
- Transformation：对抽象语法树进行转化
- Code Generation：将转化后的抽象语法树变成新的代码

### Parsing

- 词法分析：将原始代码拆分成一个个的 token
- 语法分析：将 token 重新组织为描述性结构对象

### Transformation

- 我们需要根据新语言特性来将旧的 AST 来改造为新的 AST，

### Code Generation

- 将新的 AST 转换为新语言代码
