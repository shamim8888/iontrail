/* Any copyright is dedicated to the Public Domain.
   http://creativecommons.org/publicdomain/zero/1.0/ */

function test() {

  let DOMUtils = Cc["@mozilla.org/inspector/dom-utils;1"].getService(Ci.inIDOMUtils);

  let pseudos = ["hover", "active", "focus"];

  let doc;
  let div;
  let menu;
  let inspector;

  waitForExplicitFinish();
  ignoreAllUncaughtExceptions();
  gBrowser.selectedTab = gBrowser.addTab();
  gBrowser.selectedBrowser.addEventListener("load", function() {
    gBrowser.selectedBrowser.removeEventListener("load", arguments.callee, true);
    doc = content.document;
    waitForFocus(createDocument, content);
  }, true);

  content.location = "data:text/html,pseudo-class lock node menu tests";

  function createDocument()
  {
    div = doc.createElement("div");
    div.textContent = "test div";

    doc.body.appendChild(div);

    openInspector(selectNode);
  }

  function selectNode(aInspector)
  {
    inspector = aInspector;
    inspector.selection.setNode(div);
    performTests();
  }

  function performTests()
  {
    menu = inspector.panelDoc.getElementById("inspector-node-popup");
    menu.addEventListener("popupshowing", testMenuItems, true);
    menu.openPopup();
  }

  function testMenuItems()
  {
    menu.removeEventListener("popupshowing", testMenuItems, true);

    for each (let pseudo in pseudos) {
      let menuitem = inspector.panelDoc.getElementById("node-menu-pseudo-" + pseudo);
      ok(menuitem, ":" + pseudo + " menuitem exists");

      menuitem.doCommand();

      is(DOMUtils.hasPseudoClassLock(div, ":" + pseudo), true,
        "pseudo-class lock has been applied");
    }
    finishUp();
  }

  function finishUp()
  {
    gBrowser.removeCurrentTab();
    finish();
  }
}
