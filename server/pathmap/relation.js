function Relation(obj) {
	let { nodeData = [], linkData = [], canvas = null, 
				width = 1300, height = 600, radius = 14, 
				lineWidth = 2, lineLength = 90, strength = -60 } = obj

	this.nodeData = nodeData 			// 节点数据
	this.linkData = linkData 			// 联系数据
	this.canvas = canvas					// 画布
	this.width = width						// 画布宽
	this.height = height 					// 画布高
	this.radius = radius					// 节点半径
	this.lineWidth = lineWidth		// 连接线宽度
	this.lineLength = lineLength	// 连接线长度
	this.strength = strength  		// 节点间作用力
	this.ctx = null
	this.ID = 'name'
	this.force = null							// D3力学仿真模型

	this.colorList = [
		"rgb(255, 114, 92)", "rgb(255, 51, 169)", "rgb(255, 67, 255)",
		"rgb(176, 99, 255)", "rgb(108, 138, 255)", "rgb(56, 255, 255)",
		"rgb(5, 255, 255)", "rgb(0, 255, 255)", "rgb(0, 255, 232)", 
		"rgb(130, 255, 137)", "rgb(237, 255, 126)", "rgb(255, 255, 97)",
		"rgb(255, 255, 101)", "rgb(255, 255, 12)", "rgb(255, 255, 0)", 
		"rgb(255, 149, 58)", "rgb(207, 145, 123)", "rgb(164, 213, 237)", 
		"rgb(255, 255, 255)"
	]
	this.colorFormat = function(i) {
		return this.colorList[i % this.colorList.length]
	}
}

Relation.prototype.drawLink = function(p1, p2, len = 10, theta = 30) {
	const ctx = this.ctx
	// p5 箭头顶点  p1p2直线 与 p2为圆心的圆的交点
	let k = (p2[1] - p1[1]) / (p2[0] - p1[0])
	let x5 = this.radius / Math.sqrt(1 + k * k) + p2[0],
			y5;
	if ((x5 > p1[0] && x5 > p2[0]) || (x5 < p1[0] && x5 < p2[0])) {
		x5 = -this.radius / Math.sqrt(1 + k * k) + p2[0]
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

Relation.prototype.init = function() {
	const that = this
	this.ctx = this.canvas.getContext("2d")
	this.force = d3.forceSimulation()
						.force("charge", d3.forceManyBody().strength(this.strength))
						.force("center", d3.forceCenter(this.width / 2, this.height / 2))
						.force("collide", d3.forceCollide(1.2 * this.radius)), this.force.nodes(this.nodeData)
						.on("tick", () => {that.render.call(that)}) 
	this.force.force("link", d3.forceLink().links(this.linkData).id(obj => obj[this.ID]).distance(this.lineLength))
	this.initDrag()

	this.force.alpha(1)
	this.force.restart()
	// this.force.stop()
	// this.force.restart()
}

Relation.prototype.render = function() {
	const that = this
	const ctx = this.ctx
	ctx.clearRect(0, 0, this.width, this.height)
	ctx.lineWidth = this.lineWidth
	ctx.strokeStyle = "black"
	this.linkData.forEach(link => {
		that.drawLink([link.source.x, link.source.y], [link.target.x, link.target.y])
	})
	ctx.lineWidth = 2
	ctx.strokeStyle = "black"
	this.nodeData.forEach((node, index) => {
		ctx.fillStyle = that.colorFormat(index) //node.color
		ctx.beginPath()
		ctx.arc(node.x, node.y, that.radius, 0, 2 * Math.PI)
		ctx.fill()
		ctx.stroke()
	})
	ctx.font = "14px Comic Sans MS"
	ctx.fillStyle = "black"
	ctx.textAlign = "center"
	this.nodeData.forEach(node => ctx.fillText(node.name, node.x, node.y + 2.5 * that.radius))
}


Relation.prototype.initDrag = function() {
	const force = this.force
	d3.select(this.canvas)
		.call(
			d3.drag()
				.container(this.canvas)
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
}
