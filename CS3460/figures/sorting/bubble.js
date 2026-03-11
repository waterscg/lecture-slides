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
	bwindow = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	bwindow.setAttribute('fill', 'none');
	bwindow.setAttribute('height', 206);
	bwindow.setAttribute('stroke', C_ACCENT);
	bwindow.setAttribute('stroke-width', '3');
	bwindow.setAttribute('width', 2 * W + 6);
	bwindow.setAttribute('x', 0);
	bwindow.setAttribute('y', 2);
	bwindow.setAttribute('opacity', 0);
	document.getElementsByTagName('svg')[0].appendChild(bwindow);
	
	timeline.clear();
	timeline.to({}, {duration: 2});
	for (let i = 0; i < N - 1; i++)
	{
		timeline.to(bwindow, {attr: {x: 2}, duration: 0});
		timeline.to(bwindow, {opacity: 1, duration: 0.2});

		for (let j = 0; j < N-1-i; j++)
		{
			timeline.to({}, {duration: 0.1});
			timeline.to(bwindow, {attr: {x: 2 + j * W}, duration: 0.2});
			timeline.to(rects[j+0], {attr: {fill: C_MOVING}, duration: 0});
			timeline.to(rects[j+1], {attr: {fill: C_MOVING}, duration: 0});
			timeline.to({}, {duration: 0.1});

			if (+rects[j].getAttribute('height') > +rects[j+1].getAttribute('height'))
			{
				timeline.to(rects[j+0], {attr: {x: 5 + (j+1) * W}, duration: 0.2});
				timeline.to(rects[j+1], {attr: {x: 5 + (j+0) * W}, duration: 0.2}, "<");
				timeline.to({}, {duration: 0.1});
				[rects[j+0], rects[j+1]] = [rects[j+1], rects[j+0]];
			}

			timeline.to(rects[j+0], {attr: {fill: C_ACTIVE}, duration: 0});
			timeline.to(rects[j+1], {attr: {fill: C_ACTIVE}, duration: 0});
		}

		timeline.to(rects[N-1-i], {attr: {fill: C_LOCKED}, duration: 0});
		timeline.to(bwindow, {opacity: 0, duration: 0.2});
		timeline.to({}, {duration: 1});
	}
	timeline.to(rects[0], {attr: {fill: C_LOCKED}, duration: 0});
}