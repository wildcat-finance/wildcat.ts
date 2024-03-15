const { writeFileSync, readFileSync } = require("fs");
const path = require("path");
const { Project, SyntaxKind, TypeLiteralNode, Writers } = require("ts-morph");

const filePath = path.join(__dirname, "../src/gql/graphql.ts");

// Replace any instance of:
// `{ __typename?: "SomeStringLiteral" }`
// with
// `{ __typename: "SomeStringLiteral" }`
writeFileSync(filePath, readFileSync(filePath, "utf-8").replace(/__typename\?:/g, "__typename:"));

console.log(
  `Replacing duplicate type definitions in ${path.relative(path.join(__dirname, ".."), filePath)}`
);

const DEBUG = process.argv.includes("--debug");

const log = (msg) => DEBUG && console.log(msg);

// Initialize project and source file
const project = new Project();
const sourceFile = project.addSourceFileAtPath(filePath);

// Map to store unique type definitions
const typeMap = new Map();
const typeReplacementCounts = new Map();

// Find all type aliases
const typeAliases = sourceFile.getDescendantsOfKind(SyntaxKind.TypeAliasDeclaration);

// Fix use* hooks
let i = 0;

const cleanUpTypeText = (text) => text.replace(/\s/g, "");

// Gather unique type definitions
typeAliases.forEach((alias) => {
  const typeNode = alias.getTypeNode();

  if (typeNode) {
    const text = cleanUpTypeText(typeNode.getText());

    if (!typeMap.has(text)) {
      typeMap.set(text, alias.getName());
    }
  }
});
function tryReplaceNode(node) {
  if (node.wasForgotten()) return false;

  const parent = node.getParent();
  const text = cleanUpTypeText(node.getText());
  const typeName = typeMap.get(text);

  if (typeName) {
    if (parent?.getKind() === SyntaxKind.TypeAliasDeclaration) {
      const parentName = parent.getName();
      if (parentName === typeName) {
        // console.log(
        //   `Skipping ${typeName} because it is the original declaration.`
        // );
        return false;
      }
    }
    // console.log(`Found replacement in type: ${node.getKindName()}`)
    node.replaceWithText(typeName);
    typeReplacementCounts.set(typeName, (typeReplacementCounts.get(typeName) || 0) + 1);
    replacements++;
    return true;
  }
  return false;
}

let replacements = 0;
sourceFile.getDescendantsOfKind(SyntaxKind.TypeLiteral).forEach(tryReplaceNode);

console.log(`Replaced ${replacements} inline types with named types.`);
for (const [typeName, count] of typeReplacementCounts.entries()) {
  log(`Replacements for ${typeName}: ${count}`);
}

console.log(`Repairing return types for hooks...`);
// Save the modified file

const functions = sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration);
for (const func of functions) {
  const name = func.getName();
  if (name.startsWith("use") && !func.getReturnTypeNode()) {
    // console.log();
    const baseTypeName = name.replace("use", "");
    const [queryKind, queryName] = [.../(?<=(.+))((?:Suspense|Lazy)?Query)$/.exec(baseTypeName)];
    // console.log(iss)
    const returnTypeName = baseTypeName + "HookResult";
    const returnTypeDef = typeAliases.find((alias) => {
      const aliasName = alias.getName();
      return aliasName === returnTypeName;
    });
    const queryType = `Subgraph${queryName}Query`;
    const variablesType = `Subgraph${queryName}QueryVariables`;
    const returnType = `Apollo.${queryKind.includes("Suspense") ? "Use" : ""}${queryKind}Result${
      queryKind.includes("Lazy") ? "Tuple" : ""
    }<${queryType}, ${variablesType}>`;
    func.setReturnType(returnTypeName);
    returnTypeDef.setType(returnType);
    console.log(`Replaced ${name} return type with ${returnTypeName}`);
  }
  // break;
}
sourceFile.saveSync();
