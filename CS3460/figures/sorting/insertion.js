const C_ACTIVE = '#ffb86c';
const C_MOVING = '#ff7f2a';
const C_LOCKED = '#ff6666';
const C_ACCENT = '#bd93f9';

const N = 16;
const W = 400 / N;

let rects = [], divider;
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

	if (divider) divider.remove();
	divider = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	divider.setAttribute('d', 'M 0 0 L 0 210');
	divider.setAttribute('fill', 'none');
	divider.setAttribute('stroke', C_ACCENT);
	divider.setAttribute('stroke-width', '6');
	divider.setAttribute('stroke-dasharray', '15,5');
	divider.setAttribute('opacity', 0);
	document.getElementsByTagName('svg')[0].appendChild(divider);
	
	timeline.clear();
	timeline.to({}, {duration: 2});
	timeline.to(rects[0], {attr: {fill: C_LOCKED}, duration: 0});
	
	timeline.to(divider, {x: 5 + W, duration: 0});
	timeline.to(divider, {opacity: 0.8, duration: 0.3});
	for (let i = 1; i < N; i++)
	{
		timeline.to({}, {duration: 0.5});
		timeline.to(divider, {x: 5 + (i+1) * W, duration: 0.2});
		timeline.to(rects[i], {attr: {fill: C_MOVING}, duration: 0});
		timeline.to({}, {duration: 0.5});

		let j = i;
		for (; j > 0; j--)
		{
			if (+rects[j].getAttribute('height') < +rects[j-1].getAttribute('height'))
			{
				timeline.to(rects[j-0], {attr: {x: 5 + (j-1) * W}, duration: 0.2});
				timeline.to(rects[j-1], {attr: {x: 5 + (j-0) * W}, duration: 0.2}, "<");
				[rects[j], rects[j-1]] = [rects[j-1], rects[j]];
			}
			else break;
		}
		timeline.to(rects[j], {attr: {fill: C_LOCKED}, duration: 0});
	}
	timeline.to(divider, {opacity: 0, duration: 0.3});
}