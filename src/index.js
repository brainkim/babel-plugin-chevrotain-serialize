import requireFromString from "require-from-string";

const PARSERS_EXPORT_NAME = "_______PARSERS_______";

export default function plugin(babel) {
  const { types: t, transformFromAstSync, traverse } = babel;
  const identifyParserImportsVisitor = {
    ImportDeclaration(path) {
      if (
        path.scope.parent == null &&
        path.node.source.value === "chevrotain"
      ) {
        const parserClassNames = path.node.specifiers
          .filter((specifier) => {
            return (
              (t.isImportSpecifier(specifier) &&
                specifier.imported.name === "Parser") ||
              specifier.type === "ImportDefaultSpecifier"
            );
          })
          .map((specifier) => {
            switch (specifier.type) {
              case "ImportSpecifier":
                return specifier.local.name;
              case "ImportDefaultSpecifier":
                return specifier.local.name + ".Parser";
            }
          });
        this.addParserClassNames(parserClassNames);
      }
    },
    CallExpression(path) {
      if (
        path.scope.parent == null &&
        path.node.callee.name === "require" &&
        path.node.arguments[0] &&
        path.node.arguments[0].value === "chevrotain"
      ) {
        const parent = path.parent;
        if (t.isIdentifier(parent.id)) {
          this.addParserClassNames([parent.id.name + ".Parser"]);
        } else if (t.isObjectPattern(parent.id)) {
          const parserClassNames = parent.id.properties
            .filter((property) => property.key.name === "Parser")
            .map((property) => property.value.name);
          this.addParserClassNames(parserClassNames);
        }
      }
    },
  };

  function inheritsFromClassNames(node, classNames) {
    const superClass = node.superClass;
    if (t.isIdentifier(superClass)) {
      return classNames.includes(superClass.name);
    } else if (t.isMemberExpression(superClass)) {
      const name = superClass.object.name + "." + superClass.property.name;
      return classNames.includes(name);
    }
    return false;
  }

  const exportParsersVisitor = {
    Program(path) {
      path.node.body.unshift(
        t.expressionStatement(
          t.assignmentExpression(
            "=",
            t.memberExpression(
              t.identifier("exports"),
              t.identifier(PARSERS_EXPORT_NAME),
            ),
            t.objectExpression([]),
          ),
        ),
      );
    },
    Class(path) {
      if (!inheritsFromClassNames(path.node, this.parserClassNames)) {
        return;
      }
      const className = path.node.id.name;
      path.insertAfter(
        t.assignmentExpression(
          "=",
          t.memberExpression(
            t.memberExpression(
              t.identifier("exports"),
              t.identifier(PARSERS_EXPORT_NAME),
            ),
            t.identifier(className),
          ),
          t.identifier(className),
        ),
      );
    },
  };

  const insertSerializedGAstVisitor = {
    Class(path) {
      if (!inheritsFromClassNames(path.node, this.parserClassNames)) {
        return;
      }
      const className = path.node.id.name;
      const constructorMethod = path.node.body.body.find(
        (node) => t.isClassMethod(node) && node.key.name === "constructor",
      );
      if (!constructorMethod) {
        return;
      }
      const replacedBody = constructorMethod.body.body;
        
      const grammar = this.serializedGrammars[className];
      replacedBody.forEach((node) => {
        if (
          t.isExpressionStatement(node) &&
          t.isCallExpression(node.expression) &&
          t.isMemberExpression(node.expression.callee) &&
          t.isThisExpression(node.expression.callee.object) && 
          t.isIdentifier(node.expression.callee.property) && 
          node.expression.callee.property.name === "RULE"
        ) {
          node.expression.arguments = node.expression.arguments.slice(0, 1);
        } else if (
          t.isExpressionStatement(node) &&
          t.isCallExpression(node.expression) &&
          t.isMemberExpression(node.expression.callee) &&
          node.expression.callee.property.name === "performSelfAnalysis"
        ) {
          node.expression.arguments.push(
            t.objectExpression([
              t.objectProperty(
                t.identifier("serializedGrammar"),
                t.callExpression(
                  t.memberExpression(t.identifier("JSON"), t.identifier("parse")),
                  [t.stringLiteral(JSON.stringify(grammar))],
                ),
              ),
            ]),
          );
        }
      });
      constructorMethod.body.body = replacedBody;
    },
  };

  return {
    visitor: {
      Program(path, state) {
        const parserClassNames = [];
        path.traverse(identifyParserImportsVisitor, {
          addParserClassNames(names) {
            parserClassNames.push(...names);
          },
        });
        if (!parserClassNames.length) {
          return;
        }
        const fileWithExportedParsers = t.cloneNode(path.parent);
        traverse(
          fileWithExportedParsers,
          exportParsersVisitor,
          path.scope,
          { parserClassNames },
          path,
        );
        let code = transformFromAstSync(
          fileWithExportedParsers,
          null,
          state.file.opts,
        ).code;
        const { [PARSERS_EXPORT_NAME]: parsers } = requireFromString(`
          require("@babel/register");
          ${code}
        `);
        const serializedGrammars = Object.keys(parsers).reduce(
          (serializedGrammars, key) => {
            const parser = new parsers[key]([]);
            return {
              ...serializedGrammars,
              [key]: parser.getSerializedGastProductions(),
            };
          },
          {},
        );
        path.traverse(insertSerializedGAstVisitor, {
          serializedGrammars,
          parserClassNames,
        });
      },
    },
  };
}

// import { transform } from "@babel/core";
// const code = `
// import { Parser, createToken } from "chevrotain";
// const Comma = createToken({
//   name: "Comma",
//   pattern: /,/,
// });
// class MyParser extends Parser {
//   constructor() {
//     super([], [Comma]);
//     this.RULE("hi", () => {
//       this.CONSUME(Comma);
//     });
//     this.performSelfAnalysis();
//   }
// }
// `;
// import path from "path";
// const transformedCode = transform(code, {
//   extends: path.resolve(__dirname, "../.babelrc"),
//   plugins: [plugin],
// }).code;
// console.log(transformedCode);
