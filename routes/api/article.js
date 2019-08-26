const express = require('express')
const router = express.Router()
const connection = require('../db/mysqldb.js')

// 发布文章
router.post('/api/article', (req, res) => {
  const article = {
    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
    createTime: Date(),
    tags: req.body.tags,
    isPublish: true
  }
  new db.Article(article).save()
  res.status(200).send('succeed in saving new passage.')
})

// 获取某篇文章
router.get('/api/article/:aid', (req, res) => {
  db.Article.findOne({ aid: req.params.aid }, (err, doc) => {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send(doc)
    }
  })
})

// 删除文章
router.delete('/api/article/:aid', (req, res) => {
  db.Article.remove({ aid: req.params.aid }, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send('succeed in deleting ---' + data)
    }
  })
})

// 修改文章（或者搞懂patch）
router.patch('/api/article/:aid', (req, res) => {
  const aid = req.params.aid
  const article = {
    title: req.body.title,
    author: req.body.author,
    tags: req.body.tags,
    updateTime: Date(),
    content: req.body.content,
    isPublish: true
  }
  db.Article.update({ aid: aid }, article, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.status(200).send('succeed in updating ---' + data.title)
    }
  })
})

// 获取很多文章
router.get('/api/articles', (req, res) => {
  const page = req.query.payload.page
  const value = req.query.payload.value
  const limit = req.query.payload.limit - 0 || 4
  const skip = limit * (page - 1)
  if (value && value !== '全部') {
    db.Article.find({ tags: value, isPublish: true })
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip)
      .exec()
      .then(articles => {
        res.send(articles)
      })
  } else {
    db.Article.find({ isPublish: true })
      .sort({ date: -1 })
      .limit(limit)
      .skip(skip)
      .exec()
      .then(articles => {
        res.send(articles)
      })
  }
})

// 搜索一些文章
router.get('/api/someArticles', (req, res) => {
  const key = req.query.payload.key
  const value = req.query.payload.value
  const page = req.query.payload.page || 1
  const skip = 4 * (page - 1)
  const re = new RegExp(value, 'i')
  if (key === 'tags') {
    // 根据标签来搜索文章
    const arr = value.split(' ')
    db.Article.find({ tags: { $all: arr } })
      .sort({ date: -1 })
      .limit(4)
      .skip(skip)
      .exec()
      .then(articles => {
        res.send(articles)
      })
  } else if (key === 'title') {
    // 根据标题的部分内容来搜索文章
    db.Article.find({ title: re, isPublish: true })
      .sort({ date: -1 })
      .limit(4)
      .skip(skip)
      .exec()
      .then(articles => {
        res.send(articles)
      })
  } else if (key === 'date') {
    // 根据日期来搜索文章
    const nextDay = value + 'T24:00:00'
    db.Article.find({ date: { $gte: new Date(value), $lt: new Date(nextDay) } })
      .sort({ date: -1 })
      .limit(4)
      .skip(skip)
      .exec()
      .then(articles => {
        res.send(articles)
      })
  }
})

module.exports = router
