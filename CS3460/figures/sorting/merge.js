const C_ACTIVE = '#ffb86c';
const C_MOVING = '#ff7f2a';
const C_GROUP1 = '#ff6666';
const C_GROUP2 = '#6666ff';

const N = 16;
const W = 400 / N;

let rects = [], arrows = [];
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
		let h = 50 + (x * 100 / N);
		let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
		rect.setAttribute('fill', C_ACTIVE);
		rect.setAttribute('height', h);
		rect.setAttribute('stroke', 'white');
		rect.setAttribute('stroke-width', '2');
		rect.setAttribute('width', W);
		rect.setAttribute('x', 5 + i * W);
		rect.setAttribute('y', 155 - h);

		document.getElementsByTagName('svg')[0].appendChild(rect);
		rects.push(rect);
	}

	timeline.clear();
	timeline.to({}, {duration: 2});

	function merge_sort_recursive(a, b)
	{
		if (b == a) return;
		let mid = Math.floor((a + b) / 2);

		merge_sort_recursive(a, mid);
		merge_sort_recursive(mid+1, b);

		// change the merged elements to the correct color and move them
		timeline.to({}, {duration: 0.3});
		for (let i = a; i <= mid; i++)
			timeline.to(rects[i], {fill: C_GROUP1, attr: {y: "+=160", x: "-=4"}, duration: 0.3}, "<");
		for (let i = mid+1; i <= b; i++)
			timeline.to(rects[i], {fill: C_GROUP2, attr: {y: "+=160", x: "+=4"}, duration: 0.3}, "<");
		timeline.to({}, {duration: 0.1});

		// perform merge
		let L = rects.slice(a, mid+1), R = rects.slice(mid+1, b+1), moving;
		for (; L.length && R.length; a++)
		{
			moving = (+L[0].getAttribute('height') <= +R[0].getAttribute('height') ? L : R).shift();
			timeline.to(rects[a] = moving, {fill: C_ACTIVE, attr: {x: 5 + a * W, y: "-=160"}, duration: 0.3});
		}

		for (; L.length; a++) { moving = L.shift(); timeline.to(rects[a] = moving, {fill: C_ACTIVE, attr: {x: 5 + a * W, y: "-=160"}, duration: 0.3}); }
		for (; R.length; a++) { moving = R.shift(); timeline.to(rects[a] = moving, {fill: C_ACTIVE, attr: {x: 5 + a * W, y: "-=160"}, duration: 0.3}); }
		timeline.to({}, {duration: 0.5});
	}

	merge_sort_recursive(0, N-1);
}