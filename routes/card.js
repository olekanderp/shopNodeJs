const {Router} = require('express')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth')


function mapCoursesItems (cart) {
  return cart.items.map(c => ({
    ...c.courseId._doc,
    count: c.count,
    id: c.courseId.id
  }))
}


function computePrice (course) {
  return course.reduce((total, course) => {
    return total += course.price * course.count
  }, 0)
}

router.post('/add', auth, async (req, res) => {
  const course = await Course.findById(req.body.id)
  await req.user.addToCart(course)
  res.redirect('/card')
})

router.delete('/remove/:id', auth, async (req, res) => {
  await req.user.removeFromBasket(req.params.id);
  const user = await req.user.populate('basket.items.courseId').execPopulate();
  const courses = mapCoursesItems(user.basket)
  const cart = {
    courses, price: computePrice(courses)
  }

  res.status(200).json(cart)

})

router.get('/', auth, async (req, res) => {
  const user = await req.user.populate('basket.items.courseId').execPopulate()

  const course = mapCoursesItems(user.basket);


  res.render('card', {
    title: 'Корзина',
    isCard: true,
    courses: course,
    price: computePrice(course)
  })

})

module.exports = router