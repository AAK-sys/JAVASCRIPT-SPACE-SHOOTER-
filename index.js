const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
var count = 0
let xpos
let ypos
canvas.width = innerWidth
canvas.height = innerHeight

class Player {
	constructor(x, y, radius, color){
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
	}

	draw(){
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}
}

class Enemy {
	constructor(x,y,radius,color, velocity){
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}
	draw(){
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}

	update () {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}

class Projectile{
	constructor(x,y,radius,color, velocity){
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}
	draw(){
		c.beginPath()
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
		c.fillStyle = this.color
		c.fill()
	}

	update () {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}

const x = canvas.width/2
const y = canvas.height/2
const radius = 10
const color = 'red'
const player = new Player(x, y, radius, color)


const projectiles = []
const enemies = []

function spawnEnemies(){
	setInterval(()=>{
		const radius = Math.random() * (30-5) + 5
		const x = Math.random()<0.5 ? 0 - radius : Math.random() * canvas.width - radius
		const y = Math.random()<0.5 ? 0 - radius : Math.random() * canvas.height + radius
		const color = `hsl(${Math.random() * 360}, 50%, 50%)`

		const angle = Math.atan2(canvas.width / 2 - x, canvas.height / 2 - y)
		const velocity = {x:Math.sin(angle) * 5, y:Math.cos(angle) * 5}
		enemies.push(new Enemy (x,y,radius,color, velocity))
	}, 1000)
}

function explosion(){
	var speed = 40
	var amount = 100
	if(count%1000 == 0 && count != 0){
		for(let i = 0;i<100; i++ ){
			const angle = Math.atan2(xpos,ypos)
			const expo1 = {x:Math.sin(angle) * Math.random() * speed,y:Math.cos(angle) * Math.random() * speed}
			const expo2 = {x:Math.sin(angle) * Math.random() * speed,y:Math.cos(angle) * Math.random() * -1*speed}
			const expo3 = {x:Math.sin(angle) * Math.random() * -1*speed,y:Math.cos(angle) * Math.random() * speed}
			const expo4 = {x:Math.sin(angle) * Math.random() * -1*speed,y:Math.cos(angle) * Math.random() * -1*speed}
			projectiles.push(new Projectile(canvas.width/2, canvas.height/2, 5, 'white', expo1))
			projectiles.push(new Projectile(canvas.width/2, canvas.height/2, 5, 'white', expo2))
			projectiles.push(new Projectile(canvas.width/2, canvas.height/2, 5, 'white', expo3))
			projectiles.push(new Projectile(canvas.width/2, canvas.height/2, 5, 'white', expo4))
		}
	}
}	

let animationId
function animate(){
	animationId = requestAnimationFrame(animate)
	c.fillStyle = 'rgba(0, 0, 0, 0.1)'
	c.fillRect(0,0, canvas.width,canvas.height)
	player.draw()
	projectiles.forEach((projectile, index) =>{
		projectile.draw()
		projectile.update()
		if(
			projectile.x - projectile.radius<0 ||
			projectile.x - projectile.radius > canvas.width ||
			projectile.y + projectile.radius < 0 ||
			projectile.y - projectile.radius >canvas.height
			){
			setTimeout(()=>{
				projectiles.splice(index, 1)
			})
		}
	})
	
	c.font = "80px Monospace"
	c.fillStyle = 'white'
	c.fillText(count, canvas.width/2-40, 100);
	
	enemies.forEach((enemy, index) => {
		enemy.update()
		const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y)
		if(dist - enemy.radius - player.radius < 1){
			cancelAnimationFrame(animationId)
		}
		projectiles.forEach((projectile,projectileindex) =>{
			const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
			if(dist - enemy.radius - projectile.radius < 1){
				setTimeout(()=>{
					enemies.splice(index,1)
					projectiles.splice(projectileindex,1)
					count = count + 100
				})
			}
		})
	})
}
console.log(player)

addEventListener('click',(event) =>{
	console.log(projectiles)
	explosion()
	xpos =  event.clientX - canvas.width / 2
	ypos =  event.clientY - canvas.height / 2
	const angle = Math.atan2(
		xpos,ypos
	 )
	const velocity = {
		x:Math.sin(angle) * 5,
		y:Math.cos(angle) * 5
	}

	
	projectiles.push( new Projectile(canvas.width/2, canvas.height/2, 
	5, 'white', velocity))
	if(count>100){
		const velocity = {
		x:(Math.sin(angle)) * -4,
		y:(Math.cos(angle)) * -4
		}
		projectiles.push( new Projectile(canvas.width/2, canvas.height/2, 
	5, 'white',velocity))
		projectiles.push( new Projectile(canvas.width/2, canvas.height/2, 
	5, 'white',{
		x:(Math.sin(angle)) * -4,
		y:(Math.cos(angle)) * 4
		}))
		projectiles.push( new Projectile(canvas.width/2, canvas.height/2, 
	5, 'white',{
		x:(Math.sin(angle)) * 4,
		y:(Math.cos(angle)) * -4
		}))
	}
})
animate()
spawnEnemies()

