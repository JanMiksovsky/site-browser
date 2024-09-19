import {
  SiteTree,
  Tree,
} from "./node_modules/@weborigami/async-tree/browser.js";

const location = document.location;
const url = location.search?.slice(1);

const keyPane = document.getElementById("keyPane");
const frame = document.getElementById("frame");

if (url) {
  const tree = new SiteTree(url);
  const keys = await tree.keys();
  const promises = keys.map(async (key) => {
    const isSubtree = await Tree.isKeyForSubtree(tree, key);
    const href = isSubtree ? `index.html?${url}/${key}` : `${url}/${key}`;
    const classAttr = isSubtree ? `class="subtree"` : "";
    return `<a href="${href}" ${classAttr}>${key}</a>`;
  });
  const links = await Promise.all(promises);
  const html = links.join("\n");
  keyPane.innerHTML = html;
}

keyPane.addEventListener("click", (event) => {
  const target = event.target;
  if (target.localName !== "a") {
    return;
  }
  frame.src = target.href;
  event.preventDefault();
});
