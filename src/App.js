import React, { useState, useEffect } from 'react';
import Dexie from 'dexie';
import './App.css';

function App() {

  const db = new Dexie("mytidbit");

  db.version(1).stores({
    posts: "title, content, file"
  });

  db.open().catch((err) => {
    console.log(err);
  });

  const [postTitle, setTitle] = useState("");
  const [postContent, setContent] = useState("");
  const [postFile, setFile] = useState("");
  const [posts, setPosts] = useState("");

  useEffect(() => {
    const getPosts = async () => {
      let posts = await db.posts.toArray();
      setPosts(posts)
    };

    getPosts();
  }, []);

const getPostInfo = (e) => {

    e.preventDefault();

    if(postTitle !== "" && postContent !== "" && postFile !== ""){

        let post = {
            title: postTitle,
            content: postContent,
            file: postFile
        }
       
        db.posts.add(post).then(async () => {
 
            let posts = await db.posts.toArray();
            setPosts(posts);
        });
    }
};

const deletePost = async (id) => {
  db.posts.delete(id);
  let posts = await db.posts.toArray();
  setPosts(posts);
};

const getFile = (e) => {
  let reader = new FileReader();
  reader.readAsDataURL(e[0]);
  reader.onload= (e) => {
      setFile(reader.result);
  }
};


  let postData = posts.length > 0 ? <div className="postsContainer">
      {
        posts.map(post => {
          return <div className="post" key={post.title}>
            <div style={{ backgroundImage: `url(${post.file})` }} />
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <button className="delete" onClick={() => deletePost(post.title)}>Delete</button>
          </div>
        })
      }
    </div>
: <div className="message">
      <p>Deepak....Il n'ya pas de posts........</p>
    </div>

    const handleSetTitle = (e)=>{
      setTitle(e.target.value)
    };

    const handleSetContent = (e)=>{
      setContent(e.target.value)
    };
  
  return (
    <div className="App">
      <form onSubmit={getPostInfo}>
        <div className="control">
          <label>Title</label>
          <input type="text" name="title" onChange={handleSetTitle} />
        </div>
        <div className="control">
          <label>Content</label>
          <textarea name="content" onChange={handleSetContent} />
        </div>
        <div className="control" style={{position:'relative', left:'40%', marginTop:'10px'}}>
          <label htmlFor="cover" className="cover">Choose a file</label>
          <input type="file" id="cover" name="file" onChange={e => getFile(e.target.files)} />
        </div>

        <input type="submit" value="Submit" style={{marginTop:'10px', marginLeft:'5px'}}/>
      </form>
      {postData}
    </div>
  );
}

export default App;
