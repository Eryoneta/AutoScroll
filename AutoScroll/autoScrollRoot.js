//AUTOSCROLL_ROOT
class AutoScrollRoot {
	//VARS
	view = new AutoScrollView(this);
	plan = new AutoScrollPlan(this);
	rule = new AutoScrollRule(this);
	flow = new AutoScrollFlow(this);
	//MAIN
	constructor() { }
	init() {
		this.view.init();
		this.plan.init();
		this.rule.init();
		this.flow.init();
	}
}