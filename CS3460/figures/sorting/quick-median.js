function getPivot(rects, a, b)
{
	let h = rects.map(x => +x.getAttribute('height'));
	let hx = [...h.entries()].slice(a, b+1).toSorted(([ix, x], [iy, y]) => x - y);
	return hx[Math.floor(hx.length / 2)][0];
}