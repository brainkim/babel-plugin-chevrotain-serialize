import * as chevrotain from "chevrotain";

const Comma = chevrotain.createToken({
  name: "Comma",
  pattern: /,/,
});

class MyParser {
  constructor() {
    super({ Comma });
    this.RULE("commas", () => {
      this.MANY(() => {
        this.CONSUME(Comma);
      });
    });
    this.performSelfAnalysis();
  }
}
