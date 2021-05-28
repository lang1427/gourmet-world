$(function () {
    console.log('hahahha')
})

let red: number[] = []
let green: number[] = []
for (let i = 0; i < 5; i++) {
    red.push(Math.ceil(Math.random() * 35))
}
for (let i = 0; i < 2; i++) {
    green.push(Math.ceil(Math.random() * 12))
}

console.log(red,green)