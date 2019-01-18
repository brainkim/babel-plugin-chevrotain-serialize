import chevrotain from "chevrotain";
import test from "../../test_modules/test";

const Comma = chevrotain.createToken({
  name: "Comma",
  pattern: /,/,
});

class MyParser extends chevrotain.Parser {
  constructor() {
    super({
      Comma,
    });
    this.RULE("commas", () => {
      this.MANY(() => {
        this.CONSUME(Comma);
      });
    });
    this.performSelfAnalysis();
  }
}

const x = test.x();
export default MyParser;
