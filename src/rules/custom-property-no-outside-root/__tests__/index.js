/* eslint-disable comma-dangle,array-bracket-spacing */
import testRule from "../../../testUtils/blueTapeStylelintAssert"
import rule, { ruleName, messages } from ".."

testRule(rule, {
  ruleName: ruleName,
  config: [undefined],

  accept: [{
    code: ":root { --foo-bar: 1px; }",
  }, {
    code: "a { color: pink; }",
  }, {
    code: "a { -webkit-transform: 1px; }",
  }],

  reject: [{
    code: "a { --foo-bar: 1px; }",
    message: messages.rejected,
  }, {
    code: "a { color: pink; -webkit-transform: 1px; --foo-bar: 1px; }",
    message: messages.rejected,
  }, {
    code: ":root, a { --foo-bar: 1px; }",
    message: messages.rejected,
  }, {
    code: ":root a { --foo-bar: 1px; }",
    message: messages.rejected,
  }],
})