//TODO: Fix equals operations
// and add the other math operations...

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
	// height: "unset",
	flexBasis: "21%",	
	borderSize: "2px",	
	//borderColor located in stylesheet (selector on click)
	//borderStyle located in stylesheet (selector on click)
	borderRadius: "4px",
	textAlign: "center",
	//color style in child text element
	backgroundColor: "#343331", /** override in component*/
	height: "3%",
	display: "flex",
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
			cleared: true,
			decToggle: false,
			opStack: []
		};
		this.updateCurNum = this.updateCurNum.bind(this);
		this.decimalHandler = this.decimalHandler.bind(this);
		this.clearState = this.clearState.bind(this);
		this.operAdd = this.operAdd.bind(this);
		this.procEquals = this.procEquals.bind(this);
	}
	updateCurNum(appendage) {
		let firstIs = new String(appendage);
		let asIs;
		switch (this.state.cleared) {
			case (false): //existing display value already, concat
			(this.state.currentNum !== "0") ? asIs = this.state.currentNum.concat(firstIs) : asIs = firstIs;				
				this.setState({
					currentNum: asIs });
				break;
			default: //true
				this.setState({ 
					cleared: false,
					currentNum: firstIs });				
				break;
		}
	}
	decimalHandler(){
		switch (this.state.decToggle) {
			case true:
				//do nothing
				break;		
			default://false, update currentNum
				let newCurNum = this.state.currentNum.concat('.');
				this.setState({
					decToggle: true,
					currentNum: newCurNum
				});
				break;
		}
	}
	clearState(){
		this.setState({
			currentNum: "0",
			cleared: true,
			decToggle: false,
			opStack: []
		});
	}
	operAdd(opName) {
		console.log('operadd function'); //testing
		let currStack = Array.from(this.state.opStack);
		let lastOp;
		if (currStack.length > 0) {
			lastOp = currStack[(currStack.length - 1)];
			//set the operation object
			lastOp.firstValue = this.state.currentNum;
			lastOp.operation = opName;
			currStack[(currStack.length - 1)] = lastOp;
			//if opName not "equals", reset current value
			if (opName !== "equals") {
				//add new number object... to stack
				currStack.push({});
				this.setState({ currentNum: "0", opStack: currStack });
				return;
			} else {
				return currStack;
			}
		} else {
			//set up the first object...
			lastOp = {
				firstValue: this.state.currentNum,
				operation: opName};
			this.setState({ currentNum: "0", opStack: [lastOp] });
			 return; 
		}
	}
	procEquals() {
		//set stack final object to "equals"
		let currStack = Array.from(this.state.opStack);
		let lastOp;
		switch (this.state.cleared) {
			case true:
				//do nothing
				break;
			default: //stack has existing object, update last's operation					
				let stackToProc = this.operAdd("equals");
				//pass stack into processor...
				let processedStack = this.procStack(stackToProc);
				//return value as firstValue in new stack, object of length 1				
				//set cleared equal to true... for new number inputs
				this.setState({currentNum: processedStack, cleared: true, opStack:[{firstValue: processedStack}]});
				break;
		}
	}
	procStack(stackIn){
		//iterate over stack, performing operation for each object until "equals" operation
		let stackArr = Array.from(stackIn);
		let finalResult = stackArr.reduce((accu, curr) => {
			switch (accu.operation) {
				case "equals":
					return accu.firstValue;
				case "add":
					let newFirst = (Number.parseInt(accu.firstValue) + Number.parseInt(curr.firstValue))
					return {firstValue: newFirst, operation: curr.operation}			
				default:
					return {firstValue: 0, operation: "equals"}
			}//switch
		})
		return finalResult;
	}
	render() {
		return (<div id="calc-body" style={bodyStyle}>
			<Display show={this.state.currentNum}/>			
			<Button styleIn={buttonStyle} 
			updateCurrent={this.updateCurNum} 
			updateDecimal={this.decimalHandler}
			clearState={this.clearState}
			operAdd={this.operAdd}
			procEquals = {this.procEquals} />
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
				{this.props.show}
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
			onClick={() => this.useUpdater(v.nVal)}>
				<div style={buttonText}>{v.nVal}</div>
			</div>);
		});
		return (
			<div id="numbers" style={numBlock} >
				{numEles.reverse()}
				<Decimal styleIn={this.props.styleIn} updateDecimal={this.props.updateDecimal}/>
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
		return (<div id="equals" className="calc-button" style={this.props.styleIn} onClick={ ()=> this.props.procEquals() }><div style={buttonText}>=</div></div>);
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
		return (<div className="calc-button" style={styler} onClick={this.props.clearState}><div style={buttonText}>C</div></div>);
	}
}
//DECIMAL
class Decimal extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className="calc-button" style={this.props.styleIn} onClick={this.props.updateDecimal}><div style={buttonText}>.</div></div>);
	}
}
//ADD button
class Add extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className="calc-button" style={this.props.styleIn} onClick={ () => this.props.operAdd("add") }>
		<div style={buttonText}>+</div></div>);
	}
}
//SUBTRACT button
class Subtract extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className="calc-button" style={this.props.styleIn} onClick={ () => this.props.operAdd("sub") }>
		<div style={buttonText}>-</div></div>);
	}
}
//MULTIPLY button
class Multiply extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className="calc-button" style={this.props.styleIn} onClick={ () => this.props.operAdd("mul") }>
		<div style={buttonText}>×</div></div>);
	}
}
//DIVIDE 
class Divide extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (<div className="calc-button" style={this.props.styleIn} onClick={ () => this.props.operAdd("div") }>
		<div style={buttonText}>÷</div></div>);
	}
}

const calcLoc = document.getElementById('calc-wrap');
ReactDOM.render(<CalcApp />, calcLoc);
