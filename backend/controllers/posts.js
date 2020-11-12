const Post = require('../models/post');

exports.createPost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    createdBy: req.userData.userId
  });
  console.log(post);
  post.save().then(createdPost => {
    res.status(201).json({
      message: "Post added successfully",
      post: {
        ...createdPost,
        id: createdPost._id,
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: "Post creation failed"
    });
  })
}

exports.updatePost = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  console.log(req.file);
  let imagePath;
  if (req.file) {
    imagePath = url + "/images/" + req.file.filename;
  } else {
    imagePath = req.body.imagePath;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    createdBy: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, createdBy: req.userData.userId }, post).then((result) => {
    console.log(result)
    if (result.n > 0) {
      res.status(200).json({ message: "Post updated successfully" });
    } else {
      res.status(401).json({ message: "You are unauthorized" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Post updation failed"
    });
  })
}

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.currentpage;
  let fetchedPostData;
  const postQuery = Post.find();
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then(documents => {
      console.log(documents)
      fetchedPostData = documents;
      return Post.estimatedDocumentCount()
    }).then((count) => {
      res.status(200).send({
        message: "Server processed your request successfully",
        posts: fetchedPostData,
        totalPostCount: count
      });
    }).catch(error => {
      res.status(500).json({
        message: "Could not fetch posts"
      });
    });
}

exports.getPost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then(post => {
      console.log(post)
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    }).catch(error => {
      res.status(500).json({
        message: "Could not fetch posts"
      });
    });
}

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, createdBy: req.userData.userId }).then(response => {
    console.log(response);
    if (response.n > 0) {
      res.status(200).json({ message: "Post Deleted successfully" });
    } else {
      res.status(401).json({ message: "You are unauthorized" });
    }
  }).catch(error => {
    res.status(500).json({
      message: "Could not delete post"
    });
  });
}
