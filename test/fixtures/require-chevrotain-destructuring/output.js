const {
  Parser,
  createToken
} = require("chevrotain");

const Comma = createToken({
  name: "Comma",
  pattern: /,/
});

class MyParser extends Parser {
  constructor() {
    super([], [Comma], {
      serializedGrammar: JSON.parse("[{\"type\":\"Rule\",\"name\":\"commas\",\"definition\":[{\"type\":\"Repetition\",\"definition\":[{\"type\":\"Terminal\",\"name\":\"Comma\",\"label\":\"Comma\",\"idx\":0,\"pattern\":\",\"}]}]}]")
    });
    this.RULE("commas", () => {
      this.MANY(() => {
        this.CONSUME(Comma);
      });
    });
    this.performSelfAnalysis();
  }

}
