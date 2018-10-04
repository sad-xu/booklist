function Relation() {
	let nodeData, // 节点数据
			linkData, // 联系数据
			force,   // 力学仿真模型 
			canvas,
			ctx, 
			ID = "id",    // id
			radius = 15,  // 半径
			width = 600,	// 宽
			height = 600, // 高
			strength = -30,      // 节点间作用力
			distance = 20, // 连接线长度
			lineWidth = 2; // 连接线宽度

	const drawArrow = function(p1, p2, len = 10, theta = 30) {

		// p5 箭头顶点  p1p2直线 与 p2为圆心的圆的交点
		let k = (p2[1] - p1[1]) / (p2[0] - p1[0])
		let x5 = (radius + 3) / Math.sqrt(1 + k * k) + p2[0],
				y5;
		if ((x5 > p1[0] && x5 > p2[0]) || (x5 < p1[0] && x5 < p2[0])) {
			x5 = -(radius + 3) / Math.sqrt(1 + k * k) + p2[0]
		}
		y5 = k * (x5 - p2[0]) + p2[1]

		// 箭头另外两个点
		let k1 = Math.tan(Math.atan(k) + theta * Math.PI / 180),
				k2 = Math.tan(Math.atan(k) - theta * Math.PI / 180);

		let x1 = len / Math.sqrt(1 + k1 * k1) + x5,
				y1 = k1 * (x1 - x5) + y5;
		if (Math.pow(x1 - (p1[0]+x5)/2, 2) + Math.pow(y1 - (p1[1]+y5)/2, 2) > (Math.pow(p1[0]-x5, 2) + Math.pow(p1[1]-y5, 2)) / 4) {
			x1 = -len / Math.sqrt(1 + k1 * k1) + x5
			y1 = k1 * (x1 - x5) + y5
		}

		let x2 = len / Math.sqrt(1 + k2 * k2) + x5,
				y2 = k2 * (x2 - x5) + y5;
		if (Math.pow(x2 - (p1[0]+x5)/2, 2) + Math.pow(y2 - (p1[1]+y5)/2, 2) > (Math.pow(p1[0]-x5, 2) + Math.pow(p1[1]-y5, 2)) / 4) {
			x2 = -len / Math.sqrt(1 + k2 * k2) + x5
			y2 = k2 * (x2 - x5) + y5
		}

		ctx.save()
		ctx.beginPath()
		ctx.moveTo(p1[0], p1[1])
		ctx.lineTo(p2[0], p2[1])
		ctx.stroke()	

		ctx.moveTo(x5, y5)
		ctx.lineTo(x1, y1)
		ctx.lineTo(x2, y2)
	  ctx.lineWidth = 2
	  ctx.fill()
	  ctx.restore()
	}

	this.init = function() {
		force = d3.forceSimulation()
							.force("charge", d3.forceManyBody().strength(strength))
							.force("center", d3.forceCenter(width / 2, height / 2))
							.force("collide", d3.forceCollide(1.2 * radius)), force.nodes(nodeData)
							.on("tick", this.render) 
		force.force("link", d3.forceLink().links(linkData).id(obj => obj[ID]).distance(distance))
		this.initDrag()
		ctx = canvas.getContext("2d")
		this.restart()
		this.pause()
	}, 
	this.render = function() {
		ctx.clearRect(0, 0, width, height)
		ctx.lineWidth = lineWidth
		ctx.strokeStyle = "black"
		// ctx.beginPath()
		linkData.forEach(link => {
			// ctx.moveTo(link.source.x, link.source.y)
			// ctx.lineTo(link.target.x, link.target.y)
			drawArrow([link.source.x, link.source.y], [link.target.x, link.target.y])
		})
		// ctx.stroke()
		ctx.lineWidth = 3
		ctx.strokeStyle = "black"
		nodeData.forEach(node => {
			ctx.fillStyle = node.color
			ctx.beginPath()
			ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
			ctx.fill()
			ctx.stroke()
		})
		ctx.font = "14px Comic Sans MS"
		ctx.fillStyle = "black"
		ctx.textAlign = "center"
		nodeData.forEach(node => ctx.fillText(node.name, node.x, node.y + 2.5 * node.radius))
	}, 
	this.initDrag = function() {
		d3.select(canvas)
			.call(
				d3.drag()
					.container(canvas)
					.subject(() => force.find(d3.event.x, d3.event.y))
					.on("start", () => {
						let e = d3.event
						e.active || force.alphaTarget(.3).restart()
						e.subject.fx = e.subject.x
						e.subject.fy = e.subject.y
					})
					.on("drag", () => {
						let e = d3.event
						e.subject.fx = e.x
					 	e.subject.fy = e.y
					})
					.on("end", () => {
						let e = d3.event
						e.active || force.alphaTarget(0)
					 	e.subject.fx = null
					 	e.subject.fy = null
					})
			)
	}, 
	this.pause = function() {
		force.stop()
	}, 
	this.run = function() {
		force.restart()
	}, 
	this.restart = function() {
		force.alpha(1)
		this.run()
	}, 
	this.setNodes = function(data) {
		nodeData = data
	}, 
	this.setLinks = function(data) {
		linkData = data
	}, 
	this.setId = function(id) {
		ID = id
	}, 
	this.setRadius = function(r) {
		radius = r
	}, 
	this.setCanvas = function(dom) {
		canvas = dom
	}, 
	this.setSize = function(w, h) {
		width = w, height = h
	}, 
	this.setCharge = function(value) {
		strength = value
	}, 
	this.setLinkLength = function(length) {
		distance = length
	}
}

