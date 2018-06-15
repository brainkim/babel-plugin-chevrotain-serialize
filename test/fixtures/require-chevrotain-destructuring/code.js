const { Parser, createToken } = require("chevrotain");
const Comma = createToken({
  name: "Comma",
  pattern: /,/,
});

class MyParser extends Parser {
  constructor() {
    super([], [Comma]);
    this.RULE("commas", () => {
      this.MANY(() => {
        this.CONSUME(Comma);
      });
    });
    this.performSelfAnalysis();
  }
}
