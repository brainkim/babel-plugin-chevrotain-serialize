"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _chevrotain = _interopRequireDefault(require("chevrotain"));

var _test = _interopRequireDefault(require("../../test_modules/test"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Comma = _chevrotain.default.createToken({
  name: "Comma",
  pattern: /,/
});

class MyParser extends _chevrotain.default.Parser {
  constructor() {
    super({
      Comma
    }, {
      serializedGrammar: JSON.parse("[{\"type\":\"Rule\",\"name\":\"commas\",\"orgText\":\"() => {\\n      this.MANY(() => {\\n        this.CONSUME(Comma);\\n      });\\n    }\",\"definition\":[{\"type\":\"Repetition\",\"idx\":0,\"definition\":[{\"type\":\"Terminal\",\"name\":\"Comma\",\"label\":\"Comma\",\"idx\":0,\"pattern\":\",\"}]}]}]")
    });
    this.RULE("commas", () => {
      this.MANY(() => {
        this.CONSUME(Comma);
      });
    });
    this.performSelfAnalysis();
  }

}

const x = _test.default.x();

var _default = MyParser;
exports.default = _default;