const express = require('express')
const router = express.Router()
const connection = require('../db/mysqldb.js')

// // 发布文章
// router.post('/api/article', (req, res) => {
//   const article = {
//     title: req.body.title,
//     author: req.body.author,
//     content: req.body.content,
//     createTime: Date(),
//     tags: req.body.tags,
//     isPublish: true
//   }
//   new db.Article(article).save()
//   res.status(200).send('succeed in saving new passage.')
// })

// 获取某篇文章
router.get('/api/article', (req, res) => {
  connection.query(
    'SELECT aid, title, author, tags, createTime, updateTime, content FROM article',
    function(err, doc) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message)
        return
      } else if (doc) {
        for (var i = 0; i <= doc.length; i++) {
          if (doc[i].aid == req.query.aid) {
            res.status(200).send(doc[i])
            break
          }
        }
      } else {
        res.status(404).send(err.message)
      }
    }
  )
})

// 删除文章
router.delete('/api/article', (req, res) => {
  connection.query(
    "DELETE FROM article where article.aid = '${req.query.aid}'",
    function(err, doc) {
      if (err) {
        console.log('[SELECT ERROR] - ', err.message)
        return
      } else if (doc) {
        console.log(doc)
        res.status(200).send('删除成功')
      } else {
        res.status(404).send(err.message)
      }
    }
  )
})

// // 修改文章（或者搞懂patch）
// router.patch('/api/article', (req, res) => {
//   const aid = req.params.aid
//   const article = {
//     title: req.body.title,
//     author: req.body.author,
//     tags: req.body.tags,
//     updateTime: Date(),
//     content: req.body.content,
//     isPublish: true
//   }
//   db.Article.update({ aid: aid }, article, (err, data) => {
//     if (err) {
//       console.log(err)
//     } else {
//       res.status(200).send('succeed in updating ---' + data.title)
//     }
//   })
// })

// 获取文章列表
router.get('/api/articles', (req, res) => {
  connection.query('SELECT aid, title FROM article', function(err, article) {
    if (err) {
      console.log('[SELECT ERROR] - ', err.message)
      return
    } else if (article) {
      // if (aid) {
      // const token = creatToken(doc._id, doc.name)
      console.log(article)
      res.status(200).send({
        list: article
      })
      // } else {
      //   res.send('no data!')
      // }
    } else {
      res.status(404).send('no data!')
      // res.send(err.message)
    }
  })
})

// 搜索一些文章
// router.get('/api/someArticles', (req, res) => {
//   const key = req.query.payload.key
//   const value = req.query.payload.value
//   const page = req.query.payload.page || 1
//   const skip = 4 * (page - 1)
//   const re = new RegExp(value, 'i')
//   if (key === 'tags') {
//     // 根据标签来搜索文章
//     const arr = value.split(' ')
//     db.Article.find({ tags: { $all: arr } })
//       .sort({ date: -1 })
//       .limit(4)
//       .skip(skip)
//       .exec()
//       .then(articles => {
//         res.send(articles)
//       })
//   } else if (key === 'title') {
//     // 根据标题的部分内容来搜索文章
//     db.Article.find({ title: re, isPublish: true })
//       .sort({ date: -1 })
//       .limit(4)
//       .skip(skip)
//       .exec()
//       .then(articles => {
//         res.send(articles)
//       })
//   } else if (key === 'date') {
//     // 根据日期来搜索文章
//     const nextDay = value + 'T24:00:00'
//     db.Article.find({ date: { $gte: new Date(value), $lt: new Date(nextDay) } })
//       .sort({ date: -1 })
//       .limit(4)
//       .skip(skip)
//       .exec()
//       .then(articles => {
//         res.send(articles)
//       })
//   }
// })

module.exports = router
