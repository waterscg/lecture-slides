const C_ACTIVE = '#ffb86c';
const C_MOVING = '#ff7f2a';
const C_LOCKED = '#ff6666';
const C_ACCENT = '#bd93f9';

const N = 15;
const W = 400 / N;

function makePath(x)
{
	let w = x * W;
	return `M 0 0 C 0 50, ${w} 50, ${w} 0`;
}

let rects = [], plines = [], pheads = [];
let timeline = gsap.timeline({repeat: -1, repeatDelay: 3});
function init()
{
	let nums = [];
	for (let i = 0; i < N; i++)
	{
		nums.push(i+1);
		let ndx = Math.floor(Math.random() * nums.length);
		[nums[ndx], nums[nums.length-1]] = [nums[nums.length-1], nums[ndx]];
	}
	
	for (let r of rects) r.remove();
	rects = [];
	for (const [i, x] of nums.entries())
	{
		let h = 50 + (150 * x / N);
		let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		rect.setAttribute('fill', C_ACTIVE);
		rect.setAttribute('stroke', 'white');
		rect.setAttribute('stroke-width', '2');
		rect.setAttribute('width', W);
		rect.setAttribute('height', h);
		rect.setAttribute('x', 5 + i * W);
		rect.setAttribute('y', 205 - h);

		document.getElementsByTagName('svg')[0].appendChild(rect);
		rects.push(rect);
	}

	for (let a of plines) a.remove();
	for (let a of pheads) a.remove();
	plines = [];
	pheads = [];
	for (let i = 0; i < 2; i++)
	{
		let pline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		pline.setAttribute('d', 'M 0 0');
		pline.setAttribute('fill', 'none');
		pline.setAttribute('stroke', C_ACCENT);
		pline.setAttribute('stroke-width', '3');
		pline.setAttribute('opacity', 0);

		document.getElementsByTagName('svg')[0].appendChild(pline);
		plines.push(pline);

		// ----

		let phead = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		phead.setAttribute('d', 'M -5,5 L 0,0 L 5,5');
		phead.setAttribute('fill', 'none');
		phead.setAttribute('stroke', C_ACCENT);
		phead.setAttribute('stroke-width', '3');
		phead.setAttribute('opacity', 0);

		document.getElementsByTagName('svg')[0].appendChild(phead);
		pheads.push(phead);
	}
	
	timeline.clear();
	timeline.to({}, {duration: 2});

	// build a max heap
	let n = N;
	let getv = (i) => i < n ? +rects[i].getAttribute('height') : 0;
	let child1 = (i) => 2*i + 1;
	let child2 = (i) => 2*i + 2;
	let CHILDREN = [child1, child2];

	function sift_down(i)
	{
		// the currently sifted element, highlighted
		let moverect = rects[i];
		timeline.to(moverect, {fill: C_MOVING, duration: 0.3});

		while (CHILDREN.some((f) => getv(i) < getv(f(i))))
		{
			// draw arrows
			timeline.to({}, {duration: 0.3});
			for (let [fi, f] of CHILDREN.entries())
			{
				let ndx = f(i);
				if (!getv(ndx)) continue;
				timeline.to(plines[fi], {attr: {d: makePath(ndx-i)}, x: 5 + i * W + W/2, y: 210, duration: 0}, "<");
				timeline.to(plines[fi], {attr: {opacity: 1}, duration: 0.3}, "<");
				timeline.to(pheads[fi], {x: 5 + ndx * W + W/2, y: 210, duration: 0}, "<");
				timeline.to(pheads[fi], {attr: {opacity: 1}, duration: 0.3}, "<");
			}

			// find max child
			let x = child1(i);
			if (getv(child2(i)) > getv(child1(i))) x = child2(i);

			// swap with max child
			timeline.to(rects[x], {attr: {x: 5 + i * W}, duration: 0.3});
			timeline.to(rects[i], {attr: {x: 5 + x * W}, duration: 0.3}, "<");

			// hide arrows
			timeline.to({}, {duration: 0.3});
			for (let [fi, f] of CHILDREN.entries())
			{
				let ndx = f(i);
				if (!getv(ndx)) continue;
				timeline.to(plines[fi], {attr: {opacity: 0}, duration: 0.3}, "<");
				timeline.to(pheads[fi], {attr: {opacity: 0}, duration: 0.3}, "<");
			}

			// perform actual swap here
			[rects[i], rects[x]] = [rects[x], rects[i]];
			i = x;
		}

		// remove highlight on sifted element
		timeline.to(moverect, {fill: C_ACTIVE, duration: 0.3});
	}

	// build initial max heap
	for (let i = N-1; i >= 0; i--) sift_down(i);

	// remove-max N times
	while (n > 1)
	{
		timeline.to(rects[0], {attr: {x: 5 + (n-1) * W}, fill: C_LOCKED, duration: 0.3});
		timeline.to(rects[n-1], {attr: {x: 5}, duration: 0.3}, "<");
		[rects[0], rects[n-1]] = [rects[n-1], rects[0]];

		timeline.to({}, {duration: 0.5});
		n--; // reduce size before sifting because the array is smaller
		sift_down(0);
	}

	timeline.to(rects[0], {fill: C_LOCKED, duration: 0.3});
}