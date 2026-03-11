const C_ACTIVE = '#ffb86c';
const C_MOVING = '#ff7f2a';
const C_LOCKED = '#ff6666';
const C_ACCENT = '#bd93f9';

const N = 16;
const W = 400 / N;

let rects = [], bwindow;
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
		rect.setAttribute('x', 5 + i * W);
		rect.setAttribute('y', 205 - h);

		document.getElementsByTagName('svg')[0].appendChild(rect);
		rects.push(rect);
	}

	if (bwindow) bwindow.remove();
	bwindow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	bwindow.setAttribute('d', `M 0 0 L 0 30 L ${W} 30 L ${W} 0`);
	bwindow.setAttribute('fill', 'none');
	bwindow.setAttribute('stroke', C_ACCENT);
	bwindow.setAttribute('stroke-width', '6');
	bwindow.setAttribute('opacity', 0);
	document.getElementsByTagName('svg')[0].appendChild(bwindow);
	
	timeline.clear();
	timeline.to({}, {duration: 2});
	timeline.to(bwindow, {x: 5, y: 175, duration: 0});
	for (let i = 0; i < N; i++)
	{
		timeline.to({}, {duration: 0.5});

		let b = i;
		timeline.to(bwindow, {x: 5 + i * W, duration: 0});
		timeline.to(bwindow, {opacity: 1, duration: 0.3});
		timeline.to(rects[i], {attr: {fill: C_MOVING}, duration: 0});
		for (let j = i + 1; j < N; j++)
		{
			timeline.to(bwindow, {x: 5 + j * W, duration: 0.2});
			if (+rects[j].getAttribute('height') < +rects[b].getAttribute('height'))
			{
				timeline.to(rects[b], {attr: {fill: C_ACTIVE}, duration: 0});
				timeline.to(rects[j], {attr: {fill: C_MOVING}, duration: 0});
				b = j;
			}
		}
		timeline.to(bwindow, {opacity: 0, duration: 0.3});

		timeline.to(rects[b], {attr: {fill: C_MOVING}, duration: 0});
		timeline.to({}, {duration: 0.3});
		timeline.to(rects[b], {attr: {x: 5 + i * W}, duration: 0.3});
		timeline.to(rects[i], {attr: {x: 5 + b * W}, duration: 0.3}, "<");
		timeline.to(rects[b], {attr: {fill: C_LOCKED}, duration: 0});
		[rects[b], rects[i]] = [rects[i], rects[b]];
	}
}