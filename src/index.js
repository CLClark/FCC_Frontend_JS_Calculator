
const disStyle = {
	margin: "5%",
	width: "auto",
	height: "5%",
	border: "3px solid #939592",
	textAlign: "center",
	backgroundColor: "#5b6856",
	display: "flex",
	justifyContent: "flex-end"
}
const disValues={
	marginTop: "auto",
	marginBottom: "auto",
	fontSize: "x-large"
}
const bodyStyle = {
	margin: "auto",
	width: "40%",
	//height: "50%",
	border: "3px solid green",
	textAlign: "center",
	backgroundImage: "linear-gradient(#f3f4f9, #9e9495)"
}
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
	backgroundColor: "#343331", /** override in component*/	
	display: "inline",
	justifyContent: "space-around"
}
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
}
const buttonText = {
	margin: "auto",
	fontSize: "x-large",
	color: "#e9e8e8"	
}
const numBlock = {
	//container for number buttons
	display: "flex",
	flexWrap: "wrap",
	flexDirection: "row",
	justifyContent: "center",
	margin: "2% 5%",
	border: "2px outset",
	padding: "2% 0"
}

//CALC BODY
class CalcApp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentNum: "0",
			newValue: false,
			decToggle: false,			
			currentEval: []
			/* opStack: [], */
		};
		this.updateCurNum = this.updateCurNum.bind(this);		
		this.clearState = this.clearState.bind(this);
		this.operAdd = this.operAdd.bind(this);
		this.procEquals = this.procEquals.bind(this);
		this.transpileOpCode = this.transpileOpCode.bind(this);
		/* this.updateEvalArray = this.updateEvalArray.bind(this); */
		/* this.switchLastOperator = this.switchLastOperator.bind(this); */
	}
	clearState() {
		this.setState({
			currentNum: "0",
			newValue: false,
			decToggle: false,			
			currentEval: []
			/* opStack: [] */
		});
	}	
	updateCurNum(appendage) {
		let firstIs = new String(appendage);
		let asIs;
		if (this.state.newValue == false) {
			switch (appendage) {
				case "decimal":
					if (this.state.decToggle) {
						return;
					} else { //add the decimal
						asIs = this.state.currentNum.concat(".");
						this.setState({
							currentNum: asIs,
							decToggle: true
						}, () => {
							console.log(JSON.stringify(this.state));
						});
					}
					break;
				case "0":
					if (this.state.currentNum == "0") {
						return;
					} else {
						asIs = this.state.currentNum.concat(firstIs);
						this.setState({
							currentNum: asIs
						}, () => {
							console.log(JSON.stringify(this.state));
						});
						break;
					}//else					
				default: //a number
					(this.state.currentNum == "0") ? asIs = firstIs : asIs = this.state.currentNum.concat(firstIs);
					this.setState({
						currentNum: asIs
					}, () => {
						console.log(JSON.stringify(this.state));
					});
					break;
			}
		} else { //newValue expected
			let newCurr; let decTest;
			if (appendage == "decimal") { //is a decimal
				newCurr = "0.";
				decTest = true;
			} else { //not a decimal
				newCurr = appendage;
				decTest = false;
			}
			let currEval = Array.from(this.state.currentEval);			
			if (currEval.length > 0) {
				// currEval.push(this.state.currentNum); //space for this current inputting value
				this.setState({
					currentNum: newCurr,
					newValue: false,
					currentEval: currEval,
					decToggle: decTest
				}, () => {
					console.log(JSON.stringify(this.state));
				});
			}//length > 0
		}
	}
	//add an operation to the stack
	operAdd(opName){
		const transOp = this.transpileOpCode(opName);
		//alternate logic:
		return new Promise((resolve, reject) => {
			let currEval = Array.from(this.state.currentEval);			
			if (currEval.length > 0) {
			//evalString already exists			
				let regex = /[\+\-\\\*\=]/g;
				let lastString = new String(currEval[(currEval.length-1)]);
				if(lastString.match(regex) && this.state.newValue){				
				//operator already exists... replace it					
					console.log(lastString + " :matched the regex");
					currEval.splice((currEval.length-1),1,transOp);
					this.setState({
						currentNum: this.state.currentNum,
						currentEval: currEval,
						newValue: true, //expecting a new value
						decToggle: false
					},() => {
						resolve(Array.from(this.state.currentEval));	
					});				
				}else{
				//operator did not match, push number and operator
					currEval.push(this.state.currentNum, transOp);
					// currEval.push(transOp);
					this.setState({
						currentNum: this.state.currentNum,
						currentEval: currEval,
						newValue: true, //expecting a new value
						decToggle: false
					},() => {
						resolve(Array.from(this.state.currentEval));	
					});	
				}//else	
			} else {
			//initialize  evalString...
				let firstValue = this.state.currentNum;				
				this.setState({
					newValue: true,
					currentEval: [firstValue, transOp],
					decToggle: false
				}, () => {						
					console.log(JSON.stringify(this.state));
					resolve(Array.from(this.state.currentEval));			
				});				
			}			
		});		
	}
	//process an equals click
	procEquals() {
		this.operAdd("equals").then((finalStack) => {
			let currEval = Array.from(finalStack);
			//alternate logic:
			let regex = /[\+\-\\\*\=]/g;
			let lastString = new String(currEval[(currEval.length - 1)]);
			if (lastString.match(regex)) { //final item is an operator... remove it and calculate
				currEval.splice(currEval.length - 1, 1);
				let opString = currEval.join(" ");
				console.log(opString);
				let opResult = eval(opString);
				// document.getElementById("display").innerText = opResult;
				this.setState({
					currentNum: opResult,
					cleared: false,
					currentEval: []
				});
			} else { //final item is not an operator
				let opString = currEval.join(" ");
				console.log(opString);
				let opResult = eval(opString);
				// document.getElementById("display").innerText = opResult;
				this.setState({
					currentNum: opResult,
					cleared: false,
					currentEval: [opResult]
				});
			}//else		
		}).catch((e) => {console.log(e);});
		/* //old logic...		
		//set stack final object to "equals"		
	 		this.operAdd("equals")
			.then((finalStack) => {
				//pass stack into processor...
				let processedStack = this.procStack(finalStack);
				//return value as firstValue in new stack, object of length 1
				this.setState({
					currentNum: processedStack,
					cleared: false,
					opStack: []
				}, () => {
					console.log("stack is: " + JSON.stringify(processedStack));
				});
			})
			.catch((e) => { console.log(e); });  */
	}
	transpileOpCode(opName){
		//first, transpile the op code
		switch (opName) {
			case "add": return "+"
			case "sub": return "-"
			case "mul": return "*"
			case "div": return "/"
			case "equals": return "="
			default:
				return opName;				
		}
	}
	componentDidMount(){
		console.log(this.state.currentEval);
	}
	render() {
		return (<div id="calc-body" style={bodyStyle}>
			<Display show={this.state.currentNum}/>			
			<Button styleIn={buttonStyle} 
			updateCurrent={this.updateCurNum} 			
			clearState={this.clearState}
			operAdd={this.operAdd}
			procEquals = {this.procEquals} 
			/>
		</div>);
	}
}
// CALC OUTPUT DISPLAY
class Display extends React.Component {
	constructor(props) {
		super(props);
	}	
	render() {
		return (
		<div id="display-wrap" style={disStyle}>
			<div id="display" style={disValues}>			
				{/* {Number.parseFloat(this.props.show)} */}
				{(this.props.show)}
			</div>
		</div>);
	}
}
//BUTTONS Grid
class Button extends React.Component {
	constructor(props) {
		super(props);
		this.useUpdater = this.useUpdater.bind(this);
	}
	useUpdater(val){
		this.props.updateCurrent(val);
	}
	render() {	
		const numArr = [{nVal: 0, nName: "zero"},
			{nVal: 3, nName: "three"},{nVal: 2, nName: "two"},{nVal: 1, nName: "one"},
			{nVal: 6, nName: "six"},{nVal: 5, nName: "five"},{nVal: 4, nName: "four"},
			{nVal: 9, nName: "nine"},{nVal: 8, nName: "eight"},{nVal: 7, nName: "seven"}];		
		const numEles = numArr.map((v,ind)=>{
			return (<div id={v.nName} key={v.nName} className="calc-button" style={this.props.styleIn} 
			onClick={() => this.useUpdater(v.nVal.toString())}>
				<span style={buttonText}>{v.nVal}</span>
			</div>);
		});
		return (
			<div id="numbers" style={numBlock} >
				{numEles.reverse()}
				<Decimal styleIn={this.props.styleIn} updateDecimal={this.props.updateCurrent}/>
				<div style={blankStyle}></div>
				{/** math operations */}
				<Add styleIn={this.props.styleIn} operAdd={this.props.operAdd} />
				<Multiply styleIn={this.props.styleIn} operAdd={this.props.operAdd} />
				<Equals styleIn={this.props.styleIn} procEquals={this.props.procEquals} />
				<Subtract styleIn={this.props.styleIn} operAdd={this.props.operAdd} />
				<Divide styleIn={this.props.styleIn} operAdd={this.props.operAdd} />
				<Clear styleIn={this.props.styleIn} clearState={this.props.clearState}/>				
			</div>
			);			
	}
}
//EQUALS 
class Equals extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div id="equals" className="calc-button" style={this.props.styleIn} onClick={ ()=> this.props.procEquals() }><span style={buttonText}>=</span></div>);
	}
}
//CLEAR
class Clear extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		let styler =  JSON.parse(JSON.stringify(this.props.styleIn));
		styler.backgroundColor = "#feca20";
		return (<div id="clear" className="calc-button" style={styler} onClick={this.props.clearState}><span style={buttonText}>C</span></div>);
	}
}
//DECIMAL
class Decimal extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div id="decimal" className="calc-button" style={this.props.styleIn} onClick={ () => this.props.updateDecimal("decimal")} ><span style={buttonText}>.</span></div>);
	}
}
//ADD button
class Add extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div id="add" className="calc-button" style={this.props.styleIn} onClick={ () => this.props.operAdd("add") }>
		<span style={buttonText}>+</span></div>);
	}
}
//SUBTRACT button
class Subtract extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div id="subtract" className="calc-button" style={this.props.styleIn} onClick={ () => this.props.operAdd("sub") }>
		<span style={buttonText}>-</span></div>);
	}
}
//MULTIPLY button
class Multiply extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div id="multiply" className="calc-button" style={this.props.styleIn} onClick={ () => this.props.operAdd("mul") }>
		<span style={buttonText}>×</span></div>);//×
	}
}
//DIVIDE 
class Divide extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div id="divide" className="calc-button" style={this.props.styleIn} onClick={ () => this.props.operAdd("div") }>
		<span style={buttonText}>÷</span></div>);
	}
}

const calcLoc = document.getElementById('calc-wrap');
ReactDOM.render(<CalcApp />, calcLoc);


/**notes
 * 
 * 
 * 
 * 
 * 
 */

/* updateCurNumOld(appendage) {
		let firstIs = new String(appendage);
		let asIs;
		if (this.state.newValue == false) {
			switch (appendage) {
				case "decimal":
					if (this.state.decToggle) {
						return;
					} else { //add the decimal
						asIs = this.state.currentNum.concat(".");
						this.setState({
							currentNum: asIs,
							decToggle: true
						}, () => {
							console.log(JSON.stringify(this.state));
						});
					}
					break;
				case "0":
					if (this.state.currentNum == "0") {
						return;
					} else {
						asIs = this.state.currentNum.concat(firstIs);
						this.setState({
							currentNum: asIs
						}, () => {
							console.log(JSON.stringify(this.state));
						});
						break;
					}//else					
				default: //a number
					(this.state.currentNum == "0") ? asIs = firstIs : asIs = this.state.currentNum.concat(firstIs);
					this.setState({
						currentNum: asIs
					}, () => {
						console.log(JSON.stringify(this.state));
					});
					break;
			}
		} else { //newValue expected
			let newCurr; let decTest;
			if (appendage == "decimal") { //is a decimal
				newCurr = "0.";
				decTest = true;
			} else { //not a decimal
				newCurr = appendage;
				decTest = false;
			}
			let currStack = Array.from(this.state.opStack);
			let lastOp;
			if (currStack.length > 0) {
				currStack.push({
					firstValue: this.state.currentNum
				}); //space for this current inputting value
				this.setState({
					currentNum: newCurr,
					newValue: false,
					opStack: currStack,
					decToggle: decTest
				}, () => {
					console.log(JSON.stringify(this.state));
				});
			}//length > 0
		}
	}
	operAddOld(opName) {
		return new Promise((resolve, reject) => {
			let currStack = Array.from(this.state.opStack);
			let lastOp;
			//this is the first operation value
			if (currStack.length > 0) {
				lastOp = currStack[(currStack.length - 1)];
				//set the operation object
				lastOp.firstValue = this.state.currentNum;
				lastOp.operation = opName;
				currStack[(currStack.length - 1)] = lastOp;				
				this.setState({
					currentNum: this.state.currentNum,
					opStack: currStack,
					newValue: true, //expecting a new value
					decToggle: false
				}, () => {					
					if (opName == "equals") {
						console.log("opName equals");
						resolve(Array.from(this.state.opStack));						
					}else{
						return;
					}					
				});
			} else {
				//set up the first object...				
				lastOp = {
					firstValue: this.state.currentNum,
					operation: opName
				};
				this.setState({
					// currentNum: "0",
					newValue: true,
					opStack: [lastOp],
					decToggle: false
				}, () => {						
					console.log(JSON.stringify(this.state));
					resolve(Array.from(this.state.opStack));			
				});			
				return;
			}//else, empty stack
		});//promise
	} */
	
/* 	updateEvalArray(whatVal){
		return new Promise((resolve, reject) => {
			let currEval = Array.from(this.state.currentEval);
			currEval.push(whatVal);
			this.setState({
				currentEval: currEval
			},() => {
				resolve(this.state.currentEval);
			});	
		});		
	} */	
/* 	switchLastOperator(whatOp){
		const opString = this.transpileOpCode(whatOp);		
		//replaces the last object in the eval array with a new operator
		let currEval = Array.from(this.state.currentEval);
		if(currEval.length == 0){
			//no existing obj's, add a 0 and the operator
			currEval = this.updateEvalArray("0");
			currEval.push(opString);
			this.setState({
				currentEval: currEval
			});
		}else{
			let regex = /[\+\-\\\*]/g;
			let lastString = new String(currEval[(currEval.length-1)]);
			if(lastString.match(regex)){
				//replacing last operator
				console.log(lastString + " :matched the regex");
				currEval.splice((currEval.length-1),1,[opString]);
				this.setState({
					currentEval: currEval
				});				
			}else{
				//regex did not match an operator
				currEval.push(opString);
				this.setState({
					currentEval: currEval
				});
			}//else
		}//array has items...		
	} */

	/* procStack(stackIn){
		//iterate over stack, performing operation for each object until "equals" operation
		let stackArr = Array.from(stackIn);
		let finalResult = stackArr.reduce((accu, curr, cInd) => {
			console.log(accu.firstValue + " | " + curr.firstValue);
			let newFirst;
			switch (accu.operation) {
				case "equals":
					return {firstValue: accu.firstValue, operation: "equals"}
				case "add":
					newFirst = (Number.parseFloat(accu.firstValue) + Number.parseFloat(curr.firstValue)).toString();
					return {firstValue: newFirst, operation: curr.operation}					
				case "sub":
					newFirst = (Number.parseFloat(accu.firstValue) - Number.parseFloat(curr.firstValue)).toString();
					return {firstValue: newFirst, operation: curr.operation}
				case "div":
					newFirst = (Number.parseFloat(accu.firstValue)/Number.parseFloat(curr.firstValue)).toString();
					return {firstValue: newFirst, operation: curr.operation}
				case "mul":
					newFirst = (Number.parseFloat(accu.firstValue)*Number.parseFloat(curr.firstValue)).toString();					
					return {firstValue: newFirst, operation: curr.operation};
				default:
					console.error("stack process error: default");
					return {firstValue: accu.firstValue, operation: "equals"}					
			}//switch
		});		
		return finalResult.firstValue;
	} 
*/
	
