import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators'
import { Post } from './post.model';

import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl +"/posts/";

@Injectable({ providedIn: 'root' })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], totalPostCount: number }>();

  constructor(private http: HttpClient, private router: Router) { }

  getPosts(pageSize: number, currentPage: number): void {
    const queryParams = `?pagesize=${pageSize}&currentpage=${currentPage}`;
    this.http.get<{ message: string, posts: any, totalPostCount: number }>
      (BACKEND_URL + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              createdBy: post.createdBy
            }
          }),
          totalPostCount: postData.totalPostCount
        }
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({ posts: [...this.posts], totalPostCount: transformedPosts.totalPostCount });
      });
  }

  getPostUpdateListener(): Observable<{ posts: Post[], totalPostCount: number }> {
    return this.postsUpdated.asObservable();
  }

  getPost(postId: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string,createdBy: string }>(BACKEND_URL + postId);
  }

  addPost(title: string, content: string, image: File): void {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData).subscribe((response) => {
      this.router.navigate(["/"]);
    });
  }

  updatePost(postId: string, title: string, content: string, image: File | string): void {
    let post;
    if (typeof (image) === "string") {
      post = {
        id: postId,
        title: title,
        content: content,
        image: image
      };
    } else {
      post = new FormData();
      post.append("id", postId);
      post.append("title", title);
      post.append("content", content);
      post.append("image", image, title);
    }

    this.http.put(BACKEND_URL + postId, post).subscribe((response) => {
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
