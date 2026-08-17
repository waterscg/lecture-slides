const C_ACTIVE = '#ffb86c';
const C_OUTLINE = '#ffffff';
const C_ACCENT = '#bd93f9';
const NODE_RADIUS = 35;

class Node
{
	constructor(data)
	{
		this.data = data;
		this.parent = null;
		this.lt = null;
		this.rt = null;
	}
}

class EmbedNode extends Node
{
	constructor(data)
	{
		super(data);
		let c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
		c.setAttribute('fill', C_ACTIVE);
		c.setAttribute('stroke', C_OUTLINE);
		c.setAttribute('stroke-width', '5');
		c.setAttribute('r', NODE_RADIUS);
		c.setAttribute('cx', 0);
		c.setAttribute('cy', 0);

		let t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
		t.setAttribute('x', '0');
		t.setAttribute('y', '0');
		t.textContent = data;

		let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
		g.appendChild(c);
		g.appendChild(t);

		document.getElementsByTagName('svg')[0].appendChild(g);
		this.obj = g;
	}

	getWidth()
	{
		return NODE_RADIUS*2 + (this.lt ? this.lt.getWidth() : 0) + (this.rt ? this.rt.getWidth() : 0);
	}

	getRootX()
	{
		return (this.lt ? this.lt.getWidth() : 0) + NODE_RADIUS;
	}

	getAllNodes()
	{
		let nodes = [this];
		if (this.lt) nodes = nodes.concat(this.lt.getAllNodes());
		if (this.rt) nodes = nodes.concat(this.rt.getAllNodes());
	}
}