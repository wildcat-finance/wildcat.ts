const { createHash } = require("crypto");
const { writeFileSync, readFileSync } = require("fs");
const path = require("path");
const { Project, SyntaxKind } = require("ts-morph");
const { getProgressBar } = require("./logs");
const filePath = path.join(__dirname, "../src/gql/graphql.ts");

// Replace any instance of:
// `{ __typename?: "SomeStringLiteral" }`
// with
// `{ __typename: "SomeStringLiteral" }`
writeFileSync(filePath, readFileSync(filePath, "utf-8").replace(/__typename\?:/g, "__typename:"));

const relativePath = path.relative(path.join(__dirname, ".."), filePath);

console.log(`Replacing duplicate type definitions in ${relativePath}...`);

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

let replacements = 0;
const typeLiterals = sourceFile
  .getDescendantsOfKind(SyntaxKind.TypeLiteral)
  // .filter(node => !node.wasForgotten())
  .map((node) => {
    const parent = node.getParent();
    const text = cleanUpTypeText(node.getText());
    const typeName = typeMap.get(text);
    return {
      node,
      parent,
      typeName
    };
  })
  .filter(
    ({ parent, typeName }) =>
      typeName &&
      !(parent?.getKind() === SyntaxKind.TypeAliasDeclaration && parent.getName() === typeName)
  );

const typeLiteralsProgressBar = getProgressBar(
  "Replacing duplicate type literals",
  typeLiterals.length
);
/**
 *
 * @typedef  { Object } ReplaceNodeParam
 * @property {import('ts-morph').TypeLiteralNode} node
 * @property {import('ts-morph').Node<ts.Node>} parent
 * @property {string} typeName
 * @property {string} text
 *
 * @param {ReplaceNodeParam}
 */
function tryReplaceNode({ node, typeName }) {
  if (!node.wasForgotten()) {
    node.replaceWithText(typeName);
    typeReplacementCounts.set(typeName, (typeReplacementCounts.get(typeName) || 0) + 1);
    replacements++;
  }
  typeLiteralsProgressBar();
}

typeLiterals.forEach(tryReplaceNode);

console.log(`Replaced ${replacements} inline types with named types.`);
for (const [typeName, count] of typeReplacementCounts.entries()) {
  log(`Replacements for ${typeName}: ${count}`);
}

// Save the modified file

const functions = sourceFile.getDescendantsOfKind(SyntaxKind.FunctionDeclaration);

const functionsToRepair = functions.filter((func) => {
  const name = func.getName();
  return name.startsWith("use") && !func.getReturnTypeNode();
});
const repairReturnTypesProgressBar = getProgressBar(
  `Repairing return types for hooks...`,
  functionsToRepair.length
);
for (const func of functionsToRepair) {
  const name = func.getName();
  const baseTypeName = name.replace("use", "");
  const [queryKind, queryName] = [.../(?<=(.+))((?:Suspense|Lazy)?Query)$/.exec(baseTypeName)];
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
  repairReturnTypesProgressBar();
}
console.log(`Repaired return types for ${functionsToRepair.length} hooks.`);
console.log(`Saving ${relativePath}...`);
sourceFile.saveSync();

const generateFileChecksum = (filePath) =>
  createHash("md5").update(readFileSync(filePath), "utf8").digest("hex");

const currentChecksums = [
  generateFileChecksum(path.join(__dirname, "../gql/fragments.graphql")),
  generateFileChecksum(path.join(__dirname, "../gql/queries.graphql")),
  generateFileChecksum(filePath)
].join("\n");

writeFileSync(path.join(__dirname, ".gql-cache"), currentChecksums);
