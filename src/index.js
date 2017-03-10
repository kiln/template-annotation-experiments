import * as d3 from "d3";
import * as annotate from "d3-svg-annotation";

var svg, rect;
var x, y;

var annotatable = Flourish.environment == "story_editor" || Flourish.environment == "sdk";

export var data = {
	random: [
		[ 23, 385 ],
		[ 43, 73 ],
		[ 46, 62 ],
		[ 197, 126 ],
		[ 158, 265 ],
		[ 325, 156 ],
		[ 225, 444 ],
		[ 376, 117 ]
	]
};

export var state = {
	annotations: [],
	annotation_type: "annotationCalloutCircle"
};

function addAnnotation(node, d) {
	var r = node.getBoundingClientRect();
	var a = {
		note: {
			title: "OMG! Drag Me!",
			label: "Values: " + d[0] + " & " + d[1] + ""
		},
		data: d,
		dx: 20,
		dy: 20,
		subject: {
			radius: node.getAttribute("r")*3,
			radiusPadding: 0
		}
	}
	state.annotations.push(a);
	update();
}

function setSizes() {
	var w = window.innerWidth, h = window.innerHeight;
	x = d3.scaleLinear().range([0, w]).domain([0, 500]);
	y = d3.scaleLinear().range([0, h]).domain([0, 500]);
	d3.select("svg").attr("width", w).attr("height", h);
	d3.select("svg rect").attr("width", w).attr("height", h);
}

export function update() {
	setSizes();
	var dots = svg.selectAll(".dot").data(data.random);
	var enter = dots.enter().append("circle")
		.on("click", function(d) {
			if (annotatable) addAnnotation(this, d);
		});
	dots.merge(enter)
		.attr("fill", "black").attr("class", "dot")
		.attr("cx", function(d, i) { return x(d[0]); })
		.attr("cy", function(d, i) { return y(d[1]); })
		.attr("r", function(d, i) { return 4 * d[0]/d[1]; });
	d3.select(".annotation-group").call(
		annotate.annotation()
		.editMode(annotatable)
		.type(annotate[state.annotation_type])
		.accessors({
			x: function(d) { return x(d[0]); },
			y: function(d) { return y(d[1]); }
		})
		.annotations(state.annotations)
	);
}

export function draw() {
	svg = d3.select("body").append("svg");
	rect = svg.append("rect").attr("width", 500).attr("height", 500).attr("fill", "#eee");
	svg.append("g").attr("class", "annotation-group");
	update();
	window.onresize = update;
}
