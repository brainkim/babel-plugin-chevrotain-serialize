"use strict";

var _chevrotain = require("chevrotain");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Comma = (0, _chevrotain.createToken)({
  name: "Comma",
  pattern: /,/
});

var MyParser =
/*#__PURE__*/
function (_Parser) {
  _inherits(MyParser, _Parser);

  function MyParser() {
    var _this;

    _classCallCheck(this, MyParser);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MyParser).call(this, {
      Comma: Comma
    }, {
      serializedGrammar: JSON.parse("[{\"type\":\"Rule\",\"name\":\"commas\",\"orgText\":\"function () {\\n      _this.MANY(function () {\\n        _this.CONSUME(Comma);\\n      });\\n    }\",\"definition\":[{\"type\":\"Repetition\",\"idx\":0,\"definition\":[{\"type\":\"Terminal\",\"name\":\"Comma\",\"label\":\"Comma\",\"idx\":0,\"pattern\":\",\"}]}]}]")
    }));

    _this.RULE("commas", function () {
      _this.MANY(function () {
        _this.CONSUME(Comma);
      });
    });

    _this.performSelfAnalysis();

    return _this;
  }

  return MyParser;
}(_chevrotain.Parser);