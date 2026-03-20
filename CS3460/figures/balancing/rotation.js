const C_ACTIVE = '#ffb86c';
const C_OUTLINE = '#ffffff';
const C_ACCENT = '#bd93f9';

function makeLabeledCircle(label)
{
	let c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	c.setAttribute('fill', C_ACTIVE);
	c.setAttribute('stroke', C_OUTLINE);
	c.setAttribute('stroke-width', '5');
	c.setAttribute('r', 35);
	c.setAttribute('cx', 0);
	c.setAttribute('cy', 0);

	let t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	t.setAttribute('x', '0');
	t.setAttribute('y', '0');
	t.textContent = label;

	let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	g.appendChild(c);
	g.appendChild(t);

	document.getElementsByTagName('svg')[0].appendChild(g);
	return g;
}

function makeLabeledSubtree(label)
{
	let p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	p.setAttribute('fill', C_ACTIVE);
	p.setAttribute('stroke', C_OUTLINE);
	p.setAttribute('stroke-width', '5');
	p.setAttribute('stroke-linejoin', 'round');
	p.setAttribute('d', "M 0,0 L -60,150 60,150 z");

	let t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	t.setAttribute('x', '0');
	t.setAttribute('y', '110');
	t.textContent = label;

	let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	g.appendChild(p);
	g.appendChild(t);

	document.getElementsByTagName('svg')[0].appendChild(g);
	return g;
}

let timeline = null;
function init()
{
	if (!timeline)
	{
		let xy = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		xy.setAttribute('stroke', C_ACCENT);
		xy.setAttribute('stroke-width', '10');
		xy.setAttribute('stroke-linecap', 'round');
		xy.setAttribute('d', "M 280,40 L 175,125");
		xy.setAttribute('opacity', 1);
		document.getElementsByTagName('svg')[0].appendChild(xy);
		
		let toA = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		toA.setAttribute('stroke', C_OUTLINE);
		toA.setAttribute('stroke-width', '5');
		toA.setAttribute('stroke-linecap', 'round');
		toA.setAttribute('d', "M 175,125 L 100,200");
		document.getElementsByTagName('svg')[0].appendChild(toA);
		
		let toB = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		toB.setAttribute('stroke', C_OUTLINE);
		toB.setAttribute('stroke-width', '5');
		toB.setAttribute('stroke-linecap', 'round');
		toB.setAttribute('d', "M 175,125 L 250,200");
		toB.setAttribute('opacity', 1);
		document.getElementsByTagName('svg')[0].appendChild(toB);
		
		let toC = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		toC.setAttribute('stroke', C_OUTLINE);
		toC.setAttribute('stroke-width', '5');
		toC.setAttribute('stroke-linecap', 'round');
		toC.setAttribute('d', "M 280,40 L 375,125");
		document.getElementsByTagName('svg')[0].appendChild(toC);
		
		let x = makeLabeledCircle("x");
		let y = makeLabeledCircle("y");

		let A = makeLabeledSubtree("A");
		let B = makeLabeledSubtree("B");
		let C = makeLabeledSubtree("C");

		timeline = gsap.timeline({repeat: -1, repeatDelay: 1, defaults: {ease: "none"}});
		timeline.yoyo(true);

		timeline.to(A, {x: 100, y: 200, duration: 0});
		timeline.to(y, {x: 175, y: 125, duration: 0});
		timeline.to(B, {x: 250, y: 200, duration: 0});

		timeline.to(x, {x: 280, y: 40, duration: 0});
		timeline.to(C, {x: 375, y: 125, duration: 0});

		timeline.to({}, {duration: 1});

		// remove the path to B
		timeline.to(toB, {attr: {opacity: 0}, duration: 0.5});
		timeline.to(xy, {attr: {opacity: 0}, duration: 0.5}, "<");

		// move everything at once
		timeline.to(toB, {attr: {d: "M 325,125 L 250,200"}, duration: 2});
		timeline.to(xy, {attr: {d: "M 325,125 L 220,40"}, duration: 2}, "<");
		timeline.to(x, {x: 325, y: 125, duration: 2}, "<");
		timeline.to(C, {x: 400, y: 200, duration: 2}, "<");
		timeline.to(toC, {attr: {d: "M 325,125 L 400,200"}, duration: 2}, "<");
		timeline.to(y, {x: 220, y: 40, duration: 2}, "<");
		timeline.to(A, {x: 125, y: 125, duration: 2}, "<");
		timeline.to(toA, {attr: {d: "M 220,40 L 125,125"}, duration: 2}, "<");

		// re-add the path to B
		timeline.to(toB, {attr: {opacity: 1}, duration: 0.5});
		timeline.to(xy, {attr: {opacity: 1}, duration: 0.5}, "<");

		timeline.to({}, {duration: 1});
	}
	timeline.restart();
}