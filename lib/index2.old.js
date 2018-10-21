const disStyle = {
  margin: "5%",
  width: "auto",
  height: "5%",
  border: "3px solid #939592",
  textAlign: "center",
  backgroundColor: "#5b6856",
  display: "flex",
  justifyContent: "flex-end"
};
const disValues = {
  marginTop: "auto",
  marginBottom: "auto",
  fontSize: "x-large"
};
const bodyStyle = {
  margin: "auto",
  width: "40%",
  //height: "50%",
  border: "3px solid green",
  textAlign: "center",
  backgroundImage: "linear-gradient(#f3f4f9, #9e9495)"
};
const buttonStyle = {
  margin: "2% 1.6%",
  height: "3%",
  flexBasis: "21%",
  borderSize: "2px",
  //borderColor located in stylesheet (selector on click)
  //borderStyle located in stylesheet (selector on click)
  borderRadius: "4px",
  textAlign: "center",
  //color style in child text element
  backgroundColor: "#343331",

  /** override in component*/
  display: "inline",
  justifyContent: "space-around"
};
const blankStyle = {
  //the integers
  margin: "1px 1.6%",
  // height: "20px",
  flexBasis: "21%",
  border: "2px solid",
  borderColor: "transparent",
  borderRadius: "4px",
  backgroundColor: "unset",
  color: "unset"
};
const buttonText = {
  margin: "auto",
  fontSize: "x-large",
  color: "#e9e8e8"
};
const numBlock = {
  //container for number buttons
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "row",
  justifyContent: "center",
  margin: "2% 5%",
  border: "2px outset",
  padding: "2% 0" //CALC BODY

};

class CalcApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentNum: "0",
      lastPressed: "op",
      decToggle: false,
      currentEval: []
    };
    this.clearState = this.clearState.bind(this);
    this.updateCurNum = this.updateCurNum.bind(this);
    this.operAdd = this.operAdd.bind(this);
    this.clearState = this.clearState.bind(this);
    this.procEquals = this.procEquals.bind(this);
  }

  clearState() {
    this.setState({
      currentNum: "0",
      lastPressed: "op",
      decToggle: false,
      currentEval: []
    });
  }

  updateCurNum(appendage) {
    let firstIs = appendage;
    let asIs;

    const switchStatement = function (postEquals) {
      switch (appendage) {
        case "decimal":
          if (this.state.decToggle) {
            return;
          } else {
            //add the decimal
            //was an operator pressed last? yes> this is a new value, no> it's adding to an existing number
            this.state.lastPressed == "op" ? asIs = "0." : asIs = this.state.currentNum.concat(".");
            this.setState({
              lastPressed: "num",
              currentNum: asIs,
              decToggle: true
            }, () => {
              console.log(this.state);
            });
          }

          break;

        case "0":
          if (this.state.currentNum == "0") {
            return;
          } else {
            //was an operator pressed last? yes> this is a new value, no> it's adding to an existing number
            this.state.lastPressed == "op" ? asIs = appendage : asIs = String(this.state.currentNum).concat(firstIs);
            this.setState({
              currentNum: asIs,
              lastPressed: "num"
            }, () => {
              console.log(this.state);
            });
            break;
          }

        //else					

        default:
          //a number
          //was an operator pressed last? yes> this is a new value, no> it's adding to an existing number				
          this.state.lastPressed == "op" || postEquals == true ? asIs = appendage : asIs = String(this.state.currentNum).concat(firstIs);
          this.setState({
            currentNum: asIs,
            lastPressed: "num"
          }, () => {
            console.log(this.state);
          });
          break;
      } //switch

    };

    const boundSwitch = switchStatement.bind(this);

    if (this.state.lastPressed == "equals") {
      //weak reset after equals operation
      this.setState({
        currentEval: []
      }, boundSwitch(true));
    } else {
      boundSwitch(false);
    }
  } //add an operation to the stack


  operAdd(opName) {
    const nowArray = Array.from(this.state.currentEval);

    if (this.state.lastPressed == "op") {
      //replace the existing operation
      nowArray.splice(nowArray.length - 1, 1, this.transpileOpCode(opName));
      this.setState({
        lastPressed: "op",
        decToggle: false,
        currentEval: nowArray
      }, () => {
        console.log(this.state);
      }); //setState
    } else {
      nowArray.push(this.state.currentNum, this.transpileOpCode(opName));
      this.setState({
        currentEval: nowArray,
        decToggle: false,
        lastPressed: "op"
      }, () => {
        console.log(this.state);
      });
    } //else

  } //process an equals click


  procEquals() {
    if (this.state.currentEval.length < 2) {
      return;
    } else {
      //if op pressed last, splice off (1) and Math.evaluate
      //if num pressed last, add currentNum to evalString, then evaluate, then move answer to currentNum
      let evalArray = Array.from(this.state.currentEval);
      this.state.lastPressed == "num" ? evalArray.push(this.state.currentNum) : evalArray.pop();
      let answer = eval(evalArray.join(" "));
      this.setState({
        currentNum: answer,
        currentEval: [],
        lastPressed: "equals",
        decToggle: false
      });
    }
  }

  transpileOpCode(opName) {
    //first, transpile the op code
    switch (opName) {
      case "add":
        return "+";

      case "sub":
        return "-";

      case "mul":
        return "*";

      case "div":
        return "/";

      case "equals":
        return "=";

      default:
        return opName;
    }
  }

  render() {
    return React.createElement("div", {
      id: "calc-body",
      style: bodyStyle
    }, React.createElement(Display, {
      show: this.state.currentNum
    }), React.createElement(Button, {
      styleIn: buttonStyle,
      updateCurrent: this.updateCurNum,
      clearState: this.clearState,
      operAdd: this.operAdd,
      procEquals: this.procEquals
    }));
  }

} // CALC OUTPUT DISPLAY


class Display extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", {
      id: "display-wrap",
      style: disStyle
    }, React.createElement("div", {
      id: "display",
      style: disValues
    }, this.props.show));
  }

} //BUTTONS Grid


class Button extends React.Component {
  constructor(props) {
    super(props);
    this.useUpdater = this.useUpdater.bind(this);
  }

  useUpdater(val) {
    this.props.updateCurrent(val);
  }

  render() {
    const numArr = [{
      nVal: 0,
      nName: "zero"
    }, {
      nVal: 3,
      nName: "three"
    }, {
      nVal: 2,
      nName: "two"
    }, {
      nVal: 1,
      nName: "one"
    }, {
      nVal: 6,
      nName: "six"
    }, {
      nVal: 5,
      nName: "five"
    }, {
      nVal: 4,
      nName: "four"
    }, {
      nVal: 9,
      nName: "nine"
    }, {
      nVal: 8,
      nName: "eight"
    }, {
      nVal: 7,
      nName: "seven"
    }];
    const numEles = numArr.map((v, ind) => {
      return React.createElement("div", {
        id: v.nName,
        key: v.nName,
        className: "calc-button",
        style: this.props.styleIn,
        onClick: () => this.useUpdater(v.nVal.toString())
      }, React.createElement("span", {
        style: buttonText
      }, v.nVal));
    });
    return React.createElement("div", {
      id: "numbers",
      style: numBlock
    }, numEles.reverse(), React.createElement(Decimal, {
      styleIn: this.props.styleIn,
      updateDecimal: this.props.updateCurrent
    }), React.createElement("div", {
      style: blankStyle
    }), React.createElement(Add, {
      styleIn: this.props.styleIn,
      operAdd: this.props.operAdd
    }), React.createElement(Multiply, {
      styleIn: this.props.styleIn,
      operAdd: this.props.operAdd
    }), React.createElement(Equals, {
      styleIn: this.props.styleIn,
      procEquals: this.props.procEquals
    }), React.createElement(Subtract, {
      styleIn: this.props.styleIn,
      operAdd: this.props.operAdd
    }), React.createElement(Divide, {
      styleIn: this.props.styleIn,
      operAdd: this.props.operAdd
    }), React.createElement(Clear, {
      styleIn: this.props.styleIn,
      clearState: this.props.clearState
    }));
  }

} //EQUALS 


class Equals extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", {
      id: "equals",
      className: "calc-button",
      style: this.props.styleIn,
      onClick: () => this.props.procEquals()
    }, React.createElement("span", {
      style: buttonText
    }, "="));
  }

} //CLEAR


class Clear extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let styler = JSON.parse(JSON.stringify(this.props.styleIn));
    styler.backgroundColor = "#feca20";
    return React.createElement("div", {
      id: "clear",
      className: "calc-button",
      style: styler,
      onClick: this.props.clearState
    }, React.createElement("span", {
      style: buttonText
    }, "C"));
  }

} //DECIMAL


class Decimal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", {
      id: "decimal",
      className: "calc-button",
      style: this.props.styleIn,
      onClick: () => this.props.updateDecimal("decimal")
    }, React.createElement("span", {
      style: buttonText
    }, "."));
  }

} //ADD button


class Add extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", {
      id: "add",
      className: "calc-button",
      style: this.props.styleIn,
      onClick: () => this.props.operAdd("add")
    }, React.createElement("span", {
      style: buttonText
    }, "+"));
  }

} //SUBTRACT button


class Subtract extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", {
      id: "subtract",
      className: "calc-button",
      style: this.props.styleIn,
      onClick: () => this.props.operAdd("sub")
    }, React.createElement("span", {
      style: buttonText
    }, "-"));
  }

} //MULTIPLY button


class Multiply extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", {
      id: "multiply",
      className: "calc-button",
      style: this.props.styleIn,
      onClick: () => this.props.operAdd("mul")
    }, React.createElement("span", {
      style: buttonText
    }, "\xD7")); //×
  }

} //DIVIDE 


class Divide extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return React.createElement("div", {
      id: "divide",
      className: "calc-button",
      style: this.props.styleIn,
      onClick: () => this.props.operAdd("div")
    }, React.createElement("span", {
      style: buttonText
    }, "\xF7"));
  }

}

const calcLoc = document.getElementById('calc-wrap');
ReactDOM.render(React.createElement(CalcApp, null), calcLoc);
//# sourceMappingURL=index2.old.js.map