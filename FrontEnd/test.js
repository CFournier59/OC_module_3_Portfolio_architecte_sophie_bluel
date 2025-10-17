let reponse= await fetch("http://localhost:5678/api/categories")
const categories = await reponse.json()
console.log(categories)

reponse = await fetch("http://localhost:5678/api/works")
const works = await reponse.json()
console.log(works) 