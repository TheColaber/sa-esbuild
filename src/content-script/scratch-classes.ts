export default function loadClasses() {
  const excludedPrefixes = ["input_input-form", "label_input-group_"];

  const isStyleSheetValid = (styleSheet) => {
    const { ownerNode } = styleSheet;
    const textContent =
      ownerNode && ownerNode.textContent ? ownerNode.textContent : "";
    const todoComment =
      "/* DO NOT EDIT\n@todo This file is copied from GUI and should be pulled out into a shared library.";

    return !(
      textContent.startsWith(todoComment) &&
      excludedPrefixes.some((prefix) => textContent.includes(prefix))
    );
  };

  const extractSelectors = (styleSheet) =>
    [...styleSheet.cssRules]
      .filter((cssRule) => cssRule instanceof CSSStyleRule)
      .map((styleRule) => styleRule.selectorText)
      .flatMap(
        (selectorTest) =>
          selectorTest.match(/(([\w-]+?)_([\w-]+)_([\w\d-]+))/g) || [],
      );

  const uniqueClasses = new Set(
    Array.from(document.styleSheets)
      .filter(isStyleSheetValid)
      .flatMap(extractSelectors)
      .filter(Boolean),
  );

  return Array.from(uniqueClasses);
}
