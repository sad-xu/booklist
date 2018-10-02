function Relation() {
	let nodeData, 
			linkData, 
			force,   // 力学仿真模型 
			canvas,
			ctx, 
			ID = "id",    // id
			radius = 15,  // 半径
			width = 600,	// 宽
			height = 600, // 高
			strength = -30,      // 节点间作用力
			distance = 20, // 连接线长度
			lineWidth = 2;
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
		ctx.beginPath()
		linkData.forEach(link => {
			ctx.moveTo(link.source.x, link.source.y)
			ctx.lineTo(link.target.x, link.target.y)
		})
		ctx.stroke()
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

