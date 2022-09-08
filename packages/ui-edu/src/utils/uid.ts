
export default ()=> new Array(50).fill(0).map(f=> Math.round(Math.random() * 32).toString(32)).join("") 