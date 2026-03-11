const C_ACTIVE = '#ffb86c';
const C_MOVING = '#ff7f2a';
const C_LOCKED = '#ff6666';
const C_ACCENT = '#bd93f9';

const N = 15;
const W = 400 / N;
const pad = 10;

let rects = [], pivotline, arrows = [];
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
		let h = 50 + (x * 150 / N);
		let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		rect.setAttribute('fill', C_ACTIVE);
		rect.setAttribute('height', h);
		rect.setAttribute('stroke', 'white');
		rect.setAttribute('stroke-width', '2');
		rect.setAttribute('width', W);
		rect.setAttribute('x', pad + i * W);
		rect.setAttribute('y', 205 - h);
		rect.setAttribute('opacity', 1);

		document.getElementsByTagName('svg')[0].appendChild(rect);
		rects.push(rect);
	}

	if (pivotline) pivotline.remove();
	pivotline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	pivotline.setAttribute('d', 'M 0 0 L 0 200');
	pivotline.setAttribute('fill', 'none');
	pivotline.setAttribute('stroke', C_ACCENT);
	pivotline.setAttribute('stroke-width', '2');
	pivotline.setAttribute('stroke-dasharray', '16,4');
	pivotline.setAttribute('opacity', 0);
	document.getElementsByTagName('svg')[0].appendChild(pivotline);
	
	for (let a of arrows) a.remove();
	arrows = [];
	for (let i = 0; i < 2; i++)
	{
		let arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		arrow.setAttribute('d', 'M -5,5 L 0,0 L 5,5 M 0,0 L 0,12');
		arrow.setAttribute('fill', 'none');
		arrow.setAttribute('stroke', C_ACCENT);
		arrow.setAttribute('stroke-width', '3');
		arrow.setAttribute('opacity', 0);

		document.getElementsByTagName('svg')[0].appendChild(arrow);
		arrows.push(arrow);
	}

	timeline.clear();
	timeline.to({}, {duration: 1});

	function quick_sort_recursive(a, b)
	{
		if (a > b) return;
		let p = getPivot(rects, a, b);
		let pval = +rects[p].getAttribute('height');

		let c = a;
		for (let i = a; i <= b; i++)
			if (+rects[i].getAttribute('height') < pval) c++;

		// swap pivot into place
		timeline.to(rects[p], {fill: C_LOCKED, attr: {x: pad + c * W}, duration: 0.3});
		timeline.to(rects[c], {attr: {x: pad + p * W}, duration: 0.3}, "<");
		[rects[p], rects[c]] = [rects[c], rects[p]];

		if (a == b) return;

		// add pivot line for guidance
		timeline.to({}, {duration: 0.3});
		timeline.to(pivotline, {x: pad + a * W, y: 205 - pval, attr: {d: `M 0,0 L ${(b-a+1)*W},0`}, duration: 0});
		timeline.to(pivotline, {attr: {opacity: 1}, duration: 0.3});

		// move arrows and make visible
		let L = a, R = b;
		timeline.to(arrows[0], {x: pad + L * W + W/2, y: 210, duration: 0});
		timeline.to(arrows[1], {x: pad + R * W + W/2, y: 210, duration: 0});
		timeline.to(arrows[0], {attr: {opacity: 1}, duration: 0.3});
		timeline.to(arrows[1], {attr: {opacity: 1}, duration: 0.3}, "<");

		// begin partition
		while (L < c && c < R)
		{
			while (+rects[L].getAttribute('height') < pval) { L++; timeline.to(arrows[0], {x: "+="+W}); }
			if (c == L) break;
			while (+rects[R].getAttribute('height') > pval) { R--; timeline.to(arrows[1], {x: "-="+W}); }
			if (c == R) break;
			timeline.to(rects[L], {attr: {x: pad + R * W}, duration: 0.3});
			timeline.to(rects[R], {attr: {x: pad + L * W}, duration: 0.3}, "<");
			[rects[L], rects[R]] = [rects[R], rects[L]];
			L++; timeline.to(arrows[0], {x: "+="+W});
			R--; timeline.to(arrows[1], {x: "-="+W}, "<");
		}

		timeline.to(arrows[0], {attr: {opacity: 0}, duration: 0.3});
		timeline.to(arrows[1], {attr: {opacity: 0}, duration: 0.3}, "<");
		timeline.to({}, {duration: 0.5});
		timeline.to(pivotline, {attr: {opacity: 0}, duration: 0.3});

		timeline.to({}, {duration: 0.3});
		for (let i = c; i <= b; i++) timeline.to(rects[i], {attr: {opacity: 0.4}, duration: 0.3}, "<");

		quick_sort_recursive(a, c-1);

		timeline.to({}, {duration: 0.3});
		for (let i = a; i <= c-1; i++) timeline.to(rects[i], {attr: {opacity: 0.4}, duration: 0.3}, "<");
		for (let i = c+1; i <= b; i++) timeline.to(rects[i], {attr: {opacity: 1}, duration: 0.3}, "<");

		quick_sort_recursive(c+1, b);
		timeline.to({}, {duration: 0.3});
		for (let i = a; i <= b; i++) timeline.to(rects[i], {attr: {opacity: 1}, duration: 0.3}, "<");
	}

	quick_sort_recursive(0, N-1);
}